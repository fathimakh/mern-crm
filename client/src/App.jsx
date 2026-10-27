import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthProvider from './context/AuthProvider'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <footer className="border-t border-slate-200 bg-white">
            <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
              MERN CRM · MongoDB, Express, React &amp; Node.js
            </p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
