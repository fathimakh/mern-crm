import { formatDate, getInitials } from '../utils/format'
import { CalendarIcon, MailIcon } from './icons'

// Shows the logged-in user's data (from GET /api/users/profile)
export default function ProfileCard({ user, actions }) {
  const firstName = user.name.split(' ')[0]

  return (
    <section
      aria-label="Your account"
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-sm">
          {getInitials(user.name)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Welcome, {firstName}!
          </h1>
          <dl className="mt-1 flex flex-col gap-x-5 gap-y-1 text-sm text-slate-600 sm:flex-row sm:flex-wrap">
            <div className="flex min-w-0 items-center gap-1.5">
              <dt className="sr-only">Email</dt>
              <MailIcon className="h-4 w-4 shrink-0 text-slate-400" />
              <dd className="truncate">{user.email}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Member since</dt>
              <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
              <dd>Member since {formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
      {actions && <div className="flex shrink-0 [&>*]:w-full sm:[&>*]:w-auto">{actions}</div>}
    </section>
  )
}
