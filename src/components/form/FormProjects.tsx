import Accordion from './Accordion'
import FormProjectsEntry from './FormProjectsEntry'
import { AccordionItemActions, EntryActions } from './FormFields'
import { createProjectEntry, insertListItem, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeProjectEntry } from './formTypes'

interface FormProjectsProps {
  entries: ResumeProjectEntry[]
  onChange: (entries: ResumeProjectEntry[]) => void
}

export default function FormProjects(props: FormProjectsProps) {
  return (
    <div className="formStack">
      <Accordion
        reorderable
        items={props.entries.map((entry, index) => ({
          id: `project-${index}`,
          title: entry.name || `Project ${index + 1}`,
          summary: entry.url ?? '',
          actions: (
            <AccordionItemActions
              onAdd={() => props.onChange(insertListItem(props.entries, index + 1, createProjectEntry()))}
              onRemove={() => props.onChange(removeListItem(props.entries, index))}
            />
          ),
          content: (
            <FormProjectsEntry
              entry={entry}
              onChange={(nextEntry) => props.onChange(updateListItem(props.entries, index, nextEntry))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.entries, nextOrder, (_, index) => `project-${index}`))
        }
      />
      {props.entries.length === 0 ? (
        <EntryActions onAdd={() => props.onChange([createProjectEntry()])} />
      ) : null}
    </div>
  )
}