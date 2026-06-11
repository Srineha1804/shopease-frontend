import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('See you soon!')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav 
      className={`sticky top-0 z-50 w-full px-6 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.03)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Premium Branding Block */}
      <Link to="/" className="flex items-center gap-2.5 group select-none">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
          S
        </div>
        <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
          ShopEase
        </span>
      </Link>

      {/* Central Editorial Navigation Links */}
      <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/40 backdrop-blur-sm">
        <Link 
          to="/products" 
          className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
            isActive('/products') 
              ? 'bg-white text-slate-950 shadow-sm' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Products
        </Link>

        {user?.role === 'ROLE_BUYER' && (
          <>
            <Link 
              to="/cart" 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                isActive('/cart') 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cart
            </Link>
            <Link 
              to="/orders" 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                isActive('/orders') 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Orders
            </Link>
          </>
        )}

        {user?.role === 'ROLE_SELLER' && (
          <Link 
            to="/seller" 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
              isActive('/seller') 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>
        )}

        {user?.role === 'ROLE_ADMIN' && (
          <Link 
            to="/admin" 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase text-rose-600 transition-all duration-200 ${
              isActive('/admin') 
                ? 'bg-rose-50 text-rose-700 shadow-sm font-extrabold' 
                : 'hover:bg-rose-50/50'
          }`}
          >
            Admin Panel
          </Link>
        )}
      </div>

      {/* Dynamic Right Actions Architecture */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* User Profile Capsule Identifier */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full pl-2 pr-3.5 py-1.5 select-none">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-wider">
                {user.name?.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-700 max-w-[90px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </div>
            
            {/* Minimalist Border Action Trigger */}
            <button 
              onClick={handleLogout} 
              className="text-xs font-bold tracking-wide text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-xs font-bold tracking-wide uppercase text-slate-500 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide uppercase px-5 py-2.5 rounded-xl transition-all shadow-md shadow-slate-900/5 active:scale-[0.98]"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}