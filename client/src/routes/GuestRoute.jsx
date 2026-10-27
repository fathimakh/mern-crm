import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '../components/Spinner'
import useAuth from '../hooks/useAuth'

// Login and Register are only for logged-out users
export default function GuestRoute() {
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return <PageLoader label="Checking your session…" />
  }

  return isAuthenticated ? <Navigate to="/customers" replace /> : <Outlet />
}
