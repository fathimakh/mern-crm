import Button from '../components/Button'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <div className="flex min-h-[calc(100vh-7.125rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
      <Button to="/" className="mt-8">
        Go to customers
      </Button>
    </div>
  )
}
