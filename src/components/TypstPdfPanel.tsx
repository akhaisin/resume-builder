import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useDebounce } from '../hooks/useDebounce'
import { createTypstCompiler } from '../lib/typstCompiler'

interface TypstPdfPanelProps {
  json: string
  isResumeJsonValid: boolean
  resumeValidationMessage: string | null
  templateId: string
  templateSource: string
}

export default function TypstPdfPanel(props: TypstPdfPanelProps) {
  const previewBufferARef = useRef<HTMLDivElement>(null)
  const previewBufferBRef = useRef<HTMLDivElement>(null)
  const previewSurfaceRef = useRef<HTMLDivElement>(null)
  const activeBufferRef = useRef<0 | 1 | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [compileError, setCompileError] = useState<string | null>(null)
  const [activeBuffer, setActiveBuffer] = useState<0 | 1 | null>(null)
  const [previewWidth, setPreviewWidth] = useState(0)
  const debouncedJson = useDebounce(props.json, 300)
  const debouncedTemplateSource = useDebounce(props.templateSource, 300)
  const debouncedPreviewWidth = useDebounce(previewWidth, 120)

  function createPreparedCompiler(json: string, typst: string) {
    const compiler = createTypstCompiler()
    compiler.updateJson(json)
    compiler.updateTypst(typst)
    return compiler
  }

  useEffect(() => {
    const previewSurface = previewSurfaceRef.current

    if (!previewSurface) {
      return
    }

    function updatePreviewWidth(nextWidth: number) {
      const roundedWidth = Math.round(nextWidth)
      setPreviewWidth((currentWidth) => (currentWidth === roundedWidth ? currentWidth : roundedWidth))
    }

    updatePreviewWidth(previewSurface.clientWidth)

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries

      if (!entry) {
        return
      }

      updatePreviewWidth(entry.contentRect.width)
    })

    resizeObserver.observe(previewSurface)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const previewBuffers = [previewBufferARef.current, previewBufferBRef.current] as const
    const previewSurface = previewSurfaceRef.current
    const preservedScrollTop = previewSurface?.scrollTop ?? 0
    const nextBufferIndex: 0 | 1 = activeBufferRef.current === 0 ? 1 : 0
    const targetBuffer = previewBuffers[nextBufferIndex]

    function restoreScrollPosition() {
      if (!previewSurface) {
        return
      }

      requestAnimationFrame(() => {
        previewSurface.scrollTop = preservedScrollTop
      })
    }

    if (!props.isResumeJsonValid) {
      previewBuffers.forEach((previewBuffer) => {
        if (previewBuffer) {
          previewBuffer.innerHTML = ''
        }
      })
      setCompileError(null)
      setIsCompiling(false)
      activeBufferRef.current = null
      setActiveBuffer(null)
      return
    }

    if (!targetBuffer) {
      return
    }

    if (debouncedPreviewWidth <= 0) {
      return
    }

    setIsCompiling(true)
    setCompileError(null)

    const compiler = createPreparedCompiler(debouncedJson, debouncedTemplateSource)

    compiler.renderPreview(targetBuffer)
      .then(() => {
        if (!isCancelled) {
          activeBufferRef.current = nextBufferIndex
          setActiveBuffer(nextBufferIndex)
          restoreScrollPosition()
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          targetBuffer.innerHTML = ''
          setCompileError(String(error))
          restoreScrollPosition()
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsCompiling(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [debouncedJson, debouncedTemplateSource, debouncedPreviewWidth, props.isResumeJsonValid])

  async function handleDownloadPdf() {
    if (!props.isResumeJsonValid) {
      return
    }

    try {
      setCompileError(null)
      const compiler = createPreparedCompiler(props.json, props.templateSource)
      const pdf = await compiler.compilePdf()
      const pdfBytes = Uint8Array.from(pdf)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'resume.pdf'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      setCompileError(String(error))
    }
  }

  return (
    <div className="typstPdfPanelContent">
      <button
        type="button"
        className="previewDownloadButton"
        disabled={!props.isResumeJsonValid || isCompiling || !!compileError}
        onClick={handleDownloadPdf}
        aria-label="Download PDF"
        title="Download PDF"
      >
        <Icon name="download" className="previewDownloadIcon" />
      </button>
      <div className="typstPdfPanelInner">
        {!props.isResumeJsonValid && props.resumeValidationMessage ? (
          <div className="panelCard previewError">{props.resumeValidationMessage}</div>
        ) : null}
        {compileError ? (
          <div className="panelCard previewError">{compileError}</div>
        ) : null}
        <div className="previewSurfaceShell">
          <div ref={previewSurfaceRef} className="panelCard previewSurface">
            {activeBuffer === null ? (
              <p className="panelText">
                {props.isResumeJsonValid
                  ? isCompiling
                    ? 'Rendering preview.'
                    : 'Waiting for Typst output.'
                  : 'Fix resume JSON validation errors to render the preview.'}
              </p>
            ) : null}
            <div className="previewStack">
              <div
                ref={previewBufferARef}
                className={`previewMount previewDocument ${activeBuffer === 0 ? 'previewDocumentActive' : ''}`.trim()}
              />
              <div
                ref={previewBufferBRef}
                className={`previewMount previewDocument ${activeBuffer === 1 ? 'previewDocumentActive' : ''}`.trim()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}