import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from './icons'

// Title block with an optional "back" link and action buttons
export default function PageHeader({ title, description, backTo, backLabel = 'Back', actions }) {
  return (
    <div className="mb-6">
      {backTo && (
        <Link
          to={backTo}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeftIcon className="h-4 w-4" /> {backLabel}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
      </div>
    </div>
  )
}
