import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'

interface MeflyNavItem {
  id: string
  label: string
  url: string
  iconUrl?: string
  disabled?: boolean
  devOnly?: boolean
}

interface MenuMessage {
  items: MeflyNavItem[]
  activeId?: string
}

interface MeflyNavOverlayProps {
  trustedOrigins: string[]
  activationMode?: 'click' | 'hover'
  allowLocalhost?: boolean
}

function isAllowedOrigin(origin: string, trustedOrigins: string[], allowLocalhost: boolean) {
  return trustedOrigins.includes(origin) || (allowLocalhost && /^https?:\/\/localhost(:\d+)?$/.test(origin))
}

export default function MeflyNavOverlay(props: MeflyNavOverlayProps) {
  const [menu, setMenu] = useState<MenuMessage | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const isEmbedded = window.parent !== window

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!isAllowedOrigin(event.origin, props.trustedOrigins, props.allowLocalhost ?? true)) {
        return
      }

      const data = event.data as { type?: string; items?: MeflyNavItem[]; activeId?: string } | null

      if (data?.type !== 'MEFLY_MENU' || !Array.isArray(data.items)) {
        return
      }

      setMenu({ items: data.items, activeId: data.activeId })
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [props.allowLocalhost, props.trustedOrigins])

  useEffect(() => {
    if (!isOpen || props.activationMode === 'hover') {
      return
    }

    function handlePointerDown(event: MouseEvent | globalThis.MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown as EventListener)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown as EventListener)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, props.activationMode])

  const items = useMemo(() => menu?.items ?? [], [menu])

  if (items.length === 0) {
    return null
  }

  function handleSelect(item: MeflyNavItem, event: MouseEvent<HTMLAnchorElement>) {
    if (item.disabled) {
      event.preventDefault()
      return
    }

    if (isEmbedded) {
      event.preventDefault()
      window.parent.postMessage({ type: 'MEFLY_NAV_SELECT', item }, '*')
    }

    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className="meflyOverlay"
      onMouseEnter={props.activationMode === 'hover' ? () => setIsOpen(true) : undefined}
      onMouseLeave={props.activationMode === 'hover' ? () => setIsOpen(false) : undefined}
    >
      {isOpen ? (
        <ul className="meflyOverlayMenu" role="menu" aria-label="Host navigation">
          {items.map((item) => (
            <li key={item.id} role="none">
              {item.disabled ? (
                <span className="meflyOverlayItem meflyOverlayItemDisabled" role="menuitem" aria-disabled="true">
                  {item.iconUrl ? <img src={item.iconUrl} alt="" className="meflyOverlayItemIcon" /> : null}
                  <span className="meflyOverlayItemLabel">{item.label}</span>
                </span>
              ) : (
                <a
                  href={item.url}
                  role="menuitem"
                  className={[
                    'meflyOverlayItem',
                    menu?.activeId === item.id ? 'meflyOverlayItemActive' : '',
                    item.devOnly ? 'meflyOverlayItemDevOnly' : '',
                  ].join(' ').trim()}
                  onClick={(event) => handleSelect(item, event)}
                >
                  {item.iconUrl ? <img src={item.iconUrl} alt="" className="meflyOverlayItemIcon" /> : null}
                  <span className="meflyOverlayItemLabel">{item.label}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        className="meflyOverlayTrigger"
        aria-label="Open host navigation menu"
        aria-expanded={isOpen}
        onClick={props.activationMode === 'click' ? () => setIsOpen((current) => !current) : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      </button>
    </div>
  )
}