import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '../components/Spinner'
import useAuth from '../hooks/useAuth'

// Login and Register are only for logged-out users. As soon as the user is
// logged in (also right after submitting the form) they are sent to the page
// they originally wanted (saved by ProtectedRoute), or to /customers.
export default function GuestRoute() {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <PageLoader label="Checking your session…" />
  }

  if (isAuthenticated) {
    const from = location.state?.from
    const to = from ? `${from.pathname}${from.search || ''}` : '/customers'
    return <Navigate to={to} replace />
  }

  return <Outlet />
}
