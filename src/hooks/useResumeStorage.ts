import defaultResume from '../data/resume.json'
import { useLocalStorage } from './useLocalStorage'

const RESUME_ID = 'default'
const storageKey = `resume-editor.resume.${RESUME_ID}.v1.json`

function createDefaultResume() {
  return JSON.stringify(defaultResume, null, 2)
}

export function useResumeStorage() {
  const [json, saveJson] = useLocalStorage(storageKey, createDefaultResume, {
    serialize: (value) => value,
    deserialize: (value) => value,
  })

  return { json, saveJson }
}
