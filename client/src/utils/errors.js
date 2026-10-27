// Turn an axios error into a message that can be shown to the user
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response) {
    return error.response.data?.message || `Request failed with status ${error.response.status}`
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.'
  }
  if (error?.request) {
    return 'Cannot reach the server. Please check that the API is running and try again.'
  }
  return error?.message || fallback
}

// Field-level errors returned by the API validation middleware: { field: message }
export const getFieldErrors = (error) => error?.response?.data?.errors || {}
