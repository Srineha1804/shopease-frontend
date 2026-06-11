import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerApi } from '../api/authApi'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', role: 'BUYER'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerApi(form)
      toast.success('Registered! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-900 antialiased relative overflow-hidden px-4 py-12">
      
      {/* Background ambient light styling decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[5%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Primary Card Framework */}
      <div className="relative z-10 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] w-full max-w-md transition-all">
        
        {/* Editorial Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-black text-xl tracking-tight text-slate-950 mb-3">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm shadow-md shadow-blue-600/20">
              S
            </span>
            ShopEase
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
            Get started today
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Join thousands of shoppers and merchants worldwide
          </p>
        </div>

        {/* Entry Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Interactive Modern Segmentation for Role Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Choose Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'BUYER', title: '🛍️ Buyer', subtitle: 'Shop premium items' },
                { value: 'SELLER', title: '🚀 Seller', subtitle: 'Launch your storefront' }
              ].map((roleOption) => {
                const isSelected = form.role === roleOption.value;
                return (
                  <button
                    key={roleOption.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: roleOption.value })}
                    className={`p-3 text-left rounded-xl border text-xs transition-all duration-200 flex flex-col ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/10'
                        : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-bold transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
                      {roleOption.title}
                    </span>
                    <span className="text-slate-400 font-medium mt-0.5 text-[10px]">
                      {roleOption.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Full Name field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input 
              placeholder="John Doe"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required 
            />
          </div>

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input 
              type="email"
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required 
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input 
              type="password"
              placeholder="Min 6 characters"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required 
            />
          </div>

          {/* Phone Number field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number <span className="text-slate-400 font-medium lowercase">(optional)</span>
            </label>
            <input 
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})} 
            />
          </div>

          {/* Premium High-Conversion CTA Submit Trigger */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/10 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Provisioning Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Secondary Navigation Context */}
        <p className="text-center mt-6 text-slate-400 text-sm font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}