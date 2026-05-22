import type { ReactNode } from 'react'

type IconName = 'download'

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
}

export default function Icon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {iconPaths[props.name]}
    </svg>
  )
}