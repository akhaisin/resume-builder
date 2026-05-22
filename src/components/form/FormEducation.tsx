import Accordion from './Accordion'
import FormEducationEntry from './FormEducationEntry'
import { AccordionItemActions, EntryActions } from './FormFields'
import { createEducationEntry, insertListItem, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeEducationEntry } from './formTypes'

interface FormEducationProps {
  entries: ResumeEducationEntry[]
  onChange: (entries: ResumeEducationEntry[]) => void
}

export default function FormEducation(props: FormEducationProps) {
  return (
    <div className="formStack">
      <Accordion
        reorderable
        items={props.entries.map((entry, index) => ({
          id: `education-${index}`,
          title: entry.institution || `Education ${index + 1}`,
          summary: entry.area ?? '',
          actions: (
            <AccordionItemActions
              onAdd={() => props.onChange(insertListItem(props.entries, index + 1, createEducationEntry()))}
              onRemove={() => props.onChange(removeListItem(props.entries, index))}
            />
          ),
          content: (
            <FormEducationEntry
              entry={entry}
              onChange={(nextEntry) => props.onChange(updateListItem(props.entries, index, nextEntry))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.entries, nextOrder, (_, index) => `education-${index}`))
        }
      />
      {props.entries.length === 0 ? (
        <EntryActions onAdd={() => props.onChange([createEducationEntry()])} />
      ) : null}
    </div>
  )
}