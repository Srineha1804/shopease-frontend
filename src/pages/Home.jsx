import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/productApi'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(res => setProducts(Array.isArray(res.data) ? res.data.slice(0, 8) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      
      {/* 1. Luxury Editorial Hero Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white">
        {/* Subtle Mesh Glow background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 z-0" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/20 mb-6 tracking-wide animate-pulse">
            🚀 The Multi-Vendor Experience
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.1] mb-6">
            Your Premium Destination For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Everything</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-10 font-medium leading-relaxed">
            Discover verified direct-from-seller goods. Enjoy fast nationwide shipping and absolute payment protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/products"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.98]"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Platform Value Props / Trust Indicators */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            {[
              { icon: '📦', title: 'Secured Packing', desc: 'Direct from vetted creators' },
              { icon: '💳', title: 'Protected Escrow', desc: 'Money-back guarantees' },
              { icon: '⚡', title: 'Priority Dispatch', desc: 'Tracked logistics network' },
              { icon: '🤝', title: 'Verified Merchants', desc: 'Ranked by customer support' },
            ].map((trait, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-3 p-2">
                <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100">{trait.icon}</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">{trait.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{trait.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Featured Showcase Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase text-blue-600 tracking-widest">Handpicked Favorites</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">Trending Collections</h2>
          </div>
          {products.length > 0 && (
            <Link to="/products" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider flex items-center gap-1 group">
              View All 
              <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}
        </div>

        {/* Dynamic State Orchestration */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-2xl p-4 h-72 flex flex-col justify-between">
                <div className="w-full h-40 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mt-3" />
                <div className="h-5 bg-slate-100 rounded w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-4">🏬</div>
            <h3 className="font-bold text-slate-900 text-sm">Marketplace catalog empty</h3>
            <p className="text-slate-400 text-xs mt-1 mb-5">Be among our launch pioneers. Open up a storefront and show your listings here.</p>
            <Link to="/products" className="inline-flex text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition">Browse Anyway</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map(p => (
              <Link 
                key={p.id} 
                to={'/products/' + p.id}
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1"
              >
                {/* Fixed Retail Crop Image Frame */}
                <div className="relative aspect-[4/5] w-full bg-slate-50 overflow-hidden">
                  <img 
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=500&q=80'} 
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105" 
                  />
                  {/* Subtle Quick Actions Layer */}
                  <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="w-full bg-white/95 backdrop-blur text-slate-900 font-bold text-[11px] py-2 rounded-xl flex items-center justify-center shadow-md">
                      Inspect Item
                    </span>
                  </div>
                </div>

                {/* Typography metadata frame */}
                <div className="p-4 flex flex-col flex-1">
                  {p.category && (
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mb-1">
                      {p.category.name}
                    </span>
                  )}
                  <h3 className="font-semibold text-slate-800 text-xs sm:text-sm tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {p.name}
                  </h3>
                  
                  <div className="flex items-baseline justify-between gap-2 mt-auto pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 line-through font-medium">
                        ₹{((p.price || 0) * 1.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      20% OFF
                    </span>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}