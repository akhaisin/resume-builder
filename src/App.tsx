import { useEffect, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import './App.css'
import defaultResume from './data/resume.json'
import { useDebounce } from './hooks/useDebounce'
import { useTemplateStorage } from './hooks/useTemplateStorage'
import { useResumeStorage } from './hooks/useResumeStorage'
import ResumePanel from './components/ResumePanel'
import TypstPdfPanel from './components/TypstPdfPanel'
import demoTemplateSource from './templates/demo.typ?raw'
import minimalTemplateSource from './templates/minimal.typ?raw'
import resumeTemplateSource from './templates/resume.typ?raw'

const templateOptions = [
  {
    id: 'resume.typ',
    label: 'resume.typ',
    bundledSource: resumeTemplateSource,
  },
  {
    id: 'minimal.typ',
    label: 'minimal.typ',
    bundledSource: minimalTemplateSource,
  },
  {
    id: 'demo.typ',
    label: 'demo.typ',
    bundledSource: demoTemplateSource,
  },
]

function createDefaultResume() {
  return JSON.stringify(defaultResume, null, 2)
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const { json: persistedJson, saveJson } = useResumeStorage()
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateOptions[0].id)
  const [resumeDraft, setResumeDraft] = useState(persistedJson)
  const [isResumeJsonValid, setIsResumeJsonValid] = useState(true)
  const [resumeValidationMessage, setResumeValidationMessage] = useState<string | null>(null)
  const selectedTemplate =
    templateOptions.find((template) => template.id === selectedTemplateId) ?? templateOptions[0]
  const { content: templateSource, setContent: setTemplateSource } = useTemplateStorage(
    selectedTemplate.id,
    selectedTemplate.bundledSource,
  )
  const debouncedResumeDraft = useDebounce(resumeDraft, 1000)

  useEffect(() => {
    if (isResumeJsonValid && debouncedResumeDraft !== persistedJson) {
      saveJson(debouncedResumeDraft)
    }
  }, [debouncedResumeDraft, isResumeJsonValid, persistedJson, saveJson])

  return (
    <div className="appShell">
      <Group className="resizableGroup" orientation="horizontal">
        <ResumePanel
          json={resumeDraft}
          onJsonChange={setResumeDraft}
          onJsonValidationChange={(isValid, message) => {
            setIsResumeJsonValid(isValid)
            setResumeValidationMessage(message)
          }}
          onResumeRevert={() => setResumeDraft(createDefaultResume())}
          onResumeExport={() => downloadTextFile('resume.json', resumeDraft, 'application/json')}
          onResumeImport={setResumeDraft}
          templateSource={templateSource}
          onTemplateChange={setTemplateSource}
          selectedTemplateId={selectedTemplateId}
          templateOptions={templateOptions}
          onTemplateSelect={setSelectedTemplateId}
          onTemplateRevert={() => setTemplateSource(selectedTemplate.bundledSource)}
          onTemplateExport={() => downloadTextFile(selectedTemplateId, templateSource, 'text/plain')}
          onTemplateImport={setTemplateSource}
        />
        <Separator className="panelResizeHandle" />
        <Panel defaultSize={48} minSize={30} className="typstPdfPanel">
          <TypstPdfPanel
            json={resumeDraft}
            isResumeJsonValid={isResumeJsonValid}
            resumeValidationMessage={resumeValidationMessage}
            templateId={selectedTemplateId}
            templateSource={templateSource}
          />
        </Panel>
      </Group>
    </div>
  )
}
