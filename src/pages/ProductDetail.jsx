import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../api/productApi'
import { addToCart } from '../api/cartApi'
import { getReviews, addReview, getAverageRating } from '../api/reviewApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ── Star Rating component ──────────────────────────────────
const StarRating = ({ value, onChange, size = 24 }) => {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            background: 'none', border: 'none',
            cursor: onChange ? 'pointer' : 'default',
            fontSize: size, lineHeight: 1, padding: 0,
            color: star <= (hover || value) ? '#f0c040' : '#ddd',
            transition: 'color 0.15s, transform 0.1s',
            transform: hover === star ? 'scale(1.2)' : 'scale(1)'
          }}
        >★</button>
      ))}
    </div>
  )
}

// ── Static stars (no interaction) ─────────────────────────
const Stars = ({ value, size = 16 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{
        fontSize: size,
        color: s <= Math.round(value) ? '#f0c040' : '#ddd'
      }}>★</span>
    ))}
  </div>
)

// ── Loading spinner ────────────────────────────────────────
const Spinner = ({ color = '#c9a84c' }) => (
  <>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid #e8e4dd',
      borderTopColor: color,
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </>
)

// ══════════════════════════════════════════════════════════
export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()

  const [product,     setProduct]     = useState(null)
  const [quantity,    setQuantity]    = useState(1)
  const [reviews,     setReviews]     = useState([])
  const [avgRating,   setAvgRating]   = useState(0)
  const [rating,      setRating]      = useState(5)
  const [comment,     setComment]     = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [addingToCart,setAddingToCart]= useState(false)
  const [imgLoaded,   setImgLoaded]   = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Product not found'))
    getReviews(id)
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
    getAverageRating(id)
      .then(res => setAvgRating(res.data.average || 0))
      .catch(() => {})
  }, [id])

  const handleAddToCart = async () => {
    if (!token) { navigate('/login'); return }
    if (product.stock === 0) return
    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!token) { navigate('/login'); return }
    setSubmitting(true)
    try {
      const res = await addReview(id, { rating, comment })
      setReviews([res.data, ...reviews])
      setComment('')
      setRating(5)
      getAverageRating(id).then(r => setAvgRating(r.data.average || 0))
      toast.success('Review submitted!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading state ────────────────────────────────────────
  if (!product) return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '70vh'
    }}>
      <Spinner />
    </div>
  )

  const isOutOfStock = product.stock === 0
  const isLowStock   = product.stock > 0 && product.stock < 5

  // ── Stock badge ──────────────────────────────────────────
  const StockBadge = () => {
    if (isOutOfStock) return (
      <span style={{
        background: '#fdeaea', color: '#d94f4f',
        border: '1px solid #f3a8a8',
        fontSize: '0.78rem', fontWeight: 700,
        padding: '5px 14px', borderRadius: 20,
        letterSpacing: '0.04em'
      }}>✕ Out of Stock</span>
    )
    if (isLowStock) return (
      <span style={{
        background: '#fff8e6', color: '#b7820a',
        border: '1px solid #f5d97a',
        fontSize: '0.78rem', fontWeight: 700,
        padding: '5px 14px', borderRadius: 20,
        letterSpacing: '0.04em'
      }}>⚠ Only {product.stock} left</span>
    )
    return (
      <span style={{
        background: '#e6f9f1', color: '#1a7a4e',
        border: '1px solid #7dd4ac',
        fontSize: '0.78rem', fontWeight: 700,
        padding: '5px 14px', borderRadius: 20,
        letterSpacing: '0.04em'
      }}>✓ In Stock — {product.stock} available</span>
    )
  }

  // ════════════════════════════════════════════════════════
  return (
    <div className="page-enter" style={{ background: '#faf8f4', minHeight: '100vh' }}>

      {/* ── Breadcrumb ──────────────────────────────────── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '24px 48px 0'
      }}>
        <p style={{ fontSize: '0.82rem', color: '#9e9e9e' }}>
          <span
            onClick={() => navigate('/products')}
            style={{ cursor: 'pointer', color: '#c9a84c', fontWeight: 600 }}
          >Products</span>
          <span style={{ margin: '0 8px' }}>›</span>
          {product.category?.name && (
            <>
              <span style={{ color: '#9e9e9e' }}>{product.category.name}</span>
              <span style={{ margin: '0 8px' }}>›</span>
            </>
          )}
          <span style={{ color: '#0f0f0f', fontWeight: 600 }}>{product.name}</span>
        </p>
      </div>

      {/* ── Product section ─────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          background: '#fff',
          borderRadius: 24,
          border: '1.5px solid #e8e4dd',
          padding: 40,
          marginBottom: 32
        }}>

          {/* LEFT — Image ───────────────────────────────── */}
          <div style={{ position: 'relative' }}>
            {/* Image container */}
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              background: '#f5f3ef',
              aspectRatio: '1 / 1',
              position: 'relative'
            }}>
              {!imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Spinner />
                </div>
              )}
              <img
                src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600`}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: isOutOfStock ? 0.45 : 1,
                  transition: 'transform 0.5s ease',
                  display: imgLoaded ? 'block' : 'none'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
              {/* Out of stock overlay */}
              {isOutOfStock && imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.12)'
                }}>
                  <div style={{
                    background: '#d94f4f', color: '#fff',
                    fontWeight: 800, fontSize: '0.9rem',
                    padding: '10px 24px', borderRadius: 30,
                    letterSpacing: '0.08em'
                  }}>OUT OF STOCK</div>
                </div>
              )}
            </div>

            {/* Low stock warning under image */}
            {isLowStock && (
              <div style={{
                marginTop: 14, background: '#fff8e6',
                border: '1px solid #f5d97a',
                borderRadius: 10, padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <p style={{ color: '#b7820a', fontSize: '0.82rem', fontWeight: 600 }}>
                  Hurry! Only {product.stock} units remaining. Order before it's gone.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — Details ────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Category + Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              {product.category && (
                <span style={{
                  background: '#f0ece5', color: '#6b6b6b',
                  fontSize: '0.75rem', fontWeight: 700,
                  padding: '4px 12px', borderRadius: 20,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>{product.category.name}</span>
              )}
              <StockBadge />
            </div>

            {/* Product name */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: 700,
              color: '#0f0f0f', lineHeight: 1.25,
              marginBottom: 12
            }}>{product.name}</h1>

            {/* Rating row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 16,
              background: '#faf8f4', borderRadius: 10,
              padding: '8px 14px', width: 'fit-content'
            }}>
              <Stars value={avgRating} size={16} />
              <span style={{ fontWeight: 700, color: '#0f0f0f', fontSize: '0.9rem' }}>
                {avgRating.toFixed(1)}
              </span>
              <span style={{ color: '#9e9e9e', fontSize: '0.82rem' }}>
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Description */}
            <p style={{
              color: '#6b6b6b', fontSize: '0.92rem',
              lineHeight: 1.75, marginBottom: 24
            }}>{product.description || 'No description provided.'}</p>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.8rem', fontWeight: 700,
                color: '#c9a84c', lineHeight: 1
              }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </p>
              <p style={{ color: '#9e9e9e', fontSize: '0.78rem', marginTop: 4 }}>
                Inclusive of all taxes
              </p>
            </div>

            {/* Qty + Cart — only if in stock */}
            {!isOutOfStock ? (
              <div>
                {/* Qty selector */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 16, marginBottom: 20
                }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f0f0f' }}>
                    Quantity
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: '#f5f3ef', borderRadius: 12,
                    overflow: 'hidden', border: '1.5px solid #e8e4dd'
                  }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: 40, height: 40, border: 'none',
                        background: 'transparent', cursor: 'pointer',
                        fontWeight: 700, fontSize: '1.1rem',
                        color: quantity === 1 ? '#ccc' : '#0f0f0f',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.target.style.background = '#e8e4dd'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >−</button>
                    <span style={{
                      minWidth: 44, textAlign: 'center',
                      fontWeight: 700, fontSize: '1rem', color: '#0f0f0f'
                    }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={{
                        width: 40, height: 40, border: 'none',
                        background: 'transparent', cursor: 'pointer',
                        fontWeight: 700, fontSize: '1.1rem',
                        color: quantity === product.stock ? '#ccc' : '#0f0f0f',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.target.style.background = '#e8e4dd'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >+</button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#9e9e9e' }}>
                    Max {product.stock}
                  </p>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  style={{
                    width: '100%', padding: '15px 0',
                    borderRadius: 12, border: 'none',
                    background: addingToCart ? '#b8973f' : '#c9a84c',
                    color: '#fff', fontWeight: 700,
                    fontSize: '1rem', letterSpacing: '0.03em',
                    cursor: addingToCart ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                    transform: addingToCart ? 'scale(0.98)' : 'scale(1)'
                  }}
                  onMouseEnter={e => { if (!addingToCart) e.target.style.background = '#b8973f' }}
                  onMouseLeave={e => { if (!addingToCart) e.target.style.background = '#c9a84c' }}
                >
                  {addingToCart ? 'Adding to Cart...' : `🛒  Add to Cart — ₹${(product.price * quantity).toLocaleString('en-IN')}`}
                </button>

                {/* Continue shopping */}
                <button
                  onClick={() => navigate('/products')}
                  style={{
                    width: '100%', marginTop: 10,
                    padding: '12px 0', borderRadius: 12,
                    border: '1.5px solid #e8e4dd',
                    background: 'transparent', color: '#6b6b6b',
                    fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.target.style.background = '#f5f3ef'; e.target.style.color = '#0f0f0f' }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#6b6b6b' }}
                >← Continue Shopping</button>
              </div>
            ) : (
              /* Out of stock CTA */
              <div>
                <button disabled style={{
                  width: '100%', padding: '15px 0',
                  borderRadius: 12, border: 'none',
                  background: '#e8e4dd', color: '#9e9e9e',
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'not-allowed'
                }}>Currently Unavailable</button>
                <button
                  onClick={() => navigate('/products')}
                  style={{
                    width: '100%', marginTop: 10,
                    padding: '12px 0', borderRadius: 12,
                    border: '1.5px solid #e8e4dd',
                    background: 'transparent', color: '#6b6b6b',
                    fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >← Browse Other Products</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews section ──────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid #e8e4dd', padding: 40
        }}>

          {/* Reviews header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 32
          }}>
            <div>
              <p style={{
                color: '#c9a84c', fontSize: '0.78rem',
                fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6
              }}>CUSTOMER FEEDBACK</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem', fontWeight: 700, color: '#0f0f0f'
              }}>Reviews</h2>
            </div>

            {/* Average rating display */}
            {reviews.length > 0 && (
              <div style={{
                textAlign: 'center', background: '#0f0f0f',
                borderRadius: 16, padding: '16px 28px'
              }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2.8rem', fontWeight: 700,
                  color: '#c9a84c', lineHeight: 1
                }}>{avgRating.toFixed(1)}</p>
                <Stars value={avgRating} size={14} />
                <p style={{ color: '#6b6b6b', fontSize: '0.75rem', marginTop: 4 }}>
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* ── Write review form (buyers only) ───────── */}
          {token && user?.role === 'ROLE_BUYER' && (
            <div style={{
              background: '#faf8f4', borderRadius: 16,
              border: '1.5px solid #e8e4dd',
              padding: '28px 32px', marginBottom: 36
            }}>
              <p style={{
                color: '#c9a84c', fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6
              }}>SHARE YOUR EXPERIENCE</p>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem', fontWeight: 700,
                color: '#0f0f0f', marginBottom: 20
              }}>Write a Review</h3>

              <form onSubmit={handleReview}>
                <div style={{ marginBottom: 18 }}>
                  <p style={{
                    fontSize: '0.82rem', fontWeight: 600,
                    color: '#6b6b6b', marginBottom: 8,
                    textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>Your Rating</p>
                  <StarRating value={rating} onChange={setRating} size={32} />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <p style={{
                    fontSize: '0.82rem', fontWeight: 600,
                    color: '#6b6b6b', marginBottom: 8,
                    textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>Your Review</p>
                  <textarea
                    className="input-classy"
                    style={{ height: 100, resize: 'none' }}
                    placeholder="What did you think about this product? Be honest and helpful..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '11px 28px', borderRadius: 10,
                    border: 'none', background: submitting ? '#b8973f' : '#0f0f0f',
                    color: '#faf8f4', fontWeight: 700,
                    fontSize: '0.88rem', cursor: submitting ? 'wait' : 'pointer',
                    transition: 'all 0.2s', letterSpacing: '0.03em'
                  }}
                  onMouseEnter={e => { if (!submitting) e.target.style.background = '#2a2a2a' }}
                  onMouseLeave={e => { if (!submitting) e.target.style.background = '#0f0f0f' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Not logged in nudge */}
          {!token && (
            <div style={{
              background: '#faf8f4', borderRadius: 14,
              border: '1.5px dashed #e8e4dd',
              padding: '20px', textAlign: 'center',
              marginBottom: 28
            }}>
              <p style={{ color: '#6b6b6b', fontSize: '0.9rem' }}>
                <span
                  onClick={() => navigate('/login')}
                  style={{
                    color: '#c9a84c', fontWeight: 700,
                    cursor: 'pointer', borderBottom: '1.5px solid #c9a84c'
                  }}
                >Login</span>
                {' '}to share your experience with this product
              </p>
            </div>
          )}

          {/* ── Reviews list ─────────────────────────── */}
          {reviews.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '56px 0'
            }}>
              <p style={{ fontSize: '3rem', marginBottom: 12 }}>💬</p>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.4rem', color: '#0f0f0f', marginBottom: 8
              }}>No reviews yet</h3>
              <p style={{ color: '#9e9e9e' }}>
                Be the first to review this product!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  style={{
                    padding: '24px 0',
                    borderBottom: i < reviews.length - 1 ? '1px solid #f0ece5' : 'none',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 10
                  }}>
                    {/* Reviewer info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: '#0f0f0f', color: '#c9a84c',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700,
                        fontSize: 15, flexShrink: 0
                      }}>
                        {review.buyer?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{
                          fontWeight: 700, fontSize: '0.9rem',
                          color: '#0f0f0f', marginBottom: 3
                        }}>{review.buyer?.name}</p>
                        <Stars value={review.rating} size={13} />
                      </div>
                    </div>

                    {/* Date */}
                    <p style={{ color: '#9e9e9e', fontSize: '0.78rem' }}>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : ''}
                    </p>
                  </div>

                  {/* Comment */}
                  <p style={{
                    color: '#4a4a4a', fontSize: '0.9rem',
                    lineHeight: 1.7, marginLeft: 52
                  }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}