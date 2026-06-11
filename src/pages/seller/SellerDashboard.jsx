import { useEffect, useState } from 'react'
import { getMyProducts, deleteProduct, updateStock } from '../../api/productApi'
import { getSellerOrders, updateOrderStatus } from '../../api/orderApi'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'


const STATUS_OPTIONS = ['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED']
const STATUS_COLORS = {
  PENDING:'pill-pending', PROCESSING:'pill-processing',
  SHIPPED:'pill-shipped', DELIVERED:'pill-delivered',
  CANCELLED:'pill-cancelled'
}

// Stock Update Card Component
function ProductStockCard({ product, onDelete, onStockUpdate }) {
  const [editing, setEditing] = useState(false)
  const [newStock, setNewStock] = useState(product.stock)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (newStock < 0) {
      toast.error('Stock cannot be negative!')
      return
    }
    setLoading(true)
    try {
      await updateStock(product.id, newStock)
      onStockUpdate(product.id, newStock)
      setEditing(false)
      toast.success(newStock === 0
        ? '⚠️ Marked as Out of Stock!'
        : `✅ Stock updated to ${newStock}!`)
    } catch {
      toast.error('Failed to update stock!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background:'#fff', borderRadius:16,
      border: product.stock === 0
        ? '1.5px solid #f3a8a8'
        : product.stock < 5
          ? '1.5px solid #f5c842'
          : '1.5px solid #e8e4dd',
      overflow:'hidden',
      boxShadow: product.stock === 0
        ? '0 0 0 3px #fdeaea' : 'none'
    }}>
      {/* Out of Stock Banner */}
      {product.stock === 0 && (
        <div style={{
          background:'#d94f4f', color:'#fff',
          textAlign:'center', padding:'6px',
          fontSize:'0.75rem', fontWeight:700,
          letterSpacing:'0.05em'
        }}>
          ❌ OUT OF STOCK — Update stock to relist
        </div>
      )}
      {product.stock > 0 && product.stock < 5 && (
        <div style={{
          background:'#b7820a', color:'#fff',
          textAlign:'center', padding:'6px',
          fontSize:'0.75rem', fontWeight:700
        }}>
          ⚠️ LOW STOCK — Only {product.stock} left!
        </div>
      )}

      {/* Image */}
      <div style={{
        height:160, overflow:'hidden',
        background:'#f5f3ef', position:'relative'
      }}>
        <img
          src={product.imageUrl
            || `https://picsum.photos/seed/${product.id}/400/300`}
          style={{
            width:'100%', height:'100%',
            objectFit:'cover',
            filter: product.stock === 0
              ? 'grayscale(80%)' : 'none',
            transition:'transform 0.4s'
          }}
          onMouseEnter={e =>
            e.target.style.transform='scale(1.06)'}
          onMouseLeave={e =>
            e.target.style.transform='scale(1)'}
        />
        {product.stock === 0 && (
          <div style={{
            position:'absolute', inset:0,
            background:'rgba(0,0,0,0.35)',
            display:'flex', alignItems:'center',
            justifyContent:'center'
          }}>
            <span style={{
              color:'#fff', fontWeight:800,
              fontSize:'1.1rem', letterSpacing:'0.1em',
              textShadow:'0 2px 8px rgba(0,0,0,0.5)'
            }}>SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'16px 18px' }}>
        <p style={{
          fontWeight:600, fontSize:'0.95rem',
          color:'#0f0f0f', marginBottom:4
        }}>{product.name}</p>

        <div style={{
          display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:12
        }}>
          <p style={{
            fontFamily:"'Playfair Display', serif",
            fontWeight:700, color:'#c9a84c', fontSize:'1.1rem'
          }}>₹{product.price?.toLocaleString('en-IN')}</p>
          <span style={{
            fontSize:'0.75rem',
            color: product.stock === 0
              ? '#d94f4f'
              : product.stock < 5
                ? '#b7820a' : '#2e9e6b',
            background: product.stock === 0
              ? '#fdeaea'
              : product.stock < 5
                ? '#fff8e6' : '#e6f9f1',
            padding:'3px 8px', borderRadius:6,
            fontWeight:700
          }}>
            {product.stock === 0
              ? 'Out of Stock'
              : `Stock: ${product.stock}`}
          </span>
        </div>

        {/* Stock Edit Panel */}
        {editing ? (
          <div style={{
            background:'#f8f7f4', borderRadius:10,
            padding:14, marginBottom:12,
            border:'1px solid #e8e4dd'
          }}>
            <p style={{
              fontSize:'0.8rem', fontWeight:700,
              color:'#6b6b6b', marginBottom:10
            }}>📦 Update Stock</p>

            {/* +/- controls */}
            <div style={{
              display:'flex', alignItems:'center',
              gap:8, marginBottom:10
            }}>
              <button
                onClick={() => setNewStock(
                  Math.max(0, newStock - 1))}
                style={{
                  width:34, height:34,
                  borderRadius:8, border:'1.5px solid #e8e4dd',
                  background:'#fff', fontSize:'1.2rem',
                  fontWeight:700, cursor:'pointer',
                  display:'flex', alignItems:'center',
                  justifyContent:'center'
                }}>−</button>
              <input
                type="number" min="0"
                value={newStock}
                onChange={e => setNewStock(
                  Number(e.target.value))}
                style={{
                  width:70, textAlign:'center',
                  border:'1.5px solid #e8e4dd',
                  borderRadius:8, padding:'6px',
                  fontSize:'1rem', fontWeight:700,
                  outline:'none'
                }}/>
              <button
                onClick={() => setNewStock(newStock + 1)}
                style={{
                  width:34, height:34,
                  borderRadius:8, border:'1.5px solid #e8e4dd',
                  background:'#fff', fontSize:'1.2rem',
                  fontWeight:700, cursor:'pointer',
                  display:'flex', alignItems:'center',
                  justifyContent:'center'
                }}>+</button>
            </div>

            {/* Quick set */}
            <div style={{
              display:'flex', gap:6,
              flexWrap:'wrap', marginBottom:10
            }}>
              {[0,10,25,50,100].map(q => (
                <button key={q}
                  onClick={() => setNewStock(q)}
                  style={{
                    padding:'3px 10px', borderRadius:6,
                    border:'1.5px solid',
                    borderColor: newStock === q
                      ? '#c9a84c' : '#e8e4dd',
                    background: newStock === q
                      ? '#c9a84c' : '#fff',
                    color: newStock === q
                      ? '#fff' : '#6b6b6b',
                    fontSize:'0.75rem', fontWeight:600,
                    cursor:'pointer'
                  }}>
                  {q === 0 ? '0 (OOS)' : q}
                </button>
              ))}
            </div>

            {newStock === 0 && (
              <div style={{
                background:'#fdeaea',
                border:'1px solid #f3a8a8',
                borderRadius:8, padding:'8px 10px',
                fontSize:'0.75rem', color:'#d94f4f',
                marginBottom:10
              }}>
                ⚠️ This will mark the product as
                "Out of Stock" for buyers!
              </div>
            )}

            {/* Save/Cancel */}
            <div style={{ display:'flex', gap:8 }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex:1, padding:'8px',
                  background:'#0f0f0f', color:'#fff',
                  border:'none', borderRadius:8,
                  fontWeight:700, fontSize:'0.85rem',
                  cursor:'pointer', opacity: loading ? 0.6 : 1
                }}>
                {loading ? 'Saving...' : '✓ Save Stock'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setNewStock(product.stock)
                }}
                style={{
                  padding:'8px 14px',
                  background:'#f0ece5', color:'#6b6b6b',
                  border:'none', borderRadius:8,
                  fontWeight:600, fontSize:'0.85rem',
                  cursor:'pointer'
                }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            style={{
              width:'100%', padding:'8px',
              borderRadius:8,
              border:'1.5px solid',
              borderColor: product.stock === 0
                ? '#c9a84c' : '#e8e4dd',
              background: product.stock === 0
                ? '#c9a84c' : '#f8f7f4',
              color: product.stock === 0
                ? '#fff' : '#6b6b6b',
              fontWeight:600, fontSize:'0.82rem',
              cursor:'pointer', marginBottom:8,
              transition:'all 0.2s'
            }}>
            {product.stock === 0
              ? '🔄 Restock Product'
              : '📦 Update Stock'}
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => onDelete(product.id)}
          style={{
            width:'100%', padding:'8px',
            borderRadius:8,
            border:'1.5px solid #f3a8a8',
            background:'#fdeaea', color:'#d94f4f',
            fontWeight:600, fontSize:'0.82rem',
            cursor:'pointer', transition:'all 0.2s'
          }}>
          Remove Listing
        </button>
      </div>
    </div>
  )
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyProducts(), getSellerOrders()])
      .then(([p, o]) => {
        setProducts(Array.isArray(p.data) ? p.data : [])
        setOrders(Array.isArray(o.data) ? o.data : [])
      }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id)
    setProducts(products.filter(p => p.id !== id))
    toast.success('Product removed')
  }

  const handleStockUpdate = (productId, newStock) => {
    setProducts(products.map(p =>
      p.id === productId ? {...p, stock: newStock} : p))
  }

  const handleStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status)
    setOrders(orders.map(o =>
      o.id === orderId ? {...o, status} : o))
    toast.success('Status updated')
  }

  const revenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((s, o) => s + (o.totalAmount || 0), 0)
  const pending = orders
    .filter(o => o.status === 'PENDING').length
  const outOfStock = products
    .filter(p => p.stock === 0).length

  if (loading) return (
    <div style={{
      display:'flex', justifyContent:'center',
      alignItems:'center', height:'70vh'
    }}>
      <div style={{
        width:40, height:40, borderRadius:'50%',
        border:'3px solid #e8e4dd',
        borderTopColor:'#c9a84c',
        animation:'spin 0.8s linear infinite'
      }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div className="page-enter" style={{
      maxWidth:1200, margin:'0 auto', padding:'48px'
    }}>

      {/* Header */}
      <div style={{
        display:'flex', justifyContent:'space-between',
        alignItems:'flex-end', marginBottom:40
      }}>
        <div>
          <p style={{
            color:'#c9a84c', fontSize:'0.8rem',
            fontWeight:700, letterSpacing:'0.1em', marginBottom:6
          }}>SELLER PORTAL</p>
          <h1 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:'2.4rem', fontWeight:700, color:'#0f0f0f'
          }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color:'#9e9e9e', marginTop:4 }}>
            Here's what's happening with your store today.
          </p>
        </div>
        <Link to="/seller/add-product"
          className="btn-gold"
          style={{
            padding:'12px 28px', borderRadius:10,
            textDecoration:'none', fontSize:'0.95rem',
            display:'flex', alignItems:'center', gap:8
          }}>
          <span style={{ fontSize:'1.1rem' }}>+</span>
          Add Product
        </Link>
      </div>

      {/* Stats — now 5 cards including Out of Stock */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(5, 1fr)',
        gap:20, marginBottom:40
      }}>
        {[
          { label:'Total Revenue',
            value:`₹${revenue.toLocaleString('en-IN')}`,
            sub:'From completed orders',
            icon:'💰', accent:'#c9a84c' },
          { label:'Total Orders',
            value:orders.length,
            sub:'All time',
            icon:'📦', accent:'#2a5bd7' },
          { label:'Pending Orders',
            value:pending,
            sub:'Need your attention',
            icon:'⏳', accent:'#b7820a' },
          { label:'Products Listed',
            value:products.length,
            sub:'Active listings',
            icon:'🛍️', accent:'#2e9e6b' },
          { label:'Out of Stock',
            value:outOfStock,
            sub:'Need restocking',
            icon:'❌', accent:'#d94f4f' },
        ].map(stat => (
          <div key={stat.label} style={{
            background:'#fff', borderRadius:16,
            border: stat.label === 'Out of Stock'
              && outOfStock > 0
                ? '1.5px solid #f3a8a8'
                : '1.5px solid #e8e4dd',
            padding:'24px 22px',
            position:'relative', overflow:'hidden'
          }}>
            <div style={{
              position:'absolute', top:-10, right:-10,
              width:70, height:70, borderRadius:'50%',
              background:`${stat.accent}15`
            }}/>
            <p style={{
              fontSize:'1.6rem', marginBottom:10
            }}>{stat.icon}</p>
            <p style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:'2rem', fontWeight:700,
              color: stat.label === 'Out of Stock'
                && outOfStock > 0
                  ? '#d94f4f' : '#0f0f0f',
              marginBottom:4
            }}>{stat.value}</p>
            <p style={{
              fontWeight:600, color:'#0f0f0f',
              fontSize:'0.88rem', marginBottom:2
            }}>{stat.label}</p>
            <p style={{
              color:'#9e9e9e', fontSize:'0.78rem'
            }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display:'flex', gap:4, background:'#fff',
        border:'1.5px solid #e8e4dd', borderRadius:12,
        padding:4, width:'fit-content', marginBottom:28
      }}>
        {[
          { key:'overview', label:'Overview' },
          { key:'products',
            label:`Products (${products.length})` },
          { key:'orders',
            label:`Orders (${orders.length})` },
        ].map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding:'8px 22px', borderRadius:9,
              border:'none', cursor:'pointer',
              fontWeight:600, fontSize:'0.88rem',
              background: tab === t.key
                ? '#0f0f0f' : 'transparent',
              color: tab === t.key
                ? '#faf8f4' : '#6b6b6b',
              transition:'all 0.2s',
              position:'relative'
            }}>
            {t.label}
            {t.key === 'products' && outOfStock > 0 && (
              <span style={{
                position:'absolute', top:-4, right:-4,
                background:'#d94f4f', color:'#fff',
                width:16, height:16, borderRadius:'50%',
                fontSize:'0.6rem', fontWeight:800,
                display:'flex', alignItems:'center',
                justifyContent:'center'
              }}>{outOfStock}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr', gap:24
        }}>
          {/* Recent Products */}
          <div style={{
            background:'#fff', borderRadius:16,
            border:'1.5px solid #e8e4dd', padding:24
          }}>
            <div style={{
              display:'flex', justifyContent:'space-between',
              marginBottom:20
            }}>
              <h3 style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:'1.2rem', fontWeight:700
              }}>Recent Products</h3>
              <button onClick={() => setTab('products')}
                style={{
                  fontSize:'0.8rem', color:'#c9a84c',
                  background:'none', border:'none',
                  cursor:'pointer', fontWeight:600
                }}>View All →</button>
            </div>
            {products.slice(0,4).map(p => (
              <div key={p.id} style={{
                display:'flex', gap:14,
                alignItems:'center', padding:'12px 0',
                borderBottom:'1px solid #f0ece5'
              }}>
                <div style={{
                  width:48, height:48, borderRadius:10,
                  overflow:'hidden', background:'#f5f3ef',
                  flexShrink:0, position:'relative'
                }}>
                  <img
                    src={p.imageUrl
                      || `https://picsum.photos/seed/${p.id}/100`}
                    style={{
                      width:'100%', height:'100%',
                      objectFit:'cover',
                      filter: p.stock === 0
                        ? 'grayscale(80%)' : 'none'
                    }}/>
                  {p.stock === 0 && (
                    <div style={{
                      position:'absolute', inset:0,
                      background:'rgba(0,0,0,0.4)',
                      display:'flex', alignItems:'center',
                      justifyContent:'center'
                    }}>
                      <span style={{
                        color:'#fff', fontSize:'0.45rem',
                        fontWeight:800
                      }}>OOS</span>
                    </div>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{
                    fontWeight:600, fontSize:'0.9rem',
                    color:'#0f0f0f'
                  }}>{p.name}</p>
                  <p style={{
                    color: p.stock === 0
                      ? '#d94f4f'
                      : p.stock < 5
                        ? '#b7820a' : '#9e9e9e',
                    fontSize:'0.78rem', fontWeight:600
                  }}>
                    {p.stock === 0
                      ? '❌ Out of Stock'
                      : p.stock < 5
                        ? `⚠️ Low: ${p.stock}`
                        : `Stock: ${p.stock}`}
                  </p>
                </div>
                <p style={{
                  fontFamily:"'Playfair Display', serif",
                  fontWeight:700, color:'#c9a84c',
                  fontSize:'1rem'
                }}>₹{p.price?.toLocaleString('en-IN')}</p>
              </div>
            ))}
            {products.length === 0 && (
              <p style={{
                color:'#9e9e9e', textAlign:'center',
                padding:'24px 0'
              }}>No products yet</p>
            )}
          </div>

          {/* Recent Orders */}
          <div style={{
            background:'#fff', borderRadius:16,
            border:'1.5px solid #e8e4dd', padding:24
          }}>
            <div style={{
              display:'flex', justifyContent:'space-between',
              marginBottom:20
            }}>
              <h3 style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:'1.2rem', fontWeight:700
              }}>Recent Orders</h3>
              <button onClick={() => setTab('orders')}
                style={{
                  fontSize:'0.8rem', color:'#c9a84c',
                  background:'none', border:'none',
                  cursor:'pointer', fontWeight:600
                }}>View All →</button>
            </div>
            {orders.slice(0,4).map(o => (
              <div key={o.id} style={{
                display:'flex', justifyContent:'space-between',
                alignItems:'center', padding:'12px 0',
                borderBottom:'1px solid #f0ece5'
              }}>
                <div>
                  <p style={{
                    fontWeight:600, fontSize:'0.9rem'
                  }}>Order #{o.id}</p>
                  <p style={{
                    color:'#9e9e9e', fontSize:'0.78rem'
                  }}>{o.buyer?.name}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span className={STATUS_COLORS[o.status]}
                    style={{
                      fontSize:'0.72rem', fontWeight:700,
                      padding:'3px 10px', borderRadius:12,
                      display:'block', marginBottom:4
                    }}>{o.status}</span>
                  <p style={{
                    color:'#c9a84c', fontWeight:700,
                    fontSize:'0.85rem'
                  }}>
                    ₹{o.totalAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p style={{
                color:'#9e9e9e', textAlign:'center',
                padding:'24px 0'
              }}>No orders yet</p>
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          {/* Out of stock alert */}
          {outOfStock > 0 && (
            <div style={{
              background:'#fdeaea',
              border:'1.5px solid #f3a8a8',
              borderRadius:12, padding:'12px 18px',
              marginBottom:20, display:'flex',
              alignItems:'center', gap:10
            }}>
              <span style={{ fontSize:'1.2rem' }}>⚠️</span>
              <p style={{
                color:'#d94f4f', fontWeight:600,
                fontSize:'0.88rem'
              }}>
                {outOfStock} product{outOfStock > 1 ? 's' : ''}
                out of stock! Click "🔄 Restock Product"
                to update stock and relist for buyers.
              </p>
            </div>
          )}

          {products.length === 0 ? (
            <div style={{
              textAlign:'center', padding:'72px',
              background:'#fff', borderRadius:16,
              border:'1.5px dashed #e8e4dd'
            }}>
              <p style={{
                fontSize:'3rem', marginBottom:12
              }}>🛍️</p>
              <h3 style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:'1.5rem', marginBottom:8
              }}>No products yet</h3>
              <Link to="/seller/add-product"
                className="btn-gold"
                style={{
                  display:'inline-block',
                  padding:'12px 28px',
                  borderRadius:10, textDecoration:'none',
                  marginTop:8
                }}>Add Your First Product</Link>
            </div>
          ) : (
            <div style={{
              display:'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(260px, 1fr))',
              gap:20
            }}>
              {products.map(p => (
                <ProductStockCard
                  key={p.id}
                  product={p}
                  onDelete={handleDelete}
                  onStockUpdate={handleStockUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div style={{
          display:'flex', flexDirection:'column', gap:16
        }}>
          {orders.length === 0 ? (
            <div style={{
              textAlign:'center', padding:'72px',
              background:'#fff', borderRadius:16,
              border:'1.5px dashed #e8e4dd'
            }}>
              <p style={{
                fontSize:'3rem', marginBottom:12
              }}>📦</p>
              <p style={{ color:'#6b6b6b' }}>
                No orders yet. Share your products
                to get sales!
              </p>
            </div>
          ) : orders.map(o => (
            <div key={o.id} style={{
              background:'#fff', borderRadius:16,
              border:'1.5px solid #e8e4dd',
              padding:'22px 26px', display:'flex',
              alignItems:'center', gap:20
            }}>
              <div style={{ flex:1 }}>
                <div style={{
                  display:'flex', alignItems:'center',
                  gap:10, marginBottom:4
                }}>
                  <p style={{
                    fontWeight:700, fontSize:'1rem'
                  }}>Order #{o.id}</p>
                  <span
                    className={STATUS_COLORS[o.status]}
                    style={{
                      fontSize:'0.72rem', fontWeight:700,
                      padding:'3px 10px', borderRadius:12
                    }}>{o.status}</span>
                </div>
                <p style={{
                  color:'#6b6b6b', fontSize:'0.83rem'
                }}>
                  👤 {o.buyer?.name} &nbsp;·&nbsp;
                  📍 {o.shippingAddress?.substring(0,40)}...
                </p>
                <p style={{
                  color:'#9e9e9e', fontSize:'0.78rem',
                  marginTop:4
                }}>
                  {o.items?.length} item
                  {o.items?.length !== 1 ? 's' : ''}
                </p>
              </div>

              <p style={{
                fontFamily:"'Playfair Display', serif",
                fontWeight:700, color:'#c9a84c',
                fontSize:'1.3rem', minWidth:110,
                textAlign:'right'
              }}>
                ₹{o.totalAmount?.toLocaleString('en-IN')}
              </p>

              <select
                value={o.status}
                onChange={e =>
                  handleStatus(o.id, e.target.value)}
                style={{
                  border:'1.5px solid #e8e4dd',
                  borderRadius:8, padding:'8px 12px',
                  fontSize:'0.85rem', fontWeight:600,
                  color:'#0f0f0f', background:'#fff',
                  cursor:'pointer', outline:'none'
                }}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}