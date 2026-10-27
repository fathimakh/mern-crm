import api from '../api/axios'

// Only send the fields the API accepts
const toPayload = ({ name, email, phone, company, status, notes }) => ({
  name,
  email,
  phone,
  company,
  status,
  notes,
})

// GET /api/customers
export const getCustomers = async (params = {}) => {
  const { data } = await api.get('/customers', { params })
  return data.customers
}

// GET /api/customers/:id
export const getCustomer = async (id) => {
  const { data } = await api.get(`/customers/${id}`)
  return data.customer
}

// POST /api/customers
export const createCustomer = async (customer) => {
  const { data } = await api.post('/customers', toPayload(customer))
  return data
}

// PUT /api/customers/:id
export const updateCustomer = async (id, customer) => {
  const { data } = await api.put(`/customers/${id}`, toPayload(customer))
  return data
}

// DELETE /api/customers/:id
export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${id}`)
  return data
}
