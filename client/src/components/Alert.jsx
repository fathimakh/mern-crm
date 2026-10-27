import { AlertCircleIcon, CheckCircleIcon, InfoIcon, XIcon } from './icons'

const STYLES = {
  error: { box: 'bg-red-50 text-red-800 ring-red-600/20', Icon: AlertCircleIcon },
  success: { box: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20', Icon: CheckCircleIcon },
  info: { box: 'bg-sky-50 text-sky-800 ring-sky-600/20', Icon: InfoIcon },
}

export default function Alert({ type = 'error', title, children, onClose, className = '' }) {
  if (!title && !children) return null
  const { box, Icon } = STYLES[type]

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg p-3.5 text-sm ring-1 ring-inset ${box} ${className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          className="-m-1 rounded-md p-1 opacity-70 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
