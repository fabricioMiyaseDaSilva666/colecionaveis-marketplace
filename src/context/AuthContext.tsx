import { AuthContext } from './AuthContextValue'

import {
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser } from '../services/authService'




function getInitialUser(): AuthUser | null {
  try {
    const savedUser = localStorage.getItem('kurio-user')
    return savedUser ? (JSON.parse(savedUser) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(getInitialUser)

  function setUser(nextUser: AuthUser | null) {
    setUserState(nextUser)

    if (nextUser) {
      localStorage.setItem('kurio-user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('kurio-user')
    }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}