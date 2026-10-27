import { LogoMark } from './icons'

// Centered card used by the Login and Register pages
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-10 sm:items-center sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <LogoMark className="mx-auto h-12 w-12" />
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</div>
        {footer && <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>}
      </div>
    </div>
  )
}
