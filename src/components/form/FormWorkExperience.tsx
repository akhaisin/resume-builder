import Accordion from './Accordion'
import FormWorkExperienceEntry from './FormWorkExperienceEntry'
import { EntryActions } from './FormFields'
import { createWorkEntry, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeWorkEntry } from './formTypes'

interface FormWorkExperienceProps {
  entries: ResumeWorkEntry[]
  onChange: (entries: ResumeWorkEntry[]) => void
}

export default function FormWorkExperience(props: FormWorkExperienceProps) {
  return (
    <div className="formStack">
      <EntryActions onAdd={() => props.onChange([...props.entries, createWorkEntry()])} />
      <Accordion
        reorderable
        items={props.entries.map((entry, index) => ({
          id: `work-${index}`,
          title: entry.position || `Role ${index + 1}`,
          summary: entry.name ?? '',
          content: (
            <FormWorkExperienceEntry
              entry={entry}
              onChange={(nextEntry) => props.onChange(updateListItem(props.entries, index, nextEntry))}
              onDelete={() => props.onChange(removeListItem(props.entries, index))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.entries, nextOrder, (_, index) => `work-${index}`))
        }
      />
    </div>
  )
}