import { formatDate, getInitials } from '../utils/format'
import Button from './Button'
import StatusBadge from './StatusBadge'
import { BuildingIcon, MailIcon, PencilIcon, PhoneIcon, TrashIcon } from './icons'

function Avatar({ name }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
      {getInitials(name)}
    </span>
  )
}

/**
 * Responsive customer list:
 *  - md and up: a table
 *  - small screens: stacked cards
 */
export default function CustomerList({ customers, onDelete }) {
  return (
    <>
      {/* Table (tablet / desktop) */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th scope="col" className="px-5 py-3">Customer</th>
              <th scope="col" className="px-5 py-3">Phone</th>
              <th scope="col" className="hidden px-5 py-3 lg:table-cell">Company</th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="hidden px-5 py-3 lg:table-cell">Added</th>
              <th scope="col" className="px-5 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {customers.map((customer) => (
              <tr key={customer._id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{customer.name}</p>
                      <a href={`mailto:${customer.email}`} className="truncate text-slate-500 hover:text-indigo-600">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-slate-700">{customer.phone}</td>
                <td className="hidden px-5 py-4 text-slate-700 lg:table-cell">{customer.company || '—'}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="hidden px-5 py-4 whitespace-nowrap text-slate-500 lg:table-cell">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      to={`/customers/${customer._id}/edit`}
                      aria-label={`Edit ${customer.name}`}
                    >
                      <PencilIcon className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost-danger"
                      size="sm"
                      onClick={() => onDelete(customer)}
                      aria-label={`Delete ${customer.name}`}
                    >
                      <TrashIcon className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <ul className="space-y-3 md:hidden">
        {customers.map((customer) => (
          <li key={customer._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={customer.name} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{customer.name}</p>
                  <p className="text-xs text-slate-500">Added {formatDate(customer.createdAt)}</p>
                </div>
              </div>
              <StatusBadge status={customer.status} />
            </div>
            <dl className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Email</dt>
                <MailIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <dd className="truncate">
                  <a href={`mailto:${customer.email}`} className="hover:text-indigo-600">
                    {customer.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Phone</dt>
                <PhoneIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <dd>
                  <a href={`tel:${customer.phone.replace(/[^\d+]/g, '')}`} className="hover:text-indigo-600">
                    {customer.phone}
                  </a>
                </dd>
              </div>
              {customer.company && (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Company</dt>
                  <BuildingIcon className="h-4 w-4 shrink-0 text-slate-400" />
                  <dd className="truncate">{customer.company}</dd>
                </div>
              )}
            </dl>
            {customer.notes && <p className="mt-3 line-clamp-2 rounded-lg bg-slate-50 p-2.5 text-sm text-slate-600">{customer.notes}</p>}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <Button variant="secondary" size="sm" to={`/customers/${customer._id}/edit`} aria-label={`Edit ${customer.name}`}>
                <PencilIcon className="h-4 w-4" /> Edit
              </Button>
              <Button variant="ghost-danger" size="sm" onClick={() => onDelete(customer)} aria-label={`Delete ${customer.name}`}>
                <TrashIcon className="h-4 w-4" /> Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
