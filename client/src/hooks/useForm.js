import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

/**
 * Small form helper used by the Register, Login and Customer forms.
 *
 * - validates a field when it loses focus, then live while the user types
 * - validates everything on submit and focuses the first invalid field
 * - shows API errors: field errors next to inputs + a general message
 */
export default function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [serverErrors, setServerErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Only show client errors for fields the user has already visited
  const showErrorsFor = (nextValues, nextTouched) => {
    const allErrors = validate(nextValues)
    setErrors(Object.fromEntries(Object.entries(allErrors).filter(([field]) => nextTouched[field])))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)
    // an API error for this field is stale as soon as the user edits it
    if (serverErrors[name]) {
      setServerErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
    showErrorsFor(nextValues, touched)
  }

  const handleBlur = (event) => {
    const { name } = event.target
    const nextTouched = { ...touched, [name]: true }
    setTouched(nextTouched)
    showErrorsFor(values, nextTouched)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setFormError('')

    const validationErrors = validate(values)
    setTouched(Object.fromEntries(Object.keys(values).map((field) => [field, true])))
    setErrors(validationErrors)

    const firstInvalid = Object.keys(values).find((field) => validationErrors[field])
    if (firstInvalid) {
      form.elements.namedItem(firstInvalid)?.focus()
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      const invalidFields = Object.keys(values).filter((field) => fieldErrors[field])
      setServerErrors(fieldErrors)
      // Field problems are shown next to the inputs; anything else at the top of the form
      setFormError(
        invalidFields.length > 0 ? 'Please correct the highlighted field and try again.' : getErrorMessage(error),
      )
      if (invalidFields.length > 0) form.elements.namedItem(invalidFields[0])?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  return {
    values,
    setValues,
    errors: { ...serverErrors, ...errors },
    formError,
    setFormError,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
