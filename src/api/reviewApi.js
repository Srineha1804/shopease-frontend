import api from './axios'

export const getReviews = (productId) =>
  api.get('/reviews/' + productId)

export const addReview = (productId, data) =>
  api.post('/reviews/' + productId, data)

export const getAverageRating = (productId) =>
  api.get('/reviews/' + productId + '/average')