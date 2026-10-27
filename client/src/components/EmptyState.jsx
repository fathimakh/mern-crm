export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      {Icon && (
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
