import { useEffect, useState } from 'react'
import { getMyOrders, cancelOrder } from '../api/orderApi'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  PENDING:    { pill: 'pill-pending',    icon: '⏳', label: 'Pending' },
  PROCESSING: { pill: 'pill-processing', icon: '⚙️', label: 'Processing' },
  SHIPPED:    { pill: 'pill-shipped',    icon: '🚚', label: 'Shipped' },
  DELIVERED:  { pill: 'pill-delivered',  icon: '✅', label: 'Delivered' },
  CANCELLED:  { pill: 'pill-cancelled',  icon: '✕',  label: 'Cancelled' },
}

const STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

function ProgressBar({ status }) {
  const cur = STEPS.indexOf(status)
  if (status === 'CANCELLED') return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginTop: 16, padding: '8px 14px',
      background: '#fdeaea', borderRadius: 8, width: 'fit-content'
    }}>
      <span style={{ color: '#b03a3a', fontSize: '0.8rem', fontWeight: 600 }}>✕ Order Cancelled</span>
    </div>
  )
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEPS.map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i <= cur ? '#c9a84c' : '#e8e4dd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700,
              color: i <= cur ? '#fff' : '#9e9e9e',
              flexShrink: 0, transition: 'all 0.3s',
              boxShadow: i === cur ? '0 0 0 4px rgba(201,168,76,0.2)' : 'none'
            }}>
              {i < cur ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 3, margin: '0 4px',
                background: i < cur ? '#c9a84c' : '#e8e4dd',
                transition: 'background 0.3s'
              }}/>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {STEPS.map((step, i) => (
          <span key={step} style={{
            fontSize: '0.68rem', fontWeight: 600,
            color: i <= cur ? '#c9a84c' : '#9e9e9e',
            textTransform: 'uppercase', letterSpacing: '0.04em',
            width: 70, textAlign: i === 0 ? 'left' : i === STEPS.length - 1 ? 'right' : 'center'
          }}>{step}</span>
        ))}
      </div>
    </div>
  )
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCancelled, setShowCancelled] = useState(false)

  const fetchOrders = () => {
    getMyOrders()
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => {
    const id = setInterval(fetchOrders, 30000)
    return () => clearInterval(id)
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      await cancelOrder(id)
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o))
      toast.success('Order cancelled')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot cancel')
    }
  }

  const visible = showCancelled ? orders : orders.filter(o => o.status !== 'CANCELLED')
  const cancelledCount = orders.filter(o => o.status === 'CANCELLED').length

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #e8e4dd', borderTopColor: '#c9a84c',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div className="page-enter" style={{ maxWidth: 860, margin: '0 auto', padding: '48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <div>
          <p style={{ color: '#c9a84c', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
            MY ACCOUNT
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f' }}>
            Order History
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {cancelledCount > 0 && (
            <button onClick={() => setShowCancelled(!showCancelled)} style={{
              fontSize: '0.85rem', fontWeight: 500,
              color: '#6b6b6b', background: '#fff',
              border: '1.5px solid #e8e4dd', borderRadius: 8,
              padding: '7px 14px', cursor: 'pointer'
            }}>
              {showCancelled ? 'Hide' : 'Show'} Cancelled ({cancelledCount})
            </button>
          )}
          <button onClick={fetchOrders} style={{
            fontSize: '0.85rem', fontWeight: 500,
            color: '#6b6b6b', background: '#fff',
            border: '1.5px solid #e8e4dd', borderRadius: 8,
            padding: '7px 14px', cursor: 'pointer'
          }}>↻ Refresh</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px',
          background: '#fff', borderRadius: 20,
          border: '1.5px dashed #e8e4dd'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>📦</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: '#6b6b6b', marginBottom: 24 }}>Start shopping to see your orders here</p>
          <a href="/products" style={{
            display: 'inline-block', background: '#0f0f0f',
            color: '#faf8f4', padding: '12px 28px',
            borderRadius: 10, textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem'
          }}>Browse Products</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {visible.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
            return (
              <div key={order.id} style={{
                background: '#fff', borderRadius: 20,
                border: '1.5px solid #e8e4dd',
                padding: '28px 32px',
                transition: 'box-shadow 0.2s'
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#0f0f0f' }}>
                        Order #{order.id}
                      </h3>
                      <span className={cfg.pill} style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        padding: '4px 12px', borderRadius: 20,
                        letterSpacing: '0.04em'
                      }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <p style={{ color: '#9e9e9e', fontSize: '0.82rem' }}>
                      📍 {order.shippingAddress}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.6rem', fontWeight: 700, color: '#c9a84c'
                    }}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    {order.status === 'PENDING' && (
                      <button onClick={() => handleCancel(order.id)} style={{
                        marginTop: 8, fontSize: '0.8rem', fontWeight: 600,
                        color: '#d94f4f', background: '#fdeaea',
                        border: '1px solid #f3a8a8', borderRadius: 6,
                        padding: '4px 12px', cursor: 'pointer'
                      }}>Cancel Order</button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div style={{
                  background: '#faf8f4', borderRadius: 12,
                  padding: '16px', marginBottom: 20
                }}>
                  {order.items?.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '8px 0',
                      borderBottom: '1px solid #e8e4dd'
                    }} className="last:border-0">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 8,
                          overflow: 'hidden', background: '#e8e4dd'
                        }}>
                          <img
                            src={item.product?.imageUrl || `https://picsum.photos/seed/${item.product?.id}/100`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f0f0f' }}>
                            {item.product?.name}
                          </p>
                          <p style={{ color: '#9e9e9e', fontSize: '0.78rem' }}>
                            Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <p style={{ fontWeight: 700, color: '#0f0f0f', fontSize: '0.9rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <ProgressBar status={order.status} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}