import { useRef, type ChangeEvent } from 'react'
import type { TemplateOption } from './ResumePanel'

export type TopLevelTab = 'resume' | 'template'
export type ResumeMode = 'json' | 'form'

interface ResumeToolbarProps {
  activeTab: TopLevelTab
  onActiveTabChange: (value: TopLevelTab) => void
  resumeMode: ResumeMode
  onResumeModeChange: (value: ResumeMode) => void
  selectedTemplateId: string
  templateOptions: TemplateOption[]
  onTemplateSelect: (value: string) => void
  onResumeReset: () => void
  onResumeExport: () => void
  onResumeImport: (value: string) => void
  onTemplateReset: () => void
  onTemplateExport: () => void
  onTemplateImport: (value: string) => void
}

async function readSelectedFile(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]
  event.target.value = ''
  return file ? file.text() : null
}

export default function ResumeToolbar(props: ResumeToolbarProps) {
  const resumeImportRef = useRef<HTMLInputElement>(null)
  const templateImportRef = useRef<HTMLInputElement>(null)
  const isResumeActive = props.activeTab === 'resume'
  const isTemplateActive = props.activeTab === 'template'

  return (
    <div className="resumeToolbar">
      <section className={`toolbarSection ${isResumeActive ? 'toolbarSectionActive' : ''}`.trim()}>
        <button
          type="button"
          className="toolbarTabButton"
          onClick={() => props.onActiveTabChange('resume')}
        >
          Resume
        </button>

        <div className="toolbarModeTabs">
          <button
            type="button"
            className={props.resumeMode === 'json' ? 'toolbarModeButtonActive' : undefined}
            disabled={!isResumeActive}
            onClick={() => props.onResumeModeChange('json')}
          >
            JSON
          </button>
          <button
            type="button"
            className={props.resumeMode === 'form' ? 'toolbarModeButtonActive' : undefined}
            disabled={!isResumeActive}
            onClick={() => props.onResumeModeChange('form')}
          >
            Forms
          </button>
        </div>

        <div className="toolbarControls">
          <button type="button" disabled={!isResumeActive} onClick={props.onResumeReset}>Reset</button>
          <button
            type="button"
            disabled={!isResumeActive}
            onClick={() => resumeImportRef.current?.click()}
          >
            Import
          </button>
          <button type="button" disabled={!isResumeActive} onClick={props.onResumeExport}>Export</button>
        </div>

        <input
          ref={resumeImportRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={async (event) => {
            const text = await readSelectedFile(event)
            if (text !== null) {
              props.onResumeImport(text)
            }
          }}
        />
      </section>

      <section className={`toolbarSection ${isTemplateActive ? 'toolbarSectionActive' : ''}`.trim()}>
        <button
          type="button"
          className="toolbarTabButton"
          onClick={() => props.onActiveTabChange('template')}
        >
          Template
        </button>

        <div className="toolbarControls">
          <select
            className="toolbarSelect"
            value={props.selectedTemplateId}
            onChange={(event) => props.onTemplateSelect(event.target.value)}
          >
            {props.templateOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="button" disabled={!isTemplateActive} onClick={props.onTemplateReset}>Reset</button>
          <button
            type="button"
            disabled={!isTemplateActive}
            onClick={() => templateImportRef.current?.click()}
          >
            Import
          </button>
          <button type="button" disabled={!isTemplateActive} onClick={props.onTemplateExport}>Export</button>
        </div>

        <input
          ref={templateImportRef}
          type="file"
          accept=".typ,text/plain"
          hidden
          onChange={async (event) => {
            const text = await readSelectedFile(event)
            if (text !== null) {
              props.onTemplateImport(text)
            }
          }}
        />
      </section>
    </div>
  )
}