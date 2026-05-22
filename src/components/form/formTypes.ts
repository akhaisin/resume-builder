export interface ResumeProfile {
  network?: string
  username?: string
  url?: string
}

export interface ResumeCoverLetterItem {
  title?: string
  type?: string
  items?: string[]
}

export interface ResumeBasics {
  name?: string
  label?: string
  email?: string
  phone?: string
  url?: string
  summary?: string
  profiles?: ResumeProfile[]
  cover_letter?: ResumeCoverLetterItem[]
}

export interface ResumeWorkEntry {
  name?: string
  position?: string
  startDate?: string
  endDate?: string
  location?: string
  summary?: string
  highlights?: string[]
}

export interface ResumeEducationEntry {
  institution?: string
  area?: string
  studyType?: string
  startDate?: string
  endDate?: string
  location?: string
}

export interface ResumeSkillsCategory {
  name?: string
  keywords?: string[]
}

export interface ResumeProjectEntry {
  name?: string
  description?: string
  url?: string
}

export interface ResumeDocument {
  basics?: ResumeBasics
  work?: ResumeWorkEntry[]
  education?: ResumeEducationEntry[]
  skills?: ResumeSkillsCategory[]
  projects?: ResumeProjectEntry[]
}