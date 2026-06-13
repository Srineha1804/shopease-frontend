import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginApi(form)
      login(res.data)
      toast.success('Welcome back, ' + res.data.name + '!')
      if (res.data.role === 'ROLE_SELLER') navigate('/seller')
      else if (res.data.role === 'ROLE_ADMIN') navigate('/admin')
      else navigate('/')
    } catch (err) {
      toast.error('Invalid email or password!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-900 antialiased relative overflow-hidden px-4">
      
      {/* Premium background ambient blur shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] w-full max-w-md transition-all">
        
        {/* Branding & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-black text-xl tracking-tight text-slate-950 mb-3">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm shadow-md shadow-blue-600/20">
              S
            </span>
            ShopEase
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
            Welcome back
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* Form Element */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email input component wrapper */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input 
                type="email"
                placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required 
              />
            </div>
          </div>

          {/* Password input component wrapper */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required 
              />
            </div>
          </div>

          {/* Luxury CTA Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/10 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying Account...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Auxiliary Routing Context */}
        <p className="text-center mt-6 text-slate-400 text-sm font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
