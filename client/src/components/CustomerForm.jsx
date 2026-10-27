import useForm from '../hooks/useForm'
import { CUSTOMER_STATUSES } from '../utils/constants'
import { validateCustomer } from '../utils/validation'
import Alert from './Alert'
import Button from './Button'
import FormField from './FormField'

const EMPTY_CUSTOMER = { name: '', email: '', phone: '', company: '', status: 'Lead', notes: '' }

// Keep only the editable fields (an existing customer also has _id, user, timestamps...)
const toFormValues = (customer = {}) =>
  Object.fromEntries(Object.keys(EMPTY_CUSTOMER).map((field) => [field, customer[field] ?? EMPTY_CUSTOMER[field]]))

/** Add / edit customer form with client-side validation and API error display */
export default function CustomerForm({ initialValues, onSubmit, submitLabel, submittingLabel, cancelTo = '/customers' }) {
  const { values, errors, formError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: toFormValues(initialValues),
    validate: validateCustomer,
    onSubmit,
  })

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: handleChange,
    onBlur: handleBlur,
  })

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {formError && <Alert type="error">{formError}</Alert>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Full name" placeholder="e.g. Priya Sharma" autoComplete="off" required {...field('name')} />
        <FormField label="Email" type="email" placeholder="priya@company.com" autoComplete="off" required {...field('email')} />
        <FormField
          label="Phone"
          type="tel"
          placeholder="+91 98765 43210"
          hint="7–15 digits, e.g. +91 98765 43210"
          required
          {...field('phone')}
        />
        <FormField label="Company" placeholder="Company name (optional)" {...field('company')} />
        <FormField label="Status" as="select" options={CUSTOMER_STATUSES} {...field('status')} />
        <FormField
          className="sm:col-span-2"
          label="Notes"
          as="textarea"
          rows={4}
          placeholder="Anything worth remembering about this customer (optional)"
          hint={`${values.notes.length}/500 characters`}
          {...field('notes')}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button variant="secondary" to={cancelTo}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
