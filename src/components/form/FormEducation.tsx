import Accordion from './Accordion'
import FormEducationEntry from './FormEducationEntry'
import { EntryActions } from './FormFields'
import { createEducationEntry, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeEducationEntry } from './formTypes'

interface FormEducationProps {
  entries: ResumeEducationEntry[]
  onChange: (entries: ResumeEducationEntry[]) => void
}

export default function FormEducation(props: FormEducationProps) {
  return (
    <div className="formStack">
      <EntryActions onAdd={() => props.onChange([...props.entries, createEducationEntry()])} />
      <Accordion
        reorderable
        items={props.entries.map((entry, index) => ({
          id: `education-${index}`,
          title: entry.institution || `Education ${index + 1}`,
          summary: entry.area ?? '',
          content: (
            <FormEducationEntry
              entry={entry}
              onChange={(nextEntry) => props.onChange(updateListItem(props.entries, index, nextEntry))}
              onDelete={() => props.onChange(removeListItem(props.entries, index))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.entries, nextOrder, (_, index) => `education-${index}`))
        }
      />
    </div>
  )
}