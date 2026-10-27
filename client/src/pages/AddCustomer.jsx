import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import PageHeader from '../components/PageHeader'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { createCustomer } from '../services/customerService'

export default function AddCustomer() {
  useDocumentTitle('Add customer')
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    const { customer } = await createCustomer(values)
    navigate('/customers', { state: { flash: `${customer.name} was added to your customers.` } })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Add customer"
        description="Fields marked * are required."
        backTo="/customers"
        backLabel="Back to customers"
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <CustomerForm onSubmit={handleSubmit} submitLabel="Add customer" submittingLabel="Adding…" />
      </div>
    </div>
  )
}
