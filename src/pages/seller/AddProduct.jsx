import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../../api/productApi'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: form.categoryId
          ? parseInt(form.categoryId) : null
      })
      toast.success('Product added successfully!')
      navigate('/seller')
    } catch (err) {
      toast.error(err.response?.data?.error
        || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/seller')}
          className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Image Preview */}
          {form.imageUrl && (
            <div className="text-center">
              <img src={form.imageUrl}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl
                  mx-auto border"
                onError={e => e.target.style.display='none'} />
              <p className="text-xs text-gray-400 mt-1">
                Image Preview
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium
              text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2
                focus:outline-none focus:ring-2
                focus:ring-blue-500"
              placeholder="e.g. Samsung Galaxy S24"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required />
          </div>

          <div>
            <label className="block text-sm font-medium
              text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2
                h-24 focus:outline-none focus:ring-2
                focus:ring-blue-500"
              placeholder="Describe your product..."
              value={form.description}
              onChange={e => setForm({
                ...form, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium
                text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input type="number" min="0" step="0.01"
                className="w-full border rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                placeholder="e.g. 999.00"
                value={form.price}
                onChange={e => setForm({
                  ...form, price: e.target.value})}
                required />
            </div>
            <div>
              <label className="block text-sm font-medium
                text-gray-700 mb-1">
                Stock *
              </label>
              <input type="number" min="0"
                className="w-full border rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                placeholder="e.g. 100"
                value={form.stock}
                onChange={e => setForm({
                  ...form, stock: e.target.value})}
                required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium
              text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2
                focus:outline-none focus:ring-2
                focus:ring-blue-500"
              value={form.categoryId}
              onChange={e => setForm({
                ...form, categoryId: e.target.value})}>
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium
              text-gray-700 mb-1">
              Image URL
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2
                focus:outline-none focus:ring-2
                focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={e => setForm({
                ...form, imageUrl: e.target.value})} />
            <p className="text-xs text-gray-400 mt-1">
              Paste any image URL to show product image
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3
                rounded-lg hover:bg-blue-700
                disabled:opacity-50 font-medium">
              {loading ? 'Adding Product...' : '+ Add Product'}
            </button>
            <button type="button"
              onClick={() => navigate('/seller')}
              className="px-6 py-3 border rounded-lg
                hover:bg-gray-50 text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}