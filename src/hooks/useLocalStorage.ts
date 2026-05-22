import { useCallback, useState } from 'react'

interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

const defaultSerialize = JSON.stringify
const defaultDeserialize = JSON.parse as <T>(value: string) => T

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
) {
  const serialize = options.serialize ?? defaultSerialize
  const deserialize = options.deserialize ?? defaultDeserialize<T>

  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue

    try {
      const stored = localStorage.getItem(key)
      return stored === null ? fallback : deserialize(stored)
    } catch {
      return fallback
    }
  })

  const setStoredValue = useCallback(
    (nextValue: T) => {
      setValue(nextValue)
      try {
        localStorage.setItem(key, serialize(nextValue))
      } catch {}
    },
    [key, serialize],
  )

  return [value, setStoredValue] as const
}