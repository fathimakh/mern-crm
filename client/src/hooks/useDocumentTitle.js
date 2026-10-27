import { useEffect } from 'react'

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | MERN CRM` : 'MERN CRM'
  }, [title])
}
