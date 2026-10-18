import { createContext } from 'react'
import type { NFT } from '../services/nftService'

export interface CartItem {
  nft: NFT
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (nft: NFT) => void
  updateQuantity: (nftId: string, quantity: number) => void
  removeFromCart: (nftId: string) => void
  clearCart: () => void
  totalItems: number
  discount: number
  setDiscount: (discount: number) => void
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
)