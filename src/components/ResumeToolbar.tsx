import { useRef, type ChangeEvent } from 'react'
import Icon from './Icon'
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
  onResumeRevert: () => void
  onResumeExport: () => void
  onResumeImport: (value: string) => void
  onTemplateRevert: () => void
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

  function handleResumeModeSelect(value: ResumeMode) {
    props.onActiveTabChange('resume')
    props.onResumeModeChange(value)
  }

  return (
    <div className="resumeToolbar">
      <section className={`toolbarSection ${isResumeActive ? 'toolbarSectionActive' : ''}`.trim()}>
        <div className="toolbarModeTabs">
          <button
            type="button"
            className={[
              'toolbarTabButton',
              isResumeActive && props.resumeMode === 'json' ? 'toolbarModeButtonActive' : '',
            ].join(' ').trim()}
            onClick={() => handleResumeModeSelect('json')}
          >
            JSON
          </button>
          <button
            type="button"
            className={[
              'toolbarTabButton',
              isResumeActive && props.resumeMode === 'form' ? 'toolbarModeButtonActive' : '',
            ].join(' ').trim()}
            onClick={() => handleResumeModeSelect('form')}
          >
            Forms
          </button>
        </div>

        <div className="toolbarControls toolbarControlsTemplate">
          <button
            type="button"
            className="toolbarIconButton"
            aria-label="Revert resume"
            title="Revert resume"
            disabled={!isResumeActive}
            onClick={props.onResumeRevert}
          >
            <Icon name="revert" className="toolbarActionIcon" />
          </button>
          <button
            type="button"
            className="toolbarIconButton"
            aria-label="Import resume"
            title="Import resume"
            disabled={!isResumeActive}
            onClick={() => resumeImportRef.current?.click()}
          >
            <Icon name="import" className="toolbarActionIcon" />
          </button>
          <button
            type="button"
            className="toolbarIconButton"
            aria-label="Export resume"
            title="Export resume"
            disabled={!isResumeActive}
            onClick={props.onResumeExport}
          >
            <Icon name="export" className="toolbarActionIcon" />
          </button>
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

      <section
        className={[
          'toolbarSection',
          'toolbarSectionTemplate',
          isTemplateActive ? 'toolbarSectionActive' : '',
        ].join(' ').trim()}
      >
        <div className="toolbarModeTabs">
          <button
            type="button"
            className={[
              'toolbarTabButton',
              isTemplateActive ? 'toolbarModeButtonActive' : '',
            ].join(' ').trim()}
            onClick={() => props.onActiveTabChange('template')}
          >
            Template
          </button>
        </div>

        <div className="toolbarControls toolbarControlsTemplate">
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
          <button
            type="button"
            className="toolbarIconButton"
            aria-label="Revert template"
            title="Revert template"
            disabled={!isTemplateActive}
            onClick={props.onTemplateRevert}
          >
            <Icon name="revert" className="toolbarActionIcon" />
          </button>
          <button
            type="button"
            className="toolbarIconButton"
            aria-label="Import template"
            title="Import template"
            disabled={!isTemplateActive}
            onClick={() => templateImportRef.current?.click()}
          >
            <Icon name="import" className="toolbarActionIcon" />
          </button>
          <button
            type="button"
            className="toolbarIconButton"
            aria-label="Export template"
            title="Export template"
            disabled={!isTemplateActive}
            onClick={props.onTemplateExport}
          >
            <Icon name="export" className="toolbarActionIcon" />
          </button>
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