import Accordion from './Accordion'
import FormSkillsCategory from './FormSkillsCategory'
import { EntryActions } from './FormFields'
import { createSkillsCategory, removeListItem, reorderItemsById, updateListItem } from './formUtils'
import type { ResumeSkillsCategory } from './formTypes'

interface FormSkillsProps {
  categories: ResumeSkillsCategory[]
  onChange: (categories: ResumeSkillsCategory[]) => void
}

export default function FormSkills(props: FormSkillsProps) {
  return (
    <div className="formStack">
      <EntryActions onAdd={() => props.onChange([...props.categories, createSkillsCategory()])} />
      <Accordion
        reorderable
        items={props.categories.map((category, index) => ({
          id: `skill-${index}`,
          title: category.name || `Skill ${index + 1}`,
          summary: (category.keywords ?? []).join(', '),
          content: (
            <FormSkillsCategory
              category={category}
              onChange={(nextCategory) => props.onChange(updateListItem(props.categories, index, nextCategory))}
              onDelete={() => props.onChange(removeListItem(props.categories, index))}
            />
          ),
        }))}
        onOrderChange={(nextOrder) =>
          props.onChange(reorderItemsById(props.categories, nextOrder, (_, index) => `skill-${index}`))
        }
      />
    </div>
  )
}