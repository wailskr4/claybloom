
import { useCallback, useEffect, useState } from 'react'

const STORAGE_PREFIX = 'claybloom:tutorial:'

function readTutorialProgress(tutorials) {
  const result = {}

  if (typeof window === 'undefined') return result

  tutorials.forEach((tutorial) => {
    const total = tutorial.instructions?.length ?? 0

    try {
      const saved = window.localStorage.getItem(
        `${STORAGE_PREFIX}${tutorial.id}:steps`
      )

      const parsed = saved ? JSON.parse(saved) : []

      const validSteps = Array.isArray(parsed)
        ? [...new Set(parsed)].filter(
            (step) =>
              Number.isInteger(step) &&
              step >= 0 &&
              step < total
          )
        : []

      const completed = validSteps.length

      let status = 'À commencer'

      if (total > 0 && completed === total) {
        status = 'Terminé'
      } else if (completed > 0) {
        status = 'En cours'
      }

      result[String(tutorial.id)] = {
        completed,
        total,
        percentage: total
          ? Math.round((completed / total) * 100)
          : 0,
        status,
      }
    } catch {
      result[String(tutorial.id)] = {
        completed: 0,
        total,
        percentage: 0,
        status: 'À commencer',
      }
    }
  })

  return result
}

export default function useTutorialProgress(tutorials) {
  const [progress, setProgress] = useState(
    () => readTutorialProgress(tutorials)
  )

  const refreshProgress = useCallback(() => {
    setProgress(readTutorialProgress(tutorials))
  }, [tutorials])

  useEffect(() => {
    refreshProgress()

    // Actualiser lorsque l'utilisateur revient sur la page.
    window.addEventListener('focus', refreshProgress)

    return () => {
      window.removeEventListener('focus', refreshProgress)
    }
  }, [refreshProgress])

  return {
    progress,
    refreshProgress,
  }
}
