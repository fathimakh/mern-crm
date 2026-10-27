import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '../components/Spinner'
import useAuth from '../hooks/useAuth'

// Only logged-in users can see the nested routes; others are sent to /login
export default function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <PageLoader label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
