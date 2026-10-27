import { createContext } from 'react'

// Holds the logged-in user, the JWT and the login/register/logout actions.
// The provider lives in AuthProvider.jsx and is read through hooks/useAuth.js.
export const AuthContext = createContext(null)
