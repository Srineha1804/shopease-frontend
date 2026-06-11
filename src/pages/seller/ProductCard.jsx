import { useState } from 'react'
import { updateStock } from '../../api/productApi'
import toast from 'react-hot-toast'

export default function ProductCard({
  product, onDelete, onStockUpdate }) {

  const [editing, setEditing] = useState(false)
  const [newStock, setNewStock] = useState(product.stock)
  const [loading, setLoading] = useState(false)

  const handleStockSave = async () => {
    if (newStock < 0) {
      toast.error('Stock cannot be negative!')
      return
    }
    setLoading(true)
    try {
      await updateStock(product.id, newStock)
      onStockUpdate(product.id, newStock)
      setEditing(false)
      toast.success(
        newStock === 0
          ? '⚠️ Product marked as Out of Stock!'
          : `✅ Stock updated to ${newStock}!`)
    } catch {
      toast.error('Failed to update stock!')
    } finally {
      setLoading(false)
    }
  }

  const stockStatus = () => {
    if (product.stock === 0) return {
      label: '❌ Out of Stock',
      color: 'bg-red-100 text-red-600 border-red-200'
    }
    if (product.stock < 5) return {
      label: `⚠️ Low Stock: ${product.stock}`,
      color: 'bg-orange-100 text-orange-600 border-orange-200'
    }
    return {
      label: `✅ In Stock: ${product.stock}`,
      color: 'bg-green-100 text-green-600 border-green-200'
    }
  }

  const status = stockStatus()

  return (
    <div className={`bg-white rounded-2xl shadow
      hover:shadow-md transition border-l-4 ${
      product.stock === 0
        ? 'border-red-400'
        : product.stock < 5
          ? 'border-orange-400'
          : 'border-green-400'}`}>

      <div className="p-5 flex gap-4">

        {/* Product Image */}
        <div className="relative">
          <img
            src={product.imageUrl
              || 'https://via.placeholder.com/80'}
            className={`w-20 h-20 object-cover
              rounded-xl flex-shrink-0 ${
              product.stock === 0 ? 'opacity-50' : ''}`} />
          {product.stock === 0 && (
            <div className="absolute inset-0 flex
              items-center justify-center bg-black
              bg-opacity-40 rounded-xl">
              <span className="text-white text-xs
                font-bold">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800
            text-lg truncate">
            {product.name}
          </p>
          <p className="text-blue-600 font-bold text-xl">
            ₹{product.price}
          </p>

          {/* Stock Status Badge */}
          <span className={`inline-block text-xs px-3
            py-1 rounded-full border font-medium mt-2
            ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 items-end">
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-400 hover:text-red-600
              hover:bg-red-50 p-2 rounded-xl transition
              text-lg">
            🗑️
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-400 hover:text-blue-600
              hover:bg-blue-50 p-2 rounded-xl transition
              text-lg">
            ✏️
          </button>
        </div>
      </div>

      {/* Stock Update Panel */}
      {editing && (
        <div className="border-t bg-gray-50 px-5 py-4
          rounded-b-2xl">
          <p className="text-sm font-semibold
            text-gray-700 mb-3">
            📦 Update Stock Quantity
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewStock(
                Math.max(0, newStock - 1))}
              className="w-10 h-10 bg-white border
                rounded-xl text-xl font-bold
                hover:bg-gray-100 transition
                flex items-center justify-center">
              −
            </button>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={e => setNewStock(
                Number(e.target.value))}
              className="w-24 border rounded-xl px-3
                py-2 text-center font-bold text-lg
                focus:outline-none focus:ring-2
                focus:ring-blue-500" />
            <button
              onClick={() => setNewStock(newStock + 1)}
              className="w-10 h-10 bg-white border
                rounded-xl text-xl font-bold
                hover:bg-gray-100 transition
                flex items-center justify-center">
              +
            </button>

            <div className="flex gap-2 ml-2">
              <button
                onClick={handleStockSave}
                disabled={loading}
                className="bg-blue-600 text-white px-5
                  py-2 rounded-xl hover:bg-blue-700
                  disabled:opacity-50 font-medium
                  transition">
                {loading ? '...' : '✓ Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setNewStock(product.stock)
                }}
                className="bg-gray-200 text-gray-600
                  px-4 py-2 rounded-xl hover:bg-gray-300
                  transition">
                Cancel
              </button>
            </div>
          </div>

          {/* Quick set buttons */}
          <div className="flex gap-2 mt-3">
            <p className="text-xs text-gray-400 mr-1
              self-center">Quick set:</p>
            {[0, 10, 25, 50, 100].map(qty => (
              <button key={qty}
                onClick={() => setNewStock(qty)}
                className={`text-xs px-3 py-1
                  rounded-full border transition ${
                  newStock === qty
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                {qty === 0 ? '0 (OOS)' : qty}
              </button>
            ))}
          </div>

          {newStock === 0 && (
            <div className="mt-3 bg-red-50 border
              border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm
                font-medium">
                ⚠️ Setting stock to 0 will mark this
                product as "Out of Stock" for buyers!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}