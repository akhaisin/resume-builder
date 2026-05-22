import { useMemo, useState, type ReactNode } from 'react'
import Icon from '../Icon'

export interface AccordionItem {
  id: string
  title: string
  summary?: string
  content: ReactNode
  actions?: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  reorderable?: boolean
  onOrderChange?: (nextOrder: string[]) => void
  className?: string
}

function reorder(order: string[], activeId: string, overId: string, position: 'before' | 'after') {
  const nextOrder = [...order]
  const fromIndex = nextOrder.indexOf(activeId)
  const toIndex = nextOrder.indexOf(overId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return nextOrder
  }

  const [moved] = nextOrder.splice(fromIndex, 1)
  const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
  const insertIndex = position === 'before' ? adjustedIndex : adjustedIndex + 1
  nextOrder.splice(insertIndex, 0, moved)
  return nextOrder
}

function getDropPosition(event: React.DragEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect()
  const offsetY = event.clientY - bounds.top
  return offsetY < bounds.height / 2 ? 'before' : 'after'
}

export default function Accordion(props: AccordionProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(props.items.map((item) => [item.id, true])),
  )
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ id: string; position: 'before' | 'after' } | null>(null)

  const orderedItems = useMemo(() => props.items, [props.items])

  function toggleItem(itemId: string) {
    setOpenIds((current) => ({
      ...current,
      [itemId]: !current[itemId],
    }))
  }

  return (
    <div className={`accordion ${props.className ?? ''}`.trim()}>
      {orderedItems.map((item) => {
        const isOpen = openIds[item.id] ?? true

        return (
          <section
            key={item.id}
            className={[
              'accordionItem',
              draggedId === item.id ? 'accordionItemDragging' : '',
              dropTarget?.id === item.id && dropTarget.position === 'before'
                ? 'accordionItemDropBefore'
                : '',
              dropTarget?.id === item.id && dropTarget.position === 'after'
                ? 'accordionItemDropAfter'
                : '',
            ].join(' ').trim()}
            onDragOver={(event) => {
              if (props.reorderable && draggedId && draggedId !== item.id) {
                event.preventDefault()
                setDropTarget({ id: item.id, position: getDropPosition(event) })
              }
            }}
            onDragLeave={() => {
              if (dropTarget?.id === item.id) {
                setDropTarget(null)
              }
            }}
            onDrop={(event) => {
              if (!props.reorderable || !props.onOrderChange || !draggedId) {
                return
              }

              const position = dropTarget?.id === item.id ? dropTarget.position : getDropPosition(event)
              props.onOrderChange(
                reorder(orderedItems.map((entry) => entry.id), draggedId, item.id, position),
              )
              setDraggedId(null)
              setDropTarget(null)
            }}
          >
            <div
              className={['accordionHeaderRow', props.reorderable ? 'accordionHeaderRowDraggable' : '']
                .join(' ')
                .trim()}
              draggable={props.reorderable}
              onDragStart={() => {
                setDraggedId(item.id)
                setDropTarget(null)
              }}
              onDragEnd={() => {
                setDraggedId(null)
                setDropTarget(null)
              }}
            >
              <button
                type="button"
                className="accordionHeader"
                onClick={() => toggleItem(item.id)}
              >
                <span className="accordionHeaderText">
                  <strong>{item.title}</strong>
                  {!isOpen && item.summary ? (
                    <span className="accordionSummary">{item.summary}</span>
                  ) : null}
                </span>
              </button>
              <div className="accordionHeaderTrailing">
                {!isOpen && item.actions ? (
                  <div className="accordionItemActions accordionItemActionsCollapsed">{item.actions}</div>
                ) : null}
                {props.reorderable ? (
                  <span className="accordionDragHint" aria-hidden="true">
                    <Icon name="drag" className="accordionDragIcon" />
                  </span>
                ) : null}
              </div>
            </div>
            {isOpen ? (
              <div className="accordionSectionBody">
                <div className="accordionContent">{item.content}</div>
                {item.actions ? (
                  <div className="accordionItemActions accordionItemActionsExpanded">{item.actions}</div>
                ) : null}
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}