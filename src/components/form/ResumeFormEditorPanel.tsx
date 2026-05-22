import { useState } from 'react'
import Accordion from './Accordion'
import FormCoverLetter from './FormCoverLetter'
import FormEducation from './FormEducation'
import FormProjects from './FormProjects'
import FormSkills from './FormSkills'
import FormSummary from './FormSummary'
import FormWorkExperience from './FormWorkExperience'
import { parseResumeDocument, stringifyResumeDocument } from './formUtils'
import type { ResumeDocument } from './formTypes'

const DEFAULT_SECTION_ORDER = ['summary', 'cover-letter', 'work', 'education', 'skills', 'projects']

interface ResumeFormEditorPanelProps {
  json: string
  onChange: (value: string) => void
}

export default function ResumeFormEditorPanel(props: ResumeFormEditorPanelProps) {
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER)

  let document: ResumeDocument
  try {
    document = parseResumeDocument(props.json)
  } catch {
    return (
      <div className="formEditorPanel">
        <div className="panelCard previewError">
          Form editing is unavailable until the resume JSON parses successfully.
        </div>
      </div>
    )
  }

  function updateDocument(updater: (currentDocument: ResumeDocument) => ResumeDocument) {
    props.onChange(stringifyResumeDocument(updater(document)))
  }

  const itemsById = {
    summary: {
      id: 'summary',
      title: 'Summary',
      summary: document.basics?.name ?? '',
      content: (
        <FormSummary
          basics={document.basics ?? {}}
          onChange={(basics) => updateDocument((currentDocument) => ({ ...currentDocument, basics }))}
        />
      ),
    },
    'cover-letter': {
      id: 'cover-letter',
      title: 'Cover Letter',
      summary: `${document.basics?.cover_letter?.length ?? 0} entries`,
      content: (
        <FormCoverLetter
          value={document.basics?.cover_letter ?? []}
          onChange={(cover_letter) =>
            updateDocument((currentDocument) => ({
              ...currentDocument,
              basics: { ...(currentDocument.basics ?? {}), cover_letter },
            }))
          }
        />
      ),
    },
    work: {
      id: 'work',
      title: 'Work Experience',
      summary: `${document.work?.length ?? 0} roles`,
      content: (
        <FormWorkExperience
          entries={document.work ?? []}
          onChange={(work) => updateDocument((currentDocument) => ({ ...currentDocument, work }))}
        />
      ),
    },
    education: {
      id: 'education',
      title: 'Education',
      summary: `${document.education?.length ?? 0} entries`,
      content: (
        <FormEducation
          entries={document.education ?? []}
          onChange={(education) => updateDocument((currentDocument) => ({ ...currentDocument, education }))}
        />
      ),
    },
    skills: {
      id: 'skills',
      title: 'Skills',
      summary: `${document.skills?.length ?? 0} categories`,
      content: (
        <FormSkills
          categories={document.skills ?? []}
          onChange={(skills) => updateDocument((currentDocument) => ({ ...currentDocument, skills }))}
        />
      ),
    },
    projects: {
      id: 'projects',
      title: 'Projects',
      summary: `${document.projects?.length ?? 0} projects`,
      content: (
        <FormProjects
          entries={document.projects ?? []}
          onChange={(projects) => updateDocument((currentDocument) => ({ ...currentDocument, projects }))}
        />
      ),
    },
  } as const

  return (
    <div className="formEditorPanel">
      <Accordion
        reorderable
        items={sectionOrder.map((sectionId) => itemsById[sectionId as keyof typeof itemsById])}
        onOrderChange={setSectionOrder}
      />
    </div>
  )
}