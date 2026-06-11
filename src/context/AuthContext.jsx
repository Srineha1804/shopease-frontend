import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('token') || null)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null'))

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email,
      role: data.role
    }))
    setToken(data.token)
    setUser({ name: data.name, email: data.email, role: data.role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)