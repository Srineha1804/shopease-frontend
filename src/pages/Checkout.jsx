import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../api/orderApi'
import toast from 'react-hot-toast'

export default function Checkout() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter shipping address!')
      return
    }
    setLoading(true)
    try {
      await placeOrder(address)
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shipping Address
        </label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full shipping address..."
          value={address}
          onChange={e => setAddress(e.target.value)} />
        <button onClick={handleOrder} disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}