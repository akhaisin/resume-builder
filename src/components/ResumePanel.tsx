import { useState } from 'react'
import { Panel } from 'react-resizable-panels'
import ResumeJsonEditorPanel from './ResumeJsonEditorPanel'
import ResumeToolbar, { type ResumeMode, type TopLevelTab } from './ResumeToolbar'
import TemplateEditorPanel from './TemplateEditorPanel'
import ResumeFormEditorPanel from './form/ResumeFormEditorPanel'

export interface TemplateOption {
  id: string
  label: string
}

interface ResumePanelProps {
  json: string
  onJsonChange: (value: string) => void
  onJsonValidationChange: (isValid: boolean, message: string | null) => void
  onResumeRevert: () => void
  onResumeExport: () => void
  onResumeImport: (value: string) => void
  templateSource: string
  onTemplateChange: (value: string) => void
  selectedTemplateId: string
  templateOptions: TemplateOption[]
  onTemplateSelect: (value: string) => void
  onTemplateRevert: () => void
  onTemplateExport: () => void
  onTemplateImport: (value: string) => void
}

export default function ResumePanel(props: ResumePanelProps) {
  const [activeTab, setActiveTab] = useState<TopLevelTab>('resume')
  const [resumeMode, setResumeMode] = useState<ResumeMode>('json')

  return (
    <Panel defaultSize={52} minSize={30} className="resumePanel">
      <div className="resumePanelInner">
        <div id="tour-resume-toolbar" className="resumeToolbarShell">
          <ResumeToolbar
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            resumeMode={resumeMode}
            onResumeModeChange={setResumeMode}
            selectedTemplateId={props.selectedTemplateId}
            templateOptions={props.templateOptions}
            onTemplateSelect={props.onTemplateSelect}
            onResumeRevert={props.onResumeRevert}
            onResumeExport={props.onResumeExport}
            onResumeImport={props.onResumeImport}
            onTemplateRevert={props.onTemplateRevert}
            onTemplateExport={props.onTemplateExport}
            onTemplateImport={props.onTemplateImport}
          />
        </div>
        <div id="tour-editor-panel" className="editorViewport">
          {activeTab === 'resume' && resumeMode === 'json' && (
            <ResumeJsonEditorPanel
              value={props.json}
              onChange={props.onJsonChange}
              onValidationChange={props.onJsonValidationChange}
            />
          )}
          {activeTab === 'resume' && resumeMode === 'form' && (
            <ResumeFormEditorPanel
              json={props.json}
              onChange={props.onJsonChange}
            />
          )}
          {activeTab === 'template' && (
            <TemplateEditorPanel value={props.templateSource} onChange={props.onTemplateChange} />
          )}
        </div>
      </div>
    </Panel>
  )
}