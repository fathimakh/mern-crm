import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { SESSION_EXPIRED_EVENT, TOKEN_KEY } from '../api/axios'
import * as authService from '../services/authService'
import { getErrorMessage } from '../utils/errors'

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  // true while a token saved from a previous visit is being verified
  const [initializing, setInitializing] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  // one-off message shown on the login page (logged out, session expired, ...)
  const [notice, setNotice] = useState('')

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const saveSession = useCallback(({ token: newToken, user: newUser }) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(newUser)
    setNotice('')
  }, [])

  // Restore the session on page load by fetching the user's data with the saved token
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return undefined

    let cancelled = false
    authService
      .getProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch((error) => {
        if (cancelled) return
        clearSession()
        if (error.response?.status !== 401) setNotice(getErrorMessage(error))
      })
      .finally(() => {
        if (!cancelled) setInitializing(false)
      })

    return () => {
      cancelled = true
    }
  }, [clearSession])

  // The axios interceptor fires this event when the API rejects our token
  useEffect(() => {
    const handleExpired = () => {
      clearSession()
      setNotice('Your session has expired. Please log in again.')
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired)
  }, [clearSession])

  const login = useCallback(
    async (credentials) => {
      const data = await authService.loginUser(credentials)
      saveSession(data)
      return data.user
    },
    [saveSession],
  )

  const register = useCallback(
    async (details) => {
      const data = await authService.registerUser(details)
      saveSession(data)
      return data.user
    },
    [saveSession],
  )

  const logout = useCallback(() => {
    clearSession()
    setNotice('You have been logged out.')
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      initializing,
      notice,
      setNotice,
      login,
      register,
      logout,
    }),
    [user, token, initializing, notice, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
