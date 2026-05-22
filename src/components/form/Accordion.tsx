import { useMemo, useState, type ReactNode } from 'react'

export interface AccordionItem {
  id: string
  title: string
  summary?: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  reorderable?: boolean
  onOrderChange?: (nextOrder: string[]) => void
  className?: string
}

function reorder(order: string[], activeId: string, overId: string) {
  const nextOrder = [...order]
  const fromIndex = nextOrder.indexOf(activeId)
  const toIndex = nextOrder.indexOf(overId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return nextOrder
  }

  const [moved] = nextOrder.splice(fromIndex, 1)
  nextOrder.splice(toIndex, 0, moved)
  return nextOrder
}

export default function Accordion(props: AccordionProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(props.items.map((item) => [item.id, true])),
  )
  const [draggedId, setDraggedId] = useState<string | null>(null)

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
            className={`accordionItem ${draggedId === item.id ? 'accordionItemDragging' : ''}`.trim()}
            draggable={props.reorderable}
            onDragStart={() => setDraggedId(item.id)}
            onDragEnd={() => setDraggedId(null)}
            onDragOver={(event) => {
              if (props.reorderable && draggedId && draggedId !== item.id) {
                event.preventDefault()
              }
            }}
            onDrop={() => {
              if (!props.reorderable || !props.onOrderChange || !draggedId) {
                return
              }

              props.onOrderChange(reorder(orderedItems.map((entry) => entry.id), draggedId, item.id))
              setDraggedId(null)
            }}
          >
            <button type="button" className="accordionHeader" onClick={() => toggleItem(item.id)}>
              <span className="accordionHeaderText">
                <strong>{item.title}</strong>
                {!isOpen && item.summary ? (
                  <span className="accordionSummary">{item.summary}</span>
                ) : null}
              </span>
              {props.reorderable ? <span className="accordionDragHint">Drag</span> : null}
            </button>
            {isOpen ? <div className="accordionContent">{item.content}</div> : null}
          </section>
        )
      })}
    </div>
  )
}