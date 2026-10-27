import { Navigate, Route, Routes } from 'react-router-dom'
import AddCustomer from '../pages/AddCustomer'
import EditCustomer from '../pages/EditCustomer'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'
import Userdata from '../pages/Userdata'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customers" replace />} />

      {/* Public pages (redirect to /customers when already logged in) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Pages that require a valid JWT */}
      <Route element={<ProtectedRoute />}>
        <Route path="/customers" element={<Userdata />} />
        <Route path="/customers/new" element={<AddCustomer />} />
        <Route path="/customers/:id/edit" element={<EditCustomer />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
