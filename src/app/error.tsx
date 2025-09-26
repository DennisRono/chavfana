'use client'
import React, { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl">Internal Server Error</h1>
      <button
        onClick={() => reset()}
        className="h-[50px] rounded-md bg-orange-600 px-4 py-2 text-gray-600 transition-all delay-75 hover:bg-orange-500 disabled:opacity-50"
      >
        Try Again
      </button>
    </main>
  )
}
