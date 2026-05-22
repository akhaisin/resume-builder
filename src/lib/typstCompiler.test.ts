import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { createTypstCompiler } from './typstCompiler'

const compilerWasmPath = await readFile(
  new URL('../../public/typst_ts_web_compiler_bg.wasm', import.meta.url),
)
const rendererWasmPath = await readFile(
  new URL('../../public/typst_ts_renderer_bg.wasm', import.meta.url),
)

describe('typstCompiler', () => {
  it('requires stored json before compiling pdf', async () => {
    const compiler = createTypstCompiler({ compilerWasmPath, rendererWasmPath })

    await expect(compiler.compilePdf()).rejects.toThrow(
      'No stored resume JSON. Call updateJson() first.',
    )
  })

  it('requires stored typst before compiling svg', async () => {
    const compiler = createTypstCompiler({ compilerWasmPath, rendererWasmPath })
    compiler.updateJson('{"basics":{"name":"test_name"}}')

    await expect(compiler.compileSvg()).rejects.toThrow(
      'No stored Typst source. Call updateTypst() first.',
    )
  })

  it(
    'compiles a basic template that reads data.json via sys.inputs',
    async () => {
      const compiler = createTypstCompiler({ compilerWasmPath, rendererWasmPath })

      compiler.updateJson(JSON.stringify({ basics: { name: 'test_name' } }))
      compiler.updateTypst(`#let data = json(sys.inputs.at("data", default: "/resume/resume-cl.json"))
#let basics = data.basics
#let name = basics.name
#name`)

      await expect(compiler.compilePdf()).resolves.toBeInstanceOf(Uint8Array)

      const svg = await compiler.compileSvg()
      expect(svg).toContain('<svg')
    },
    30000,
  )
})