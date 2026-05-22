import Accordion from './Accordion'
import { EntryActions, TextField } from './FormFields'
import { createProfile, getProfileSummary, removeListItem, updateListItem } from './formUtils'
import type { ResumeProfile } from './formTypes'

interface FormProfilesProps {
  profiles: ResumeProfile[]
  onChange: (profiles: ResumeProfile[]) => void
}

export default function FormProfiles(props: FormProfilesProps) {
  return (
    <div className="formStack">
      <EntryActions onAdd={() => props.onChange([...props.profiles, createProfile()])} />
      <Accordion
        items={props.profiles.map((profile, index) => ({
          id: `profile-${index}`,
          title: `Profile ${index + 1}`,
          summary: getProfileSummary(profile),
          content: (
            <div className="formFieldGrid">
              <TextField
                label="Network"
                value={profile.network ?? ''}
                onChange={(value) =>
                  props.onChange(updateListItem(props.profiles, index, { ...profile, network: value }))
                }
              />
              <TextField
                label="Username"
                value={profile.username ?? ''}
                onChange={(value) =>
                  props.onChange(updateListItem(props.profiles, index, { ...profile, username: value }))
                }
              />
              <TextField
                label="URL"
                value={profile.url ?? ''}
                onChange={(value) =>
                  props.onChange(updateListItem(props.profiles, index, { ...profile, url: value }))
                }
              />
              <EntryActions onRemove={() => props.onChange(removeListItem(props.profiles, index))} />
            </div>
          ),
        }))}
      />
    </div>
  )
}