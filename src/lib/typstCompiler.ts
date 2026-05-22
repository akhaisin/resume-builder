import { TypstSnippet } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'

const DEFAULT_COMPILER_WASM_PATH = '/typst_ts_web_compiler_bg.wasm'
const DEFAULT_RENDERER_WASM_PATH = '/typst_ts_renderer_bg.wasm'
const DEFAULT_DATA_FILE_PATH = '/data.json'
const DEFAULT_MAIN_FILE_PATH = '/main.typ'
const DEFAULT_INPUT_NAME = 'data'
const FORMAT_VECTOR = 0

type WasmModuleSource = string | BufferSource | WebAssembly.Module
type WrappedWasmModuleSource = { module_or_path: WasmModuleSource }

interface TypstRendererLike {
  init(options: { getModule: () => WasmModuleSource }): Promise<void>
  render(options: {
    artifactContent: Uint8Array
    format: 'vector'
    container: HTMLElement
    pixelPerPt?: number
    backgroundColor?: string
  }): Promise<void>
}

export interface TypstCompilerOptions {
  compilerWasmPath?: WasmModuleSource
  rendererWasmPath?: WasmModuleSource
}

export interface TypstPreviewOptions {
  pixelPerPt?: number
  backgroundColor?: string
}

export interface TypstCompiler {
  updateJson(json: string): void
  updateTypst(typst: string): void
  compilePdf(): Promise<Uint8Array>
  compileSvg(): Promise<string>
  renderPreview(container: HTMLElement, options?: TypstPreviewOptions): Promise<void>
}

let typstCompileLock: Promise<void> = Promise.resolve()
let rendererPromise: Promise<TypstRendererLike> | null = null

function runWithTypstLock<T>(task: () => Promise<T>) {
  const run = typstCompileLock.catch(() => undefined).then(task)
  typstCompileLock = run.then(() => undefined, () => undefined)
  return run
}

function formatDiagnostics(diagnostics: unknown): string {
  if (!Array.isArray(diagnostics) || diagnostics.length === 0) {
    return 'Typst compilation failed with no diagnostics.'
  }

  return diagnostics
    .map((diagnostic) =>
      typeof diagnostic === 'string'
        ? diagnostic
        : (diagnostic as { message?: string }).message ?? JSON.stringify(diagnostic),
    )
    .join('\n')
}

export function createTypstCompiler(
  options: TypstCompilerOptions = {},
): TypstCompiler {
  const compilerWasmPath = options.compilerWasmPath ?? DEFAULT_COMPILER_WASM_PATH
  const rendererWasmPath = options.rendererWasmPath ?? DEFAULT_RENDERER_WASM_PATH

  let snippet: TypstSnippet | null = null
  let initPromise: Promise<void> | null = null
  let storedJson: string | null = null
  let storedTypst: string | null = null

  function wrapModuleSource(moduleSource: WasmModuleSource) {
    return { module_or_path: moduleSource } as WrappedWasmModuleSource as unknown as WasmModuleSource
  }

  async function getRenderer() {
    if (!rendererPromise) {
      rendererPromise = (async () => {
        const { createTypstRenderer } = await import('@myriaddreamin/typst.ts/renderer')
        const renderer = createTypstRenderer() as TypstRendererLike
        await renderer.init({ getModule: () => wrapModuleSource(rendererWasmPath) })
        return renderer
      })()
    }

    return rendererPromise
  }

  async function init() {
    const nextSnippet = new TypstSnippet()
    nextSnippet.use(TypstSnippet.preloadFontAssets())
    nextSnippet.setCompilerInitOptions({ getModule: () => wrapModuleSource(compilerWasmPath) })
    nextSnippet.setRendererInitOptions({ getModule: () => wrapModuleSource(rendererWasmPath) })
    snippet = nextSnippet
  }

  function ensureInitialized() {
    if (snippet) return Promise.resolve()
    if (!initPromise) initPromise = init()
    return initPromise
  }

  function getStoredJson() {
    if (storedJson === null) {
      throw new Error('No stored resume JSON. Call updateJson() first.')
    }
    return storedJson
  }

  function getStoredTypst() {
    if (storedTypst === null) {
      throw new Error('No stored Typst source. Call updateTypst() first.')
    }
    return storedTypst
  }

  async function mountStoredFiles() {
    const json = getStoredJson()
    const typst = getStoredTypst()

    await ensureInitialized()

    const currentSnippet = snippet!
    const encoder = new TextEncoder()

    await currentSnippet.resetShadow()
    await currentSnippet.mapShadow(DEFAULT_DATA_FILE_PATH, encoder.encode(json))
    await currentSnippet.mapShadow(DEFAULT_MAIN_FILE_PATH, encoder.encode(typst))
  }

  async function compileVector() {
    await mountStoredFiles()
    const compiler = await (snippet! as unknown as { getCompiler(): Promise<unknown> }).getCompiler()
    const result = await (
      compiler as {
        compile(options: {
          mainFilePath: string
          inputs: Record<string, string>
          diagnostics: 'full'
          format: number
        }): Promise<{ result?: Uint8Array; diagnostics?: unknown }>
      }
    ).compile({
      mainFilePath: DEFAULT_MAIN_FILE_PATH,
      inputs: { [DEFAULT_INPUT_NAME]: DEFAULT_DATA_FILE_PATH },
      diagnostics: 'full',
      format: FORMAT_VECTOR,
    })

    if (!result?.result) {
      throw new Error(formatDiagnostics(result?.diagnostics))
    }

    return result.result
  }

  async function compilePdf() {
    return runWithTypstLock(async () => {
      await mountStoredFiles()
      const artifact = await snippet!.pdf({
        mainFilePath: DEFAULT_MAIN_FILE_PATH,
        inputs: { [DEFAULT_INPUT_NAME]: DEFAULT_DATA_FILE_PATH },
      })

      if (!artifact) {
        throw new Error('Typst PDF compilation returned no artifact.')
      }

      return artifact
    })
  }

  async function compileSvg() {
    return runWithTypstLock(async () => {
      await mountStoredFiles()
      return snippet!.svg({
        mainFilePath: DEFAULT_MAIN_FILE_PATH,
        inputs: { [DEFAULT_INPUT_NAME]: DEFAULT_DATA_FILE_PATH },
      })
    })
  }

  async function renderPreview(container: HTMLElement, previewOptions: TypstPreviewOptions = {}) {
    return runWithTypstLock(async () => {
      const artifact = await compileVector()
      const renderer = await getRenderer()

      await renderer.render({
        artifactContent: artifact,
        format: 'vector',
        container,
        pixelPerPt: previewOptions.pixelPerPt ?? 3,
        backgroundColor: previewOptions.backgroundColor ?? '#ffffff',
      })
    })
  }

  function updateJson(json: string) {
    storedJson = json
  }

  function updateTypst(typst: string) {
    storedTypst = typst
  }

  return {
    updateJson,
    updateTypst,
    compilePdf,
    compileSvg,
    renderPreview,
  }
}

const defaultCompiler = createTypstCompiler()

export const updateJson = defaultCompiler.updateJson
export const updateTypst = defaultCompiler.updateTypst
export const compilePdf = defaultCompiler.compilePdf
export const compileSvg = defaultCompiler.compileSvg