import { TextField } from './FormFields'
import type { ResumeProjectEntry } from './formTypes'

interface FormProjectsEntryProps {
  entry: ResumeProjectEntry
  onChange: (entry: ResumeProjectEntry) => void
}

export default function FormProjectsEntry(props: FormProjectsEntryProps) {
  return (
    <div className="formStack">
      <div className="formFieldGrid">
        <TextField label="Name" value={props.entry.name ?? ''} onChange={(value) => props.onChange({ ...props.entry, name: value })} />
        <TextField
          label="Description"
          value={props.entry.description ?? ''}
          onChange={(value) => props.onChange({ ...props.entry, description: value })}
        />
        <TextField label="URL" value={props.entry.url ?? ''} onChange={(value) => props.onChange({ ...props.entry, url: value })} />
      </div>
    </div>
  )
}