import api from '../api/axios'

// POST /api/users/register -> { token, user }
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post('/users/register', { name, email, password })
  return data
}

// POST /api/users/login -> { token, user }
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/users/login', { email, password })
  return data
}

// GET /api/users/profile -> { user }
export const getProfile = async () => {
  const { data } = await api.get('/users/profile')
  return data.user
}
