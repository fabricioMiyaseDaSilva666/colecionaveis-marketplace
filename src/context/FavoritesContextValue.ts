import { createContext } from 'react'

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (nftId: string) => void
  isFavorite: (nftId: string) => boolean
}

export const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined)