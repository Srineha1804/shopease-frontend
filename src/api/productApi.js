import api from './axios'

export const getProducts = (keyword) =>
  api.get('/products', { params: { keyword } })

export const getProductById = (id) =>
  api.get('/products/' + id)

export const createProduct = (data) =>
  api.post('/products', data)

export const updateProduct = (id, data) =>
  api.put('/products/' + id, data)

export const deleteProduct = (id) =>
  api.delete('/products/' + id)

export const getMyProducts = () =>
  api.get('/products/my-products')

export const updateStock = (id, stock) =>
  api.put('/products/' + id + '/stock', { stock })