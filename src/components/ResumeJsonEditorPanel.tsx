import Editor from '@monaco-editor/react'
import { MarkerSeverity, type editor } from 'monaco-editor'
import resumeSchema from '../schemas/jsonresume.schema.json'

const RESUME_MODEL_URI = 'file:///resume.json'
const RESUME_SCHEMA_URI = 'file:///schemas/jsonresume.schema.json'

interface ResumeJsonEditorPanelProps {
  value: string
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean, message: string | null) => void
}

export default function ResumeJsonEditorPanel(props: ResumeJsonEditorPanelProps) {
  return (
    <div className="editorPanel">
      <Editor
        height="100%"
        defaultLanguage="json"
        language="json"
        path={RESUME_MODEL_URI}
        value={props.value}
        onChange={(value) => props.onChange(value ?? '')}
        onMount={(_, monaco) => {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: false,
            enableSchemaRequest: false,
            schemas: [
              {
                uri: RESUME_SCHEMA_URI,
                fileMatch: [RESUME_MODEL_URI],
                schema: resumeSchema,
              },
            ],
          })
        }}
        onValidate={(markers: editor.IMarker[]) => {
          const firstError = markers.find((marker) => marker.severity === MarkerSeverity.Error)
          props.onValidationChange(!firstError, firstError?.message ?? null)
        }}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
      />
    </div>
  )
}