import { createContext } from 'react'
import type { AuthUser } from '../services/authService'

interface AuthContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
)