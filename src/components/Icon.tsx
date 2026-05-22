import type { ReactNode } from 'react'

type IconName = 'download' | 'export' | 'import' | 'revert' | 'drag' | 'add' | 'delete'

interface IconProps {
  name: IconName
  className?: string
}

const iconPaths: Record<IconName, ReactNode> = {
  download: (
    <>
      <path
        d="M12 3.5v10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m7.75 9.75 4.25 4.75 4.25-4.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M5 19.25h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </>
  ),
  export: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  import: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </>
  ),
  revert: (
    <>
      <path d="M10 6 4 12l6 6" />
      <path d="M5 12h8a5 5 0 1 1 0 10h-2" />
    </>
  ),
  drag: (
    <>
      <circle cx="9" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  add: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  delete: (
    <>
      <path d="M7 7 17 17" />
      <path d="M17 7 7 17" />
    </>
  ),
}

export default function Icon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {iconPaths[props.name]}
    </svg>
  )
}