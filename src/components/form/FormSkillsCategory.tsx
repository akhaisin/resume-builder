import { EntryActions, TextField } from './FormFields'
import type { ResumeSkillsCategory } from './formTypes'

interface FormSkillsCategoryProps {
  category: ResumeSkillsCategory
  onChange: (category: ResumeSkillsCategory) => void
  onDelete: () => void
}

export default function FormSkillsCategory(props: FormSkillsCategoryProps) {
  return (
    <div className="formStack">
      <TextField label="Name" value={props.category.name ?? ''} onChange={(value) => props.onChange({ ...props.category, name: value })} />
      <TextField
        label="Keywords"
        multiline
        value={(props.category.keywords ?? []).join('\n')}
        onChange={(value) => props.onChange({ ...props.category, keywords: value.split('\n').filter(Boolean) })}
      />
      <EntryActions onRemove={props.onDelete} />
    </div>
  )
}