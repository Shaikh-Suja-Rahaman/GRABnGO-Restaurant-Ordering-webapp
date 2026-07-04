import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Loader2, Heart, LogOut } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

import {
  favoritesRequest, favoritesSuccess, favoritesFail,
  favoriteRemoveRequest, favoriteRemoveSuccess, favoriteRemoveFail,
} from '../redux/slices/favoritesSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';

// ─── Box Card Component (matching Menu) ────────────────
function FavBox({ item, onAddToCart, onRemove, removing }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      padding: '12px',
      gap: '16px',
      height: '144px',
    }}>
      
      {/* ── Fixed Trash Button ── */}
      <button
        id={`fav-remove-${item._id}`}
        onClick={() => onRemove(item._id)}
        disabled={removing}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'var(--color-card-surface)',
          border: '1px solid rgba(36, 31, 26, 0.08)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          opacity: removing ? 0.4 : 1,
          transition: 'transform 150ms',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Trash2 size={15} style={{ color: 'var(--color-ink)', opacity: 0.7 }} />
      </button>

      {/* ── Image ── */}
      <div style={{
        width: '120px',
        minWidth: '120px',
        height: '120px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--color-card-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {item.imageUrl && !imgErr ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: '28px', color: 'var(--color-ink)', opacity: 0.5, fontFamily: 'serif' }}>
            {item.name.charAt(0)}
          </span>
        )}
      </div>

      {/* ── Info & Actions (Right) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, justifyContent: 'center', height: '100%' }}>
        
        {/* Row 1: Name & Desc */}
        <div style={{ paddingRight: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="t-name" style={{ 
            marginBottom: '4px', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}>
            {item.name}
          </p>
          {item.description && (
            <p className="t-desc" style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {item.description}
            </p>
          )}
        </div>

        {/* Row 2: Price & Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p className="t-price" style={{ fontSize: '18px' }}>₹{item.price.toFixed(0)}</p>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-add" 
              id={`fav-add-${item._id}`} 
              onClick={() => onAddToCart(item)} 
              aria-label={`Add ${item.name} to cart`}
            >
              ADD <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main FavoritesPage ────────────────────────────────
export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((s) => s.auth);
  const { favorites, loading, error, loadingRemove } = useSelector((s) => s.favorites);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    if (favorites.length > 0) return;
    const load = async () => {
      try {
        dispatch(favoritesRequest());
        const { data } = await axios.get(`${apiUrl}/api/favorites`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch(favoritesSuccess(data));
      } catch (e) { dispatch(favoritesFail(e.response?.data?.message || e.message)); }
    };
    load();
  }, [dispatch, navigate, userInfo, favorites.length]);

  const handleRemove = async (itemId) => {
    dispatch(favoriteRemoveRequest());
    try {
      await axios.delete(`${apiUrl}/api/favorites/${itemId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch(favoriteRemoveSuccess(itemId));
    } catch (e) { dispatch(favoriteRemoveFail(e.response?.data?.message || e.message)); }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* ── Sticky Page Header ── */}
      <div style={{
        background: 'var(--color-background)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          position: 'absolute', bottom: '-20px', left: 0, right: 0, height: '20px',
          background: 'linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}/>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p className="t-page-title">Saved</p>
            <p className="t-desc" style={{ marginTop: '4px', letterSpacing: '0.2px' }}>
              {loading ? '' : `${favorites.length} item${favorites.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          {userInfo && (
            <button 
              onClick={handleLogout}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', opacity: 0.7, padding: '8px' }}
              aria-label="Logout"
            >
              <LogOut size={24} />
            </button>
          )}
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: '12px' }}>
            <Loader2 size={22} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
            <span className="t-desc">Loading…</span>
          </div>
        ) : error ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <p style={{ color: '#991b1b', fontSize: '14px' }}>{error}</p>
          </div>
        ) : favorites.length === 0 ? (
          <div style={{
            background: 'var(--color-card-surface)', borderRadius: '16px',
            border: '1px solid rgba(36, 31, 26, 0.08)',
            padding: '64px 24px', textAlign: 'center',
            maxWidth: '480px', margin: '40px auto',
          }}>
            <Heart size={40} style={{ color: 'var(--color-ink)', opacity: 0.15, marginBottom: '20px' }} />
            <p className="t-name" style={{ marginBottom: '8px' }}>
              Nothing saved yet
            </p>
            <p className="t-desc" style={{ marginBottom: '32px' }}>
              Tap the ♥ icon on any menu item to save it here.
            </p>
            <button className="btn-cta" style={{ width: '100%' }} onClick={() => navigate('/')}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {favorites.map((item) => (
              <FavBox
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={handleRemove}
                removing={loadingRemove}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}