import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import CustomerList from '../components/CustomerList'
import EmptyState from '../components/EmptyState'
import ProfileCard from '../components/ProfileCard'
import StatsCards from '../components/StatsCards'
import Spinner from '../components/Spinner'
import { PlusIcon, SearchIcon, UsersIcon } from '../components/icons'
import useAuth from '../hooks/useAuth'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { deleteCustomer, getCustomers } from '../services/customerService'
import { CUSTOMER_STATUSES } from '../utils/constants'
import { getErrorMessage } from '../utils/errors'

/**
 * Customer data page: the logged-in user's details, customer statistics and
 * the customer list with search, status filter, edit and delete.
 */
export default function Userdata() {
  useDocumentTitle('Customers')
  const { user, welcome, setWelcome } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [loadState, setLoadState] = useState('loading') // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Success message: the welcome after login/register, or one passed by add/edit via navigation state
  const [flash, setFlash] = useState(() => location.state?.flash || welcome || '')

  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Incremented by the "Try again" button to re-run the fetch below
  const [reloadKey, setReloadKey] = useState(0)

  // Fetch the logged-in user's customers (GET /api/customers)
  useEffect(() => {
    let cancelled = false
    getCustomers()
      .then((data) => {
        if (cancelled) return
        setCustomers(data)
        setLoadState('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setLoadError(getErrorMessage(error))
        setLoadState('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Remove the flash message from history so it doesn't reappear on refresh
  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  // The welcome message is shown once
  useEffect(() => {
    if (welcome) setWelcome('')
  }, [welcome, setWelcome])

  // Hide the success message after a few seconds
  useEffect(() => {
    if (!flash) return undefined
    const timer = setTimeout(() => setFlash(''), 6000)
    return () => clearTimeout(timer)
  }, [flash])

  const retry = () => {
    setLoadState('loading')
    setReloadKey((key) => key + 1)
  }

  const visibleCustomers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return customers.filter((customer) => {
      const matchesStatus = statusFilter === 'All' || customer.status === statusFilter
      const matchesSearch =
        !term ||
        [customer.name, customer.email, customer.phone, customer.company]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      return matchesStatus && matchesSearch
    })
  }, [customers, search, statusFilter])

  const filtersActive = search.trim() !== '' || statusFilter !== 'All'

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('All')
  }

  const closeDeleteDialog = useCallback(() => {
    setCustomerToDelete(null)
    setDeleteError('')
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    setDeleteError('')
    const removeFromList = () =>
      setCustomers((current) => current.filter((customer) => customer._id !== customerToDelete._id))
    try {
      await deleteCustomer(customerToDelete._id)
      removeFromList()
      setFlash(`${customerToDelete.name} was deleted.`)
      setCustomerToDelete(null)
    } catch (error) {
      if (error.response?.status === 404) {
        // Already deleted (e.g. in another tab): just drop it from the list
        removeFromList()
        setFlash(`${customerToDelete.name} had already been deleted.`)
        setCustomerToDelete(null)
      } else {
        setDeleteError(getErrorMessage(error))
      }
    } finally {
      setDeleting(false)
    }
  }

  const addButton = (
    <Button to="/customers/new">
      <PlusIcon className="h-4 w-4" /> Add customer
    </Button>
  )

  let content
  if (loadState === 'loading') {
    content = (
      <div role="status" className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500">
        <Spinner className="text-indigo-600" />
        <span className="text-sm font-medium">Loading customers…</span>
      </div>
    )
  } else if (loadState === 'error') {
    content = (
      <Alert type="error" title="Could not load customers">
        <p>{loadError}</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={retry}>
          Try again
        </Button>
      </Alert>
    )
  } else if (customers.length === 0) {
    content = (
      <EmptyState
        icon={UsersIcon}
        title="No customers yet"
        description="Add your first customer to start tracking leads, prospects and active clients."
        action={addButton}
      />
    )
  } else if (visibleCustomers.length === 0) {
    content = (
      <EmptyState
        icon={SearchIcon}
        title="No matching customers"
        description="Try a different search term or status filter."
        action={
          <Button variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        }
      />
    )
  } else {
    content = <CustomerList customers={visibleCustomers} onDelete={setCustomerToDelete} />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {flash && (
        <Alert type="success" onClose={() => setFlash('')}>
          {flash}
        </Alert>
      )}

      <ProfileCard user={user} actions={addButton} />

      {loadState === 'ready' && (
        <StatsCards customers={customers} activeStatus={statusFilter} onSelect={setStatusFilter} />
      )}

      <section aria-labelledby="customers-heading" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="customers-heading" className="text-lg font-semibold text-slate-900">
              Customers
            </h2>
            {loadState === 'ready' && customers.length > 0 && (
              <p className="text-sm text-slate-500">
                Showing {visibleCustomers.length} of {customers.length} customer{customers.length === 1 ? '' : 's'}
              </p>
            )}
          </div>

          {loadState === 'ready' && customers.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block sm:w-72">
                <span className="sr-only">Search customers</span>
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, phone, company"
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-sm shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </label>
              <label className="block sm:w-44">
                <span className="sr-only">Filter by status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                >
                  <option value="All">All statuses</option>
                  {CUSTOMER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              {filtersActive && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        {content}
      </section>

      <ConfirmDialog
        open={Boolean(customerToDelete)}
        title="Delete customer?"
        message={
          customerToDelete
            ? `“${customerToDelete.name}” will be permanently removed from your customers. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete customer"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  )
}
