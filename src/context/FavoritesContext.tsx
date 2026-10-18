import {
  useState,
  type ReactNode,
} from 'react'


import { FavoritesContext } from './FavoritesContextValue'

function getInitialFavorites(): string[] {
  try {
    const savedFavorites = localStorage.getItem('kurio-favorites')
    return savedFavorites ? JSON.parse(savedFavorites) as string[] : []
  } catch {
    return []
  }
}

export function FavoritesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [favorites, setFavorites] = useState<string[]>(
    getInitialFavorites,
  )

  function toggleFavorite(nftId: string) {
    setFavorites((currentFavorites) => {
      const updatedFavorites = currentFavorites.includes(nftId)
        ? currentFavorites.filter((id) => id !== nftId)
        : [...currentFavorites, nftId]

      localStorage.setItem(
        'kurio-favorites',
        JSON.stringify(updatedFavorites),
      )

      return updatedFavorites
    })
  }

  function isFavorite(nftId: string) {
    return favorites.includes(nftId)
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}