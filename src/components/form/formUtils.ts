import type {
  ResumeCoverLetterItem,
  ResumeDocument,
  ResumeEducationEntry,
  ResumeProfile,
  ResumeProjectEntry,
  ResumeSkillsCategory,
  ResumeWorkEntry,
} from './formTypes'

export function parseResumeDocument(json: string) {
  return JSON.parse(json) as ResumeDocument
}

export function stringifyResumeDocument(document: ResumeDocument) {
  return JSON.stringify(document, null, 2)
}

export function createProfile(): ResumeProfile {
  return { network: '', username: '', url: '' }
}

export function createCoverLetterItem(): ResumeCoverLetterItem {
  return { title: '', type: 'paragraphs', items: [''] }
}

export function createWorkEntry(): ResumeWorkEntry {
  return {
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    location: '',
    summary: '',
    highlights: [''],
  }
}

export function createEducationEntry(): ResumeEducationEntry {
  return {
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    endDate: '',
    location: '',
  }
}

export function createSkillsCategory(): ResumeSkillsCategory {
  return { name: '', keywords: [] }
}

export function createProjectEntry(): ResumeProjectEntry {
  return { name: '', description: '', url: '' }
}

export function updateListItem<T>(items: T[], index: number, nextItem: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? nextItem : item))
}

export function removeListItem<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index)
}

export function moveListItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, movedItem)
  return nextItems
}

export function reorderItemsById<T>(items: T[], nextOrder: string[], getId: (item: T, index: number) => string) {
  const itemsById = new Map(items.map((item, index) => [getId(item, index), item]))
  return nextOrder.flatMap((id) => {
    const item = itemsById.get(id)
    return item === undefined ? [] : [item]
  })
}

export function ensureStringArray(value: string[] | undefined) {
  return value ?? []
}

export function getProfileSummary(profile: ResumeProfile) {
  const network = profile.network ?? ''
  const username = profile.username ?? ''

  if (network || username) {
    return `${network}: ${username}`
  }

  return ''
}