
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'claybloom-favorites'

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY)

      if (!savedFavorites) return []

      const parsedFavorites = JSON.parse(savedFavorites)

      return Array.isArray(parsedFavorites)
        ? parsedFavorites
        : []
    } catch (error) {
      console.error(
        'Erreur lors de la lecture des favoris :',
        error
      )

      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(favorites)
      )
    } catch (error) {
      console.error(
        'Erreur lors de la sauvegarde des favoris :',
        error
      )
    }
  }, [favorites])

  const isFavorite = useCallback(
    (tutorialId) => favorites.includes(String(tutorialId)),
    [favorites]
  )

  const toggleFavorite = useCallback((tutorialId) => {
    const id = String(tutorialId)

    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(id)) {
        return currentFavorites.filter(
          (favoriteId) => favoriteId !== id
        )
      }

      return [...currentFavorites, id]
    })
  }, [])

  const removeFavorite = useCallback((tutorialId) => {
    const id = String(tutorialId)

    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (favoriteId) => favoriteId !== id
      )
    )
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  }
}
