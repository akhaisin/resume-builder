import Accordion from './Accordion'
import { EntryActions, TextField } from './FormFields'
import {
  createCoverLetterItem,
  ensureStringArray,
  removeListItem,
  reorderItemsById,
  updateListItem,
} from './formUtils'
import type { ResumeCoverLetterItem } from './formTypes'

type HighlightValue = string[] | ResumeCoverLetterItem[]

interface FormHighlightsProps {
  mode: 'work' | 'cover-letter'
  value: HighlightValue
  onChange: (value: HighlightValue) => void
}

function toCoverLetterItems(mode: FormHighlightsProps['mode'], value: HighlightValue) {
  if (mode === 'cover-letter') {
    return value as ResumeCoverLetterItem[]
  }

  return (value as string[]).map((item) => ({ title: '', type: 'bullets', items: [item] }))
}

export default function FormHighlights(props: FormHighlightsProps) {
  const items = toCoverLetterItems(props.mode, props.value)

  function commit(nextItems: ResumeCoverLetterItem[]) {
    if (props.mode === 'cover-letter') {
      props.onChange(nextItems)
      return
    }

    props.onChange(nextItems.map((item) => item.items?.[0] ?? ''))
  }

  return (
    <div className="formStack">
      <Accordion
        className="highlightsAccordion"
        reorderable
        items={items.map((item, index) => {
          const firstLine = ensureStringArray(item.items).find((line) => line.trim().length > 0) ?? ''
          return {
            id: `highlight-${index}`,
            title: item.title?.trim() || firstLine || `Highlight ${index + 1}`,
            content: (
              <div className="highlightLayout">
                <div className="highlightActionsPane">
                  {props.mode === 'cover-letter' ? (
                    <label className="formField">
                      <span className="formLabel">Type</span>
                      <select
                        className="formSelect"
                        value={item.type ?? 'paragraphs'}
                        onChange={(event) =>
                          commit(updateListItem(items, index, { ...item, type: event.target.value }))
                        }
                      >
                        <option value="header">header</option>
                        <option value="paragraphs">paragraphs</option>
                        <option value="bullets">bullets</option>
                      </select>
                    </label>
                  ) : null}
                  <div className="highlightActionButtons">
                    <button type="button" onClick={() => commit(removeListItem(items, index))}>
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        commit([
                          ...items,
                          props.mode === 'cover-letter'
                            ? createCoverLetterItem()
                            : { title: '', type: 'bullets', items: [''] },
                        ])
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="highlightEditorPane">
                  <TextField
                    label="Title"
                    value={item.title ?? ''}
                    onChange={(value) => commit(updateListItem(items, index, { ...item, title: value }))}
                  />
                  <TextField
                    label="Content"
                    multiline
                    value={ensureStringArray(item.items).join('\n')}
                    onChange={(value) =>
                      commit(
                        updateListItem(items, index, {
                          ...item,
                          items: value.split('\n'),
                        }),
                      )
                    }
                  />
                </div>
              </div>
            ),
          }
        })}
        onOrderChange={(nextOrder) =>
          commit(reorderItemsById(items, nextOrder, (_, index) => `highlight-${index}`))
        }
      />
      {items.length === 0 ? (
        <EntryActions onAdd={() => commit([props.mode === 'cover-letter' ? createCoverLetterItem() : { title: '', type: 'bullets', items: [''] }])} />
      ) : null}
    </div>
  )
}