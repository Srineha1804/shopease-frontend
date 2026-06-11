import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCart, removeCartItem, updateCartItem } from '../api/cartApi'
import toast from 'react-hot-toast'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCart = () => {
    getCart().then(res => setCart(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const handleRemove = async (itemId) => {
    await removeCartItem(itemId)
    toast.success('Removed from cart')
    fetchCart()
  }

  const handleUpdate = async (itemId, qty) => {
    if (qty < 1) return
    await updateCartItem(itemId, qty)
    fetchCart()
  }

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #e8e4dd', borderTopColor: '#c9a84c',
        animation: 'spin 0.8s linear infinite'
      }}/>
    </div>
  )

  if (cart.length === 0) return (
    <div className="page-enter" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '70vh', gap: 16
    }}>
      <div style={{
        width: 80, height: 80, background: '#f0ece5',
        borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '2.5rem'
      }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#0f0f0f' }}>
        Your cart is empty
      </h2>
      <p style={{ color: '#6b6b6b', marginBottom: 16 }}>Discover something you'll love</p>
      <Link to="/products" className="btn-gold" style={{
        padding: '12px 32px', borderRadius: 10,
        textDecoration: 'none', fontSize: '0.95rem'
      }}>Browse Products</Link>
    </div>
  )

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px' }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ color: '#c9a84c', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>SHOPPING</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f' }}>
          Your Cart <span style={{ color: '#9e9e9e', fontSize: '1.2rem', fontWeight: 400 }}>({cart.length} items)</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

        {/* Cart items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cart.map(item => (
            <div key={item.id} style={{
              background: '#fff', borderRadius: 16,
              border: '1.5px solid #e8e4dd',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              transition: 'box-shadow 0.2s'
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: 12,
                overflow: 'hidden', background: '#f5f3ef',
                flexShrink: 0
              }}>
                <img
                  src={item.product.imageUrl || `https://picsum.photos/seed/${item.product.id}/200`}
                  alt={item.product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: '#0f0f0f', marginBottom: 4 }}>
                  {item.product.name}
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700, fontSize: '1.1rem', color: '#c9a84c'
                }}>₹{item.product.price?.toLocaleString('en-IN')}</p>
              </div>

              {/* Qty controls */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#f5f3ef', borderRadius: 10, padding: '6px 12px'
              }}>
                <button
                  onClick={() => handleUpdate(item.id, item.quantity - 1)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: 'none', background: '#e8e4dd',
                    cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>−</button>
                <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                <button
                  onClick={() => handleUpdate(item.id, item.quantity + 1)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: 'none', background: '#0f0f0f',
                    color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>+</button>
              </div>

              <p style={{
                fontWeight: 700, fontSize: '1.05rem',
                color: '#0f0f0f', minWidth: 90, textAlign: 'right'
              }}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>

              <button onClick={() => handleRemove(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#d4cfc7', fontSize: '1.2rem', padding: 4,
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color='#d94f4f'}
              onMouseLeave={e => e.target.style.color='#d4cfc7'}
              >✕</button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div style={{
          background: '#0f0f0f', borderRadius: 20,
          padding: '32px 28px', position: 'sticky', top: 90
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#faf8f4', fontSize: '1.4rem', marginBottom: 28
          }}>Order Summary</h3>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 10
              }}>
                <span style={{ color: '#9e9e9e', fontSize: '0.85rem' }}>
                  {item.product.name} × {item.quantity}
                </span>
                <span style={{ color: '#faf8f4', fontSize: '0.85rem', fontWeight: 500 }}>
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
            <span style={{ color: '#faf8f4', fontWeight: 600 }}>Total</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              color: '#c9a84c', fontSize: '1.5rem', fontWeight: 700
            }}>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <Link to="/checkout" style={{
            display: 'block', textAlign: 'center',
            background: '#c9a84c', color: '#fff',
            padding: '14px', borderRadius: 10,
            textDecoration: 'none', fontWeight: 600,
            fontSize: '0.95rem', letterSpacing: '0.02em',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.target.style.background='#b8973f'}
          onMouseLeave={e => e.target.style.background='#c9a84c'}
          >Proceed to Checkout →</Link>

          <Link to="/products" style={{
            display: 'block', textAlign: 'center',
            marginTop: 12, color: '#6b6b6b',
            fontSize: '0.85rem', textDecoration: 'none'
          }}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}