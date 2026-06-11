import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/productApi'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchProducts = () => {
    setLoading(true)
    getProducts(keyword)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => {
    if (filter === 'instock') return p.stock > 0
    if (filter === 'outofstock') return p.stock === 0
    return true
  })

  const inStockCount = products.filter(p => p.stock > 0).length
  const outOfStockCount = products.filter(p => p.stock === 0).length

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Premium Hero Banner Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        {/* Subtle Background Pattern Geometric Deco */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/50 via-slate-900 to-slate-900 z-0" />
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center md:text-left md:flex md:items-center md:justify-between gap-8">
          <div className="max-w-2xl mb-8 md:mb-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              ✨ Curated Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Discover Our New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Arrivals</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium">
              Explore premium products crafted by top verified sellers, backed by fast delivery and secure payments.
            </p>
          </div>

          {/* Luxury Floating Search Engine Card */}
          <div className="w-full max-w-md mx-auto md:mx-0 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3.5 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </span>
                <input
                  className="w-full bg-slate-950/40 text-white placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/5 transition-all"
                  placeholder="What are you looking for today?..."
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchProducts()}
                />
              </div>
              <button 
                onClick={fetchProducts}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition font-semibold text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Dynamic Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-slate-200">
          
          {/* Smart Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/20">
            {[
              { key: 'all', label: 'All Products', count: products.length },
              { key: 'instock', label: 'In Stock', count: inStockCount },
              { key: 'outofstock', label: 'Out of Stock', count: outOfStockCount },
            ].map(f => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium tracking-wide ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-300/60 text-slate-700'
                  }`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-slate-500 text-xs font-medium tracking-wide uppercase">
            Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> masterworks
          </p>
        </div>

        {/* Dynamic Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-slate-400 animate-pulse uppercase">
              Curating catalog...
            </p>
          </div>

        /* High-Conversion Empty State */
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto p-8">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-slate-400 border border-slate-100">
              🕵️‍♂️
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-1">
              No matching products found
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
              We couldn't find matches for your current filters or keywords. Try checking your spelling.
            </p>
            <button
              onClick={() => {
                setKeyword('');
                setFilter('all');
                fetchProducts();
              }}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide rounded-xl transition shadow-md shadow-slate-900/10"
            >
              Reset All Filters
            </button>
          </div>

        /* Premium Fashion-Style Grid Layout */
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map(p => {
              const isOutOfStock = p.stock === 0;
              const isLowStock = p.stock > 0 && p.stock < 5;
              
              return (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1"
                >
                  
                  {/* Image Framework Wrapper */}
                  <div className="relative aspect-[4/5] bg-slate-50 w-full overflow-hidden">
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=500&q=80'}
                      alt={p.name}
                      loading="lazy"
                      className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
                        isOutOfStock ? 'contrast-[0.85] brightness-95 grayscale-[30%]' : ''
                      }`}
                    />

                    {/* Minimalist Premium Status Overlays */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <span className="bg-white text-slate-900 text-[10px] tracking-widest font-black uppercase px-3.5 py-1.5 rounded shadow-sm">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {!isOutOfStock && isLowStock && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm animate-pulse">
                        Only {p.stock} Left
                      </div>
                    )}

                    {/* Interactive "Quick View" Trigger */}
                    {!isOutOfStock && (
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="w-full bg-white/95 backdrop-blur text-slate-900 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          View Details
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Complete Context Infobox */}
                  <div className="p-5 flex flex-col flex-1">
                    
                    {/* Brand/Category Row */}
                    <div className="flex items-center gap-2 mb-1.5">
                      {p.category && (
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                          {p.category.name}
                        </span>
                      )}
                      {p.seller && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                            {p.seller.name}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
                      {p.name}
                    </h3>

                    {/* Financial Layout & Context Status Alignment */}
                    <div className="flex items-baseline justify-between gap-2 mt-auto pt-3 border-t border-slate-50">
                      <div className="flex flex-col">
                        {/* Mock Original Price to increase visual appeal via discounts */}
                        <span className="text-[11px] text-slate-400 line-through font-medium">
                          ₹{((p.price || 0) * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-slate-900 font-extrabold text-lg tracking-tight">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${
                        isOutOfStock 
                          ? 'bg-rose-50 text-rose-600' 
                          : isLowStock 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        {isOutOfStock ? 'Unavailable' : isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}