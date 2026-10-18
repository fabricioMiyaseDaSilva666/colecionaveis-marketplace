import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { CartContext, type CartItem } from './CartContextValue'
import type { NFT } from '../services/nftService'


const STORAGE_KEY = 'kurio-cart'

function getInitialCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY)

    if (savedCart) {
      return JSON.parse(savedCart) as CartItem[]
    }
  } catch {
    console.error('Não foi possível carregar o carrinho salvo.')
  }

  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(nft: NFT) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.nft.id === nft.id,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.nft.id === nft.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, nft.available),
                nft,
              }
            : item,
        )
      }

      if (nft.available <= 0) {
        return currentItems
      }

      return [...currentItems, { nft, quantity: 1 }]
    })
  }

  
function updateQuantity(nftId: string, quantity: number) {
    setItems((currentItems) =>
        currentItems.map((item) => {
        if (item.nft.id !== nftId) {
            return item
        }

        const safeQuantity = Math.max(
            1,
            Math.min(quantity, item.nft.available),
        )

        return {
            ...item,
            quantity: safeQuantity,
        }
        }),
    )
    }


  function removeFromCart(nftId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.nft.id !== nftId),
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, discount, setDiscount, }}
    >
      {children}
    </CartContext.Provider>
  )
}