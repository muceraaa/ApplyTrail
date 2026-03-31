import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const USER_KEY = 'applytrail_user'
const LOGGED_IN_KEY = 'applytrail_is_logged_in'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY)
      const logged = localStorage.getItem(LOGGED_IN_KEY) === 'true'
      if (storedUser && logged) {
        setCurrentUser(JSON.parse(storedUser))
        setIsLoggedIn(true)
      }
    } catch (err) {
      console.error('Failed to load auth state', err)
    }
  }, [])

  const signup = (payload) => {
    const trimmedUser = {
      name: payload.name?.trim() || '',
      email: payload.email?.trim().toLowerCase() || '',
      password: payload.password || ''
    }
    localStorage.setItem(USER_KEY, JSON.stringify(trimmedUser))
    localStorage.setItem(LOGGED_IN_KEY, 'true')
    setCurrentUser(trimmedUser)
    setIsLoggedIn(true)
  }

  const login = (email, password) => {
    const stored = localStorage.getItem(USER_KEY)
    if (!stored) return { ok: false, message: 'No account found. Please sign up first.' }
    const user = JSON.parse(stored)
    if (user.email !== email.trim().toLowerCase() || user.password !== password) {
      return { ok: false, message: 'Invalid email or password.' }
    }
    localStorage.setItem(LOGGED_IN_KEY, 'true')
    setCurrentUser(user)
    setIsLoggedIn(true)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(LOGGED_IN_KEY)
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  const value = useMemo(
    () => ({
      isLoggedIn,
      currentUser,
      signup,
      login,
      logout
    }),
    [isLoggedIn, currentUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
