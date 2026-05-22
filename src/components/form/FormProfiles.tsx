import Accordion from './Accordion'
import { AccordionItemActions, EntryActions, TextField } from './FormFields'
import {
  createProfile,
  getProfileSummary,
  insertListItem,
  removeListItem,
  reorderItemsById,
  updateListItem,
} from './formUtils'
import type { ResumeProfile } from './formTypes'

interface FormProfilesProps {
  profiles: ResumeProfile[]
  onChange: (profiles: ResumeProfile[]) => void
}

export default function FormProfiles(props: FormProfilesProps) {
  return (
    <div className="formStack">
      <Accordion
        reorderable
        items={props.profiles.map((profile, index) => ({
          id: `profile-${index}`,
          title: `Profile ${index + 1}`,
          summary: getProfileSummary(profile),
          actions: (
            <AccordionItemActions
              onAdd={() => props.onChange(insertListItem(props.profiles, index + 1, createProfile()))}
              onRemove={() => props.onChange(removeListItem(props.profiles, index))}
            />
          ),
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
            </div>
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.profiles, nextOrder, (_, index) => `profile-${index}`))
        }
      />
      {props.profiles.length === 0 ? (
        <EntryActions onAdd={() => props.onChange([createProfile()])} />
      ) : null}
    </div>
  )
}