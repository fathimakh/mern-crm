import { CUSTOMER_STATUSES } from '../utils/constants'

const ACCENTS = {
  All: 'bg-indigo-500',
  Lead: 'bg-sky-500',
  Prospect: 'bg-amber-500',
  Active: 'bg-emerald-500',
  Inactive: 'bg-slate-400',
}

// Customer counts per status. Clicking a card filters the list by that status.
export default function StatsCards({ customers, activeStatus, onSelect }) {
  const cards = [
    { key: 'All', label: 'Total customers', value: customers.length },
    ...CUSTOMER_STATUSES.map((status) => ({
      key: status,
      label: status,
      value: customers.filter((customer) => customer.status === status).length,
    })),
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const selected = activeStatus === card.key
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            aria-pressed={selected}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              card.key === 'All' ? 'col-span-2 sm:col-span-1' : ''
            } ${selected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <span className={`h-2 w-2 rounded-full ${ACCENTS[card.key]}`} aria-hidden="true" />
              {card.label}
            </span>
            <span className="mt-2 block text-2xl font-bold text-slate-900 sm:text-3xl">{card.value}</span>
          </button>
        )
      })}
    </div>
  )
}
