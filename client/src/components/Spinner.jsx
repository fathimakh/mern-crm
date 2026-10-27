const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-current border-r-transparent ${SIZES[size]} ${className}`}
    />
  )
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
      <Spinner size="lg" className="text-indigo-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
