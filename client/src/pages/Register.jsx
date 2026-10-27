import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useForm from '../hooks/useForm'
import { passwordStrength, validateRegister } from '../utils/validation'

const STRENGTH = [
  { label: 'Too weak', color: 'bg-slate-200' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-lime-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
]

function PasswordStrength({ password }) {
  if (!password) return null
  const score = passwordStrength(password)
  return (
    <div className="-mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={`h-1.5 flex-1 rounded-full ${score >= step ? STRENGTH[score].color : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Password strength: <span className="font-medium text-slate-700">{STRENGTH[score].label}</span>
      </p>
    </div>
  )
}

export default function Register() {
  useDocumentTitle('Create account')
  const { register } = useAuth()

  const { values, errors, formError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validate: validateRegister,
    // On success GuestRoute sends the new user to the customer page
    onSubmit: ({ name, email, password }) => register({ name, email, password }),
  })

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: handleChange,
    onBlur: handleBlur,
  })

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your customers in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {formError && <Alert type="error">{formError}</Alert>}

        <FormField label="Full name" autoComplete="name" placeholder="Your full name" required {...field('name')} />
        <FormField label="Email" type="email" autoComplete="email" placeholder="you@example.com" required {...field('email')} />
        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          hint="Use 6+ characters with at least one letter and one number."
          required
          {...field('password')}
        />
        <PasswordStrength password={values.password} />
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          required
          {...field('confirmPassword')}
        />

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
