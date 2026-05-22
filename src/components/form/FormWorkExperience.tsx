import Accordion from './Accordion'
import FormWorkExperienceEntry from './FormWorkExperienceEntry'
import { AccordionItemActions, EntryActions } from './FormFields'
import { createWorkEntry, insertListItem, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeWorkEntry } from './formTypes'

interface FormWorkExperienceProps {
  entries: ResumeWorkEntry[]
  onChange: (entries: ResumeWorkEntry[]) => void
}

export default function FormWorkExperience(props: FormWorkExperienceProps) {
  return (
    <div className="formStack">
      <Accordion
        reorderable
        items={props.entries.map((entry, index) => ({
          id: `work-${index}`,
          title: entry.position || `Role ${index + 1}`,
          summary: entry.name ?? '',
          actions: (
            <AccordionItemActions
              onAdd={() => props.onChange(insertListItem(props.entries, index + 1, createWorkEntry()))}
              onRemove={() => props.onChange(removeListItem(props.entries, index))}
            />
          ),
          content: (
            <FormWorkExperienceEntry
              entry={entry}
              onChange={(nextEntry) => props.onChange(updateListItem(props.entries, index, nextEntry))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.entries, nextOrder, (_, index) => `work-${index}`))
        }
      />
      {props.entries.length === 0 ? (
        <EntryActions onAdd={() => props.onChange([createWorkEntry()])} />
      ) : null}
    </div>
  )
}