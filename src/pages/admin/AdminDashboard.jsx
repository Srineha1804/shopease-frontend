import { useEffect, useState } from 'react'
import {
  getAdminStats, getAllUsers,
  getAllOrders, toggleBanUser
} from '../../api/adminApi'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getAllUsers(),
      getAllOrders()
    ]).then(([s, u, o]) => {
      setStats(s.data)
      setUsers(Array.isArray(u.data) ? u.data : [])
      setOrders(Array.isArray(o.data) ? o.data : [])
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const handleToggleBan = async (id, name) => {
    try {
      const res = await toggleBanUser(id)
      setUsers(users.map(u =>
        u.id === id
          ? {...u, enabled: !u.enabled} : u))
      toast.success(res.data)
    } catch {
      toast.error('Failed to update user!')
    }
  }

  const statusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100'
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10
        border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your ShopEase platform
          </p>
        </div>
        <div className="bg-red-100 text-red-700 px-4 py-2
          rounded-full text-sm font-medium">
          🔐 Admin Access
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500
          to-blue-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm mb-1">
            Total Users
          </p>
          <p className="text-4xl font-bold">
            {stats.totalUsers || 0}
          </p>
          <p className="text-blue-200 text-sm mt-2">
            👥 Registered users
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500
          to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm mb-1">
            Total Orders
          </p>
          <p className="text-4xl font-bold">
            {stats.totalOrders || 0}
          </p>
          <p className="text-green-200 text-sm mt-2">
            📦 All time orders
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-500
          to-purple-600 rounded-xl p-6 text-white">
          <p className="text-purple-100 text-sm mb-1">
            Total Revenue
          </p>
          <p className="text-4xl font-bold">
            ₹{Number(stats.totalRevenue || 0).toFixed(0)}
          </p>
          <p className="text-purple-200 text-sm mt-2">
            💰 Platform revenue
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b pb-3">
        {['overview','users','orders'].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-medium
              capitalize transition ${
              tab === t
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-100'}`}>
            {t === 'overview' && '📊 '}
            {t === 'users' && '👥 '}
            {t === 'orders' && '📦 '}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">
              Recent Users
            </h2>
            <div className="space-y-3">
              {users.slice(0,5).map(u => (
                <div key={u.id}
                  className="flex items-center
                    justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full
                      bg-blue-100 flex items-center
                      justify-center text-blue-600 font-bold">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {u.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1
                    rounded-full ${u.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'}`}>
                    {u.enabled ? 'Active' : 'Banned'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">
              Recent Orders
            </h2>
            <div className="space-y-3">
              {orders.slice(0,5).map(o => (
                <div key={o.id}
                  className="flex items-center
                    justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Order #{o.id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.buyer?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1
                      rounded-full ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      ₹{o.totalAmount?.toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <input
              className="w-full border rounded-lg px-4 py-2
                focus:outline-none focus:ring-2
                focus:ring-blue-500"
              placeholder="Search users by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['ID','Name','Email','Phone',
                    'Status','Action'].map(h => (
                    <th key={h}
                      className="px-4 py-3 text-left
                        text-xs font-medium text-gray-500
                        uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map(u => (
                  <tr key={u.id}
                    className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm
                      text-gray-500">
                      #{u.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full
                          bg-blue-100 flex items-center
                          justify-center text-blue-600
                          font-bold text-sm">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {u.phone || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1
                        rounded-full font-medium ${
                        u.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'}`}>
                        {u.enabled ? '✅ Active' : '🚫 Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleToggleBan(u.id, u.name)}
                        className={`text-xs px-3 py-1
                          rounded-lg font-medium transition ${
                          u.enabled
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                        {u.enabled ? 'Ban' : 'Unban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No users found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b flex justify-between">
            <p className="font-medium">
              All Orders ({orders.length})
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID','Buyer','Items',
                    'Total','Status','Address'].map(h => (
                    <th key={h}
                      className="px-4 py-3 text-left
                        text-xs font-medium text-gray-500
                        uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(o => (
                  <tr key={o.id}
                    className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm
                      font-medium">
                      #{o.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p>{o.buyer?.name}</p>
                      <p className="text-xs text-gray-400">
                        {o.buyer?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {o.items?.length || 0} items
                    </td>
                    <td className="px-4 py-3 text-sm
                      font-semibold text-blue-600">
                      ₹{o.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1
                        rounded-full font-medium
                        ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs
                      text-gray-500 max-w-32 truncate">
                      {o.shippingAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No orders found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}