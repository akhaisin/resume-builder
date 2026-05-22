import FormProfiles from './FormProfiles'
import { TextField } from './FormFields'
import type { ResumeBasics } from './formTypes'

interface FormSummaryProps {
  basics: ResumeBasics
  onChange: (nextBasics: ResumeBasics) => void
}

export default function FormSummary(props: FormSummaryProps) {
  const basics = props.basics

  return (
    <div className="formStack">
      <div className="formFieldGrid">
        <TextField label="Name" value={basics.name ?? ''} onChange={(value) => props.onChange({ ...basics, name: value })} />
        <TextField label="Label" value={basics.label ?? ''} onChange={(value) => props.onChange({ ...basics, label: value })} />
        <TextField label="Email" value={basics.email ?? ''} onChange={(value) => props.onChange({ ...basics, email: value })} />
        <TextField label="Phone" value={basics.phone ?? ''} onChange={(value) => props.onChange({ ...basics, phone: value })} />
        <TextField label="URL" value={basics.url ?? ''} onChange={(value) => props.onChange({ ...basics, url: value })} />
      </div>
      <TextField label="Summary" multiline value={basics.summary ?? ''} onChange={(value) => props.onChange({ ...basics, summary: value })} />
      <FormProfiles
        profiles={basics.profiles ?? []}
        onChange={(profiles) => props.onChange({ ...basics, profiles })}
      />
    </div>
  )
}