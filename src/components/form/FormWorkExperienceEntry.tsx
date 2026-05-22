import FormHighlights from './FormHighlights'
import { EntryActions, TextField } from './FormFields'
import type { ResumeWorkEntry } from './formTypes'

interface FormWorkExperienceEntryProps {
  entry: ResumeWorkEntry
  onChange: (entry: ResumeWorkEntry) => void
  onDelete: () => void
}

export default function FormWorkExperienceEntry(props: FormWorkExperienceEntryProps) {
  return (
    <div className="formStack">
      <div className="formFieldGrid">
        <TextField label="Company" value={props.entry.name ?? ''} onChange={(value) => props.onChange({ ...props.entry, name: value })} />
        <TextField label="Position" value={props.entry.position ?? ''} onChange={(value) => props.onChange({ ...props.entry, position: value })} />
        <TextField label="Start Date" value={props.entry.startDate ?? ''} onChange={(value) => props.onChange({ ...props.entry, startDate: value })} />
        <TextField label="End Date" value={props.entry.endDate ?? ''} onChange={(value) => props.onChange({ ...props.entry, endDate: value })} />
        <TextField label="Location" value={props.entry.location ?? ''} onChange={(value) => props.onChange({ ...props.entry, location: value })} />
      </div>
      <TextField label="Summary" multiline value={props.entry.summary ?? ''} onChange={(value) => props.onChange({ ...props.entry, summary: value })} />
      <FormHighlights mode="work" value={props.entry.highlights ?? []} onChange={(value) => props.onChange({ ...props.entry, highlights: value as string[] })} />
      <EntryActions onRemove={props.onDelete} />
    </div>
  )
}