import { EntryActions, TextField } from './FormFields'
import type { ResumeEducationEntry } from './formTypes'

interface FormEducationEntryProps {
  entry: ResumeEducationEntry
  onChange: (entry: ResumeEducationEntry) => void
  onDelete: () => void
}

export default function FormEducationEntry(props: FormEducationEntryProps) {
  return (
    <div className="formStack">
      <div className="formFieldGrid">
        <TextField label="Institution" value={props.entry.institution ?? ''} onChange={(value) => props.onChange({ ...props.entry, institution: value })} />
        <TextField label="Area" value={props.entry.area ?? ''} onChange={(value) => props.onChange({ ...props.entry, area: value })} />
        <TextField label="Study Type" value={props.entry.studyType ?? ''} onChange={(value) => props.onChange({ ...props.entry, studyType: value })} />
        <TextField label="Start Date" value={props.entry.startDate ?? ''} onChange={(value) => props.onChange({ ...props.entry, startDate: value })} />
        <TextField label="End Date" value={props.entry.endDate ?? ''} onChange={(value) => props.onChange({ ...props.entry, endDate: value })} />
        <TextField label="Location" value={props.entry.location ?? ''} onChange={(value) => props.onChange({ ...props.entry, location: value })} />
      </div>
      <EntryActions onRemove={props.onDelete} />
    </div>
  )
}