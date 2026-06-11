import api from './axios'

export const placeOrder = (shippingAddress) =>
  api.post('/orders/place', { shippingAddress })
export const getMyOrders = () => api.get('/orders/my-orders')
export const getOrderById = (id) => api.get('/orders/' + id)
export const updateOrderStatus = (id, status) =>
  api.put('/orders/' + id + '/status', { status })
export const getSellerOrders = () => api.get('/orders/seller-orders')
export const cancelOrder = (id) =>
  api.put('/orders/' + id + '/cancel')