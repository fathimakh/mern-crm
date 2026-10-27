import { useState } from 'react'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from './icons'

/**
 * Labelled input / textarea / select with an inline validation message.
 * Password inputs get a show/hide toggle.
 */
export default function FormField({
  label,
  name,
  type = 'text',
  as = 'input',
  options = [],
  error,
  hint,
  required = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const id = `field-${name}`
  const messageId = `${id}-message`
  const isPassword = type === 'password'

  const control = `block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
  }`

  const shared = {
    id,
    name,
    'aria-invalid': Boolean(error),
    'aria-required': required || undefined,
    'aria-describedby': error || hint ? messageId : undefined,
    ...props,
  }

  let input
  if (as === 'textarea') {
    input = <textarea className={`${control} resize-y`} {...shared} />
  } else if (as === 'select') {
    input = (
      <select className={`${control} pr-8`} {...shared}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  } else {
    input = (
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`${control} ${isPassword ? 'pr-11' : ''}`}
          {...shared}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-400 hover:text-slate-600 focus-visible:text-indigo-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {input}
      {error ? (
        <p id={messageId} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        hint && (
          <p id={messageId} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
