import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import SellerDashboard from './pages/seller/SellerDashboard'
import AddProduct from './pages/seller/AddProduct'
import AdminDashboard from './pages/admin/AdminDashboard'
import { Toaster } from 'react-hot-toast'

function PrivateRoute({ children, roles }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={
          <PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={
          <PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/orders" element={
          <PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/seller/add-product" element={
          <PrivateRoute roles={['ROLE_SELLER']}>
          <AddProduct />
        </PrivateRoute>} />
        <Route path="/admin" element={
          <PrivateRoute roles={['ROLE_ADMIN']}>
          <AdminDashboard />
           </PrivateRoute>} />
        <Route path="/seller" element={
          <PrivateRoute roles={['ROLE_SELLER']}>
            <SellerDashboard />
          </PrivateRoute>} />
      </Routes>
    </div>
  )
}