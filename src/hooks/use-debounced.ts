"use client"

import { useCallback, useRef } from "react"

export function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delay = 250) {
  const timer = useRef<number | null>(null)
  const cbRef = useRef(callback)
  cbRef.current = callback

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        window.clearTimeout(timer.current)
      }
      timer.current = window.setTimeout(() => {
        cbRef.current(...args)
        timer.current = null
      }, delay)
    },
    [delay],
  )

  const cancel = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  return [debounced, cancel] as const
}
