import type { ReactNode } from 'react'

type IconName = 'download' | 'export' | 'import' | 'revert' | 'drag' | 'add' | 'delete' | 'github' | 'help'

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
  github: (
    <>
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.64-.2.64-.45 0-.22-.01-.95-.01-1.72-2.61.57-3.16-1.1-3.16-1.1-.42-1.08-1.04-1.37-1.04-1.37-.85-.58.07-.57.07-.57.94.07 1.43.97 1.43.97.84 1.43 2.2 1.02 2.74.78.08-.6.33-1.02.6-1.25-2.08-.24-4.26-1.04-4.26-4.64 0-1.02.37-1.86.96-2.52-.1-.24-.42-1.18.09-2.47 0 0 .78-.25 2.56.96a8.9 8.9 0 0 1 4.66 0c1.78-1.21 2.56-.96 2.56-.96.51 1.29.19 2.23.09 2.47.6.66.96 1.5.96 2.52 0 3.61-2.18 4.39-4.26 4.63.34.29.63.85.63 1.71 0 1.24-.01 2.23-.01 2.54 0 .25.17.54.64.45A9.5 9.5 0 0 0 12 2.5Z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.75 9.25a2.25 2.25 0 1 1 3.96 1.46c-.5.56-1.14 1.03-1.51 1.41-.46.47-.7.93-.7 1.88" />
      <path d="M12 17.25h.01" />
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