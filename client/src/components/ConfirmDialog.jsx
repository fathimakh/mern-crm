import { useEffect, useRef } from 'react'
import Alert from './Alert'
import Button from './Button'
import { TrashIcon } from './icons'

// Modal asking the user to confirm a destructive action (used before deleting a customer)
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  loadingLabel = 'Deleting…',
  loading = false,
  error,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)
  const panelRef = useRef(null)

  // Focus "Cancel" when the dialog opens and give focus back to the opening button when it closes
  useEffect(() => {
    if (!open) return undefined
    const opener = document.activeElement
    cancelRef.current?.focus()
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [open])

  // Escape closes the dialog; Tab / Shift+Tab stay inside it
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) onCancel()
      if (event.key !== 'Tab') return

      const focusable = [...panelRef.current.querySelectorAll('button:not([disabled]), a[href]')]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const inside = panelRef.current.contains(document.activeElement)

      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]" aria-hidden="true" onClick={loading ? undefined : onCancel} />
      <div ref={panelRef} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <TrashIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-slate-900">
              {title}
            </h2>
            <p id="confirm-dialog-message" className="mt-1 text-sm text-slate-600">
              {message}
            </p>
          </div>
        </div>
        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {loading ? loadingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
