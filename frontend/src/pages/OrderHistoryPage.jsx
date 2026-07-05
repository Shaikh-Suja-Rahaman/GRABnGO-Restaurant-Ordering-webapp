import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Receipt, Clock, PackageCheck, LogOut, Package } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PerforationMotif from '../components/PerforationMotif';
import Header from '../components/Header';

const apiUrl = import.meta.env.VITE_API_URL;

import { myOrdersRequest, myOrdersSuccess, myOrdersFail } from '../redux/slices/myOrdersSlice';
import { logout } from '../redux/slices/authSlice';

// ─── Status config (GrabNGo Claim Ticket Style) ────────
function getStatus(s) {
  const v = s.toLowerCase();
  if (v === 'delivered' || v === 'completed')
    return { color: 'var(--color-stamp)', border: 'var(--color-stamp)', label: 'READY / DELIVERED' };
  if (v === 'pending' || v === 'processing')
    return { color: 'var(--color-ink)', border: 'var(--color-ink)', label: 'PROCESSING...' };
  if (v === 'cancelled' || v === 'failed')
    return { color: 'var(--color-ink)', border: 'var(--color-card-border)', label: 'CANCELLED', opacity: 0.5 };
  if (v === 'shipped' || v === 'out for delivery')
    return { color: 'var(--color-ink)', border: 'var(--color-ink)', label: 'OUT FOR DELIVERY' };
  return { color: 'var(--color-ink)', border: 'var(--color-card-border)', label: s.toUpperCase() };
}

// ─── Timeline Order Ticket ─────────────────────────────
function OrderTicket({ order }) {
  const st = getStatus(order.status);
  const date = new Date(order.createdAt);

  return (
    <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
      {/* Timeline visual line */}
      <div style={{
        width: '2px',
        background: 'var(--color-card-border)',
        position: 'absolute',
        top: '24px',
        bottom: '-24px', // connects to next item
        left: '9px',
        zIndex: 0
      }} />

      {/* Timeline Dot */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'var(--color-card-surface)',
        border: `4px solid ${st.color}`,
        position: 'relative',
        zIndex: 1,
        marginTop: '24px'
      }} />

      {/* Ticket Card */}
      <div className="card" style={{ flex: 1, padding: '0', display: 'flex', flexDirection: 'column' }}>
        
        {/* Ticket Header */}
        <div style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-card-border)' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)' }}>
              #{order._id.slice(-6).toUpperCase()}
            </span>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="t-desc">
                {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="t-desc" style={{ opacity: 0.4 }}>•</span>
              <span className="t-desc">
                {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
          
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: st.color,
            border: `2px solid ${st.border}`,
            padding: '4px 10px',
            borderRadius: '4px',
            opacity: st.opacity || 1
          }}>
            {st.label}
          </span>
        </div>

        {/* Ticket Body (Items) */}
        <div style={{ padding: '20px' }}>
          <p className="t-section" style={{ fontSize: '12px', marginBottom: '12px', opacity: 0.6 }}>Items</p>
          {order.orderItems?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.orderItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.5, marginRight: '8px' }}>{item.quantity}x</span>
                    {item.name || 'Item'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-ink)' }}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="t-desc">No items data available.</p>
          )}
        </div>

        {/* Ticket Footer (Total) */}
        <div style={{ background: 'var(--color-card-border)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="t-section" style={{ fontSize: '14px' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)' }}>
            ₹{order.totalPrice.toFixed(0)}
          </span>
        </div>
        <PerforationMotif />
      </div>
    </div>
  );
}

// ─── Main OrderHistoryPage ──────────────────────────────
export default function OrderHistoryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, orders } = useSelector((s) => s.myOrders);
  const { userInfo } = useSelector((s) => s.auth);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const load = async () => {
      try {
        dispatch(myOrdersRequest());
        const { data } = await axios.get(`${apiUrl}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch(myOrdersSuccess(data));
      } catch (e) {
        dispatch(myOrdersFail(e.response?.data?.message || e.message));
      }
    };
    load();
  }, [dispatch, navigate, userInfo]);

  const sorted = [...(orders || [])].reverse();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* ── Sticky Page Header ── */}
      <Header />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p className="t-page-title">Orders</p>
          <p className="t-desc" style={{ marginTop: '4px' }}>
            {loading ? '' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-card-border)', marginTop: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div className="card" style={{ flex: 1, height: '200px', background: 'var(--color-card-surface)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-stamp)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>ERR: {error}</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{
            background: 'var(--color-card-surface)', margin: '40px auto', borderRadius: '8px',
            padding: '64px 24px', textAlign: 'center', border: '1px dashed var(--color-card-border)'
          }}>
            <Package size={40} style={{ color: 'var(--color-ink)', opacity: 0.15, marginBottom: '20px' }} />
            <p className="t-section" style={{ marginBottom: '8px' }}>
              NO TICKETS YET
            </p>
            <p className="t-desc" style={{ marginBottom: '32px' }}>
              Place your first order to get a claim ticket.
            </p>
            <button className="btn-cta" onClick={() => navigate('/')}>
              BROWSE MENU
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' /* Hide extra timeline line at bottom */ }}>
            {sorted.slice(0, visibleCount).map((order) => (
              <OrderTicket key={order._id} order={order} />
            ))}
            
            {visibleCount < sorted.length && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <button 
                  className="btn-outline" 
                  onClick={() => setVisibleCount(prev => prev + 10)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}