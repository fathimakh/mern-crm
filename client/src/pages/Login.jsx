import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useForm from '../hooks/useForm'
import { validateLogin } from '../utils/validation'

export default function Login() {
  useDocumentTitle('Log in')
  const { login, notice, setNotice } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Send the user back to the page they originally wanted (set by ProtectedRoute)
  const redirectTo = location.state?.from?.pathname || '/customers'

  const { values, errors, formError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
    onSubmit: async (credentials) => {
      const user = await login(credentials)
      navigate(redirectTo, { replace: true, state: { flash: `Welcome back, ${user.name}!` } })
    },
  })

  return (
    <AuthLayout
      title="Log in to your account"
      subtitle="Manage your customers in one place."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create one
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {notice && (
          <Alert type="info" onClose={() => setNotice('')}>
            {notice}
          </Alert>
        )}
        {formError && <Alert type="error">{formError}</Alert>}

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={values.email}
          error={errors.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          value={values.password}
          error={errors.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
