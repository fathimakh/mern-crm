import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getInitials } from '../utils/format'
import Button from './Button'
import { LogoMark, LogoutIcon, MenuIcon, PlusIcon, UsersIcon, XIcon } from './icons'

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const closeMenu = () => setMenuOpen(false)

  // Close the mobile menu whenever the page changes (links, browser Back, ...)
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  // ...and when Escape is pressed
  useEffect(() => {
    if (!menuOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const handleLogout = () => {
    closeMenu()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-600">
          <LogoMark className="h-9 w-9" />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            MERN<span className="text-indigo-600">CRM</span>
          </span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* Desktop navigation */}
            <div className="hidden flex-1 items-center gap-1 pl-6 md:flex">
              <NavLink to="/customers" end className={navLinkClass}>
                <UsersIcon className="h-4 w-4" /> Customers
              </NavLink>
              <NavLink to="/customers/new" className={navLinkClass}>
                <PlusIcon className="h-4 w-4" /> Add customer
              </NavLink>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {getInitials(user.name)}
                </span>
                <div className="hidden text-right leading-tight lg:block">
                  <p className="max-w-40 truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="max-w-40 truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogoutIcon className="h-4 w-4" /> Log out
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 md:hidden"
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className={navLinkClass}>
              Log in
            </NavLink>
            <Button to="/register" size="sm">
              Sign up
            </Button>
          </div>
        )}
      </nav>

      {/* Mobile menu panel */}
      {isAuthenticated && menuOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 pt-3 pb-4 shadow-sm md:hidden">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <NavLink to="/customers" end onClick={closeMenu} className={navLinkClass}>
              <UsersIcon className="h-4 w-4" /> Customers
            </NavLink>
            <NavLink to="/customers/new" onClick={closeMenu} className={navLinkClass}>
              <PlusIcon className="h-4 w-4" /> Add customer
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
            >
              <LogoutIcon className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
