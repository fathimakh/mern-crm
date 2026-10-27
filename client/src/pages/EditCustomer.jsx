import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import CustomerForm from '../components/CustomerForm'
import PageHeader from '../components/PageHeader'
import { PageLoader } from '../components/Spinner'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getCustomer, updateCustomer } from '../services/customerService'
import { getErrorMessage } from '../utils/errors'

export default function EditCustomer() {
  useDocumentTitle('Edit customer')
  const { id } = useParams()
  const navigate = useNavigate()

  // { status: 'loading' | 'ready' | 'error', customer, error } for the customer being edited
  const [state, setState] = useState({ id: null, status: 'loading', customer: null, error: '' })

  useEffect(() => {
    let cancelled = false
    getCustomer(id)
      .then((customer) => {
        if (!cancelled) setState({ id, status: 'ready', customer, error: '' })
      })
      .catch((error) => {
        if (!cancelled) setState({ id, status: 'error', customer: null, error: getErrorMessage(error) })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (values) => {
    const { customer } = await updateCustomer(id, values)
    navigate('/customers', { state: { flash: `Changes to ${customer.name} were saved.` } })
  }

  // Still loading (or the URL changed to another customer)
  if (state.status === 'loading' || state.id !== id) {
    return <PageLoader label="Loading customer…" />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={state.customer ? `Edit ${state.customer.name}` : 'Edit customer'}
        description={state.customer ? 'Update the details below and save your changes.' : undefined}
        backTo="/customers"
        backLabel="Back to customers"
      />
      {state.status === 'error' ? (
        <Alert type="error" title="Could not load this customer">
          <p>{state.error}</p>
          <Button variant="secondary" size="sm" to="/customers" className="mt-3">
            Back to customers
          </Button>
        </Alert>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <CustomerForm
            key={state.customer._id}
            initialValues={state.customer}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            submittingLabel="Saving…"
          />
        </div>
      )}
    </div>
  )
}
