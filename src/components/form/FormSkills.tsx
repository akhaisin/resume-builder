import Accordion from './Accordion'
import FormSkillsCategory from './FormSkillsCategory'
import { AccordionItemActions, EntryActions } from './FormFields'
import { createSkillsCategory, insertListItem, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeSkillsCategory } from './formTypes'

interface FormSkillsProps {
  categories: ResumeSkillsCategory[]
  onChange: (categories: ResumeSkillsCategory[]) => void
}

export default function FormSkills(props: FormSkillsProps) {
  return (
    <div className="formStack">
      <Accordion
        reorderable
        items={props.categories.map((category, index) => ({
          id: `skill-${index}`,
          title: category.name || `Skill ${index + 1}`,
          summary: (category.keywords ?? []).join(', '),
          actions: (
            <AccordionItemActions
              onAdd={() => props.onChange(insertListItem(props.categories, index + 1, createSkillsCategory()))}
              onRemove={() => props.onChange(removeListItem(props.categories, index))}
            />
          ),
          content: (
            <FormSkillsCategory
              category={category}
              onChange={(nextCategory) => props.onChange(updateListItem(props.categories, index, nextCategory))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.categories, nextOrder, (_, index) => `skill-${index}`))
        }
      />
      {props.categories.length === 0 ? (
        <EntryActions onAdd={() => props.onChange([createSkillsCategory()])} />
      ) : null}
    </div>
  )
}