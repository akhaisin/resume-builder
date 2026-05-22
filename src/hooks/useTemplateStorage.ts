import { useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'

const STORAGE_PREFIX = 'resume-editor.template'

function getStorageKey(templateId: string) {
  return `${STORAGE_PREFIX}.${templateId}.v1.typ`
}

function readStoredTemplate(templateId: string, bundledSource: string) {
  try {
    return localStorage.getItem(getStorageKey(templateId)) ?? bundledSource
  } catch {
    return bundledSource
  }
}

export function useTemplateStorage(templateId: string, bundledSource: string) {
  const [content, setContent] = useState(() => readStoredTemplate(templateId, bundledSource))
  const debouncedContent = useDebounce(content, 1000)
  const hydratedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    const storageKey = getStorageKey(templateId)
    hydratedKeyRef.current = storageKey
    setContent(readStoredTemplate(templateId, bundledSource))
  }, [bundledSource, templateId])

  useEffect(() => {
    const storageKey = getStorageKey(templateId)

    if (hydratedKeyRef.current !== storageKey) {
      return
    }

    try {
      localStorage.setItem(storageKey, debouncedContent)
    } catch {}
  }, [debouncedContent, templateId])

  return {
    content,
    setContent,
  }
}