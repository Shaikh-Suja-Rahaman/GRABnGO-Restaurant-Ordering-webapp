import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, Trash2, Loader2, ShoppingBag, ShieldCheck, LogOut } from 'lucide-react';
import Header from '../components/Header';

const apiUrl = import.meta.env.VITE_API_URL;
import { logout } from '../redux/slices/authSlice';

import { addToCart, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { orderCreateRequest, orderCreateSuccess, orderCreateFail, orderReset } from '../redux/slices/orderSlice';
import { setActiveTab } from '../redux/slices/navigationSlice';

// ─── Cart row (wide list style) ────────────────────────
function CartRow({ item, onUpdateQty, onRemove }) {
  const [imgErr, setImgErr] = React.useState(false);

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      padding: '12px',
      gap: '16px',
      height: '104px',
      marginBottom: '16px',
    }}>
      {/* Thumbnail */}
      <div style={{
        width: '80px', height: '80px',
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--color-card-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {item.imageUrl && !imgErr ? (
          <img src={item.imageUrl} alt={item.name} onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '28px', color: 'var(--color-ink)', opacity: 0.5, fontFamily: 'serif' }}>
            {item.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
        <p className="t-name" style={{ marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </p>
        <p className="t-price" style={{ fontSize: '15px' }}>₹{(item.price * item.quantity).toFixed(0)}</p>
        {item.quantity > 1 && (
          <p className="t-desc" style={{ marginTop: '2px', fontSize: '12px' }}>
            ₹{item.price.toFixed(0)} × {item.quantity}
          </p>
        )}
      </div>

      {/* Qty stepper */}
      <div className="qty-stepper" style={{ flexShrink: 0 }}>
        <button
          className="qty-btn"
          id={`cart-dec-${item._id}`}
          onClick={() => onUpdateQty(item._id, item.quantity - 1)}
        >
          {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
        </button>
        <span className="qty-count">{item.quantity}</span>
        <button
          className="qty-btn"
          id={`cart-inc-${item._id}`}
          onClick={() => onUpdateQty(item._id, item.quantity + 1)}
          disabled={item.quantity >= 10}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main CartPage ──────────────────────────────────────
export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((s) => s.cart);
  const { userInfo }  = useSelector((s) => s.auth);
  const { loading, error, success } = useSelector((s) => s.order);

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const totalStr = subtotal.toFixed(2);

  useEffect(() => {
    if (success) { navigate('/'); dispatch(clearCart()); dispatch(orderReset()); }
  }, [success, navigate, dispatch]);

  const updateQty = (itemId, qty) => {
    const item = cartItems.find((i) => i._id === itemId);
    if (!item) return;
    if (qty < 1) { dispatch(removeFromCart(itemId)); return; }
    if (qty > 10) return;
    dispatch(addToCart({ ...item, quantity: qty }));
  };

  const placeOrder = async () => {
    if (!userInfo) { navigate('/login'); return; }
    dispatch(orderCreateRequest());
    try {
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`${apiUrl}/api/payments/create-order`, { totalPrice: Number(totalStr) }, cfg);
      const { razorpayOrder } = data;
      const options = {
        key: 'rzp_test_RqJeFkIbBlROTt',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Kiosks',
        description: 'Payment',
        order_id: razorpayOrder.id,
        handler: async (resp) => {
          try {
            const v = await axios.post(`${apiUrl}/api/payments/verify`, {
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
              orderItems: cartItems.map(({ _id, quantity, price }) => ({ menuItem: _id, quantity, price })),
              totalPrice: Number(totalStr),
            }, cfg);
            dispatch(orderCreateSuccess(v.data));
            dispatch(clearCart());
            navigate('/');
          } catch (e) {
            alert('Payment verification failed');
            dispatch(orderCreateFail(e.response?.data?.message || e.message));
          }
        },
        theme: { color: '#8B4049' },
        modal: { ondismiss: () => dispatch(orderCreateFail('Payment cancelled')) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => dispatch(orderCreateFail('Payment failed')));
      rzp.open();
    } catch (e) {
      dispatch(orderCreateFail(e.response?.data?.message || e.message));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const totalItems = cartItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--color-background)' }}>

      {/* ── Sticky Page Header ── */}
      <Header />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p className="t-page-title">Your Cart</p>
          <p className="t-desc" style={{ marginTop: '4px' }}>
            {cartItems.length === 0 ? 'Nothing here yet' : `${totalItems} item${totalItems > 1 ? 's' : ''}`}
          </p>
        </div>
        {cartItems.length === 0 ? (
          /* Empty */
          <div style={{
            background: 'var(--color-card-surface)',
            border: '1px solid rgba(36, 31, 26, 0.08)',
            borderRadius: '16px',
            padding: '64px 24px',
            textAlign: 'center',
            maxWidth: '480px', margin: '40px auto',
          }}>
            <ShoppingBag size={48} style={{ color: 'var(--color-ink)', opacity: 0.15, marginBottom: '20px' }} />
            <p className="t-name" style={{ marginBottom: '8px' }}>
              Your cart is empty
            </p>
            <p className="t-desc" style={{ marginBottom: '32px' }}>
              Add items from the menu to get started.
            </p>
            <button
              id="browse-menu-btn"
              className="btn-cta"
              onClick={() => dispatch(setActiveTab('menu'))}
              style={{ width: '100%' }}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: '32px',
            alignItems: 'start',
          }}>
            {/* Item list column */}
            <div style={{ paddingTop: '0' }}>
              {cartItems.map((item) => (
                <CartRow
                  key={item._id}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={(id) => dispatch(removeFromCart(id))}
                />
              ))}
            </div>

            {/* Order summary sidebar */}
            <div className="card" style={{
              padding: '24px',
              position: 'sticky',
              top: '110px',
            }}>
              <p className="t-section" style={{ marginBottom: '24px' }}>Order Summary</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="t-desc">Items ({totalItems})</span>
                <span className="t-price" style={{ fontSize: '14px' }}>₹{totalStr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="t-desc">Delivery</span>
                <span className="t-price" style={{ fontSize: '14px', color: '#166534' }}>Free</span>
              </div>

              <div style={{ borderTop: '1px dashed rgba(36, 31, 26, 0.15)', margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                <span className="t-name" style={{ fontSize: '18px' }}>Total</span>
                <span className="t-price" style={{ fontSize: '20px' }}>₹{totalStr}</span>
              </div>

              {error && (
                <p style={{ color: '#991b1b', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>
              )}

              <button
                id="place-order-btn"
                className="btn-cta"
                onClick={placeOrder}
                disabled={loading}
                style={{ width: '100%', padding: '16px', fontSize: '15px', borderRadius: '12px' }}
              >
                {loading
                  ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
                  : <><ShoppingBag size={16} /> Place Order</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                <ShieldCheck size={14} style={{ color: 'var(--color-ink)', opacity: 0.6 }} />
                <span className="t-desc" style={{ fontSize: '12px' }}>Secured by Razorpay</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          /* Stack columns on mobile */
          div[style*="grid-template-columns: minmax(0, 1fr) 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}