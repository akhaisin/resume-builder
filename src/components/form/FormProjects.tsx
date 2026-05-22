import Accordion from './Accordion'
import FormProjectsEntry from './FormProjectsEntry'
import { EntryActions } from './FormFields'
import { createProjectEntry, removeListItem, updateListItem } from './formUtils'
import type { ResumeProjectEntry } from './formTypes'

interface FormProjectsProps {
  entries: ResumeProjectEntry[]
  onChange: (entries: ResumeProjectEntry[]) => void
}

export default function FormProjects(props: FormProjectsProps) {
  return (
    <div className="formStack">
      <EntryActions onAdd={() => props.onChange([...props.entries, createProjectEntry()])} />
      <Accordion
        items={props.entries.map((entry, index) => ({
          id: `project-${index}`,
          title: entry.name || `Project ${index + 1}`,
          summary: entry.url ?? '',
          content: (
            <FormProjectsEntry
              entry={entry}
              onChange={(nextEntry) => props.onChange(updateListItem(props.entries, index, nextEntry))}
              onDelete={() => props.onChange(removeListItem(props.entries, index))}
            />
          ),
        }))}
      />
    </div>
  )
}