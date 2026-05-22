import FormHighlights from './FormHighlights'
import type { ResumeCoverLetterItem } from './formTypes'

interface FormCoverLetterProps {
  value: ResumeCoverLetterItem[]
  onChange: (value: ResumeCoverLetterItem[]) => void
}

export default function FormCoverLetter(props: FormCoverLetterProps) {
  return <FormHighlights mode="cover-letter" value={props.value} onChange={(value) => props.onChange(value as ResumeCoverLetterItem[])} />
}