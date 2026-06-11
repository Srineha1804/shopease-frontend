import api from './axios'

export const getAdminStats = () =>
  api.get('/admin/stats')

export const getAllUsers = () =>
  api.get('/admin/users')

export const getAllOrders = () =>
  api.get('/admin/orders')

export const toggleBanUser = (id) =>
  api.put('/admin/users/' + id + '/toggle-ban')