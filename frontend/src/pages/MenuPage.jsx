import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Search, X, Github, LogOut } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

import { menuRequest, menuSuccess, menuFail } from '../redux/slices/menuSlice';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';
import { orderReset } from '../redux/slices/orderSlice';
import {
  favoritesRequest, favoritesSuccess, favoritesFail,
  favoriteAddRequest, favoriteAddSuccess, favoriteAddFail,
  favoriteRemoveRequest, favoriteRemoveSuccess, favoriteRemoveFail,
} from '../redux/slices/favoritesSlice';

// ─── Category list ─────────────────────────────────────
const CATEGORIES = ['All', 'Burgers', 'Meals', 'Pizzas', 'Biryanis', 'Sandwich', 'Hot Beverages', 'Cold Beverages'];

// ─── FoodTicket Component ──────────────────────────
function FoodTicket({ item, cartQty, isFav, onAdd, onInc, onDec, onFav, favLoading, showFav, onImageClick }) {
  const [imgErr, setImgErr] = useState(false);
  const inCart = cartQty > 0;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center', // vertically center contents
      position: 'relative',
      padding: '12px',      // inner padding so it doesn't bleed to edge
      gap: '16px',          // gap between image and info
      height: '144px',
    }}>
      
      {/* ── Fixed Heart Button (Stamp Color) ── */}
      {showFav && (
        <button
          id={`fav-${item._id}`}
          onClick={() => onFav(item)}
          disabled={favLoading}
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
            opacity: favLoading ? 0.4 : 1,
            boxShadow: '0 2px 4px rgba(36, 31, 26, 0.05)'
          }}
        >
          <Heart
            size={16}
            style={{ 
              color: isFav ? 'var(--color-stamp)' : 'var(--color-ink)', 
              fill: isFav ? 'var(--color-stamp)' : 'none', 
              opacity: isFav ? 1 : 0.4,
              transition: 'fill 150ms ease, color 150ms ease, opacity 150ms ease' 
            }}
          />
        </button>
      )}

      {/* ── Image (Left) ── */}
      <div 
        onClick={() => onImageClick(item)}
        style={{
          width: '120px',
          minWidth: '120px',
          height: '120px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'var(--color-card-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {item.imageUrl && !imgErr ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: '24px', color: 'var(--color-ink)', opacity: 0.3, fontFamily: 'var(--font-display)' }}>
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
            WebkitLineClamp: 1, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}>
            {item.name}
          </p>
          {item.description && (
            <p className="t-desc" style={{
              margin: '0',
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
            {inCart ? (
              <div className="qty-stepper">
                <button className="qty-btn" id={`dec-${item._id}`} onClick={() => onDec(item)}>
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="qty-count">{cartQty}</span>
                <button
                  className="qty-btn" id={`inc-${item._id}`}
                  onClick={() => onInc(item)}
                  disabled={cartQty >= 10}
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button 
                className="btn-add"
                id={`add-${item._id}`} 
                onClick={() => onAdd(item)} 
                aria-label={`Add ${item.name}`}
              >
                ADD <Plus size={14} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main MenuPage ─────────────────────────────────────
export default function MenuPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null); // State for modal
  const [searchQuery, setSearchQuery] = useState(''); // State for search bar

  const { items, loading, error } = useSelector((s) => s.menu);
  const safeItems = Array.isArray(items) ? items : [];
  const { userInfo } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const { favorites, loadingAdd, loadingRemove } = useSelector((s) => s.favorites);

  useEffect(() => {
    const load = async () => {
      try {
        dispatch(menuRequest());
        const { data } = await axios.get(`${apiUrl}/api/menu`);
        dispatch(menuSuccess(data));
      } catch (e) { dispatch(menuFail(e.response?.data?.message || e.message)); }
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) return;
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
  }, [dispatch, userInfo]);

  const onAdd = (item) => dispatch(addToCart({ ...item, quantity: 1 }));
  const onInc = (item) => {
    const c = cartItems.find((x) => x._id === item._id);
    if (c && c.quantity < 10) dispatch(addToCart({ ...item, quantity: c.quantity + 1 }));
  };
  const onDec = (item) => {
    const c = cartItems.find((x) => x._id === item._id);
    if (!c) return;
    c.quantity > 1 ? dispatch(addToCart({ ...item, quantity: c.quantity - 1 })) : dispatch(removeFromCart(item._id));
  };

  const onFav = async (item) => {
    const isFav = favorites.some((f) => f._id === item._id);
    if (isFav) {
      dispatch(favoriteRemoveRequest());
      try {
        await axios.delete(`${apiUrl}/api/favorites/${item._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch(favoriteRemoveSuccess(item._id));
      } catch (e) { dispatch(favoriteRemoveFail(e.response?.data?.message || e.message)); }
    } else {
      dispatch(favoriteAddRequest());
      try {
        await axios.post(`${apiUrl}/api/favorites`, { menuItemId: item._id }, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch(favoriteAddSuccess(item));
      } catch (e) { dispatch(favoriteAddFail(e.response?.data?.message || e.message)); }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(orderReset());
    navigate('/login');
  };

  const filtered = safeItems.filter((i) => {
    const matchesCat = selectedCat === 'All' || i.category?.trim().toLowerCase() === selectedCat.trim().toLowerCase();
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const grouped = selectedCat === 'All'
    ? CATEGORIES.slice(1).reduce((acc, cat) => {
        const items = filtered.filter((i) => i.category?.trim().toLowerCase() === cat.toLowerCase());
        if (items.length) acc.push({ cat, items });
        return acc;
      }, [])
    : [{ cat: selectedCat, items: filtered }];

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
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <p className="t-brand" style={{ display: 'flex', alignItems: 'baseline' }}>
              GRAB<span style={{ fontSize: '0.85em', margin: '0 2px', textTransform: 'lowercase' }}>n</span>GO
            </p>
          </div>
          
          {/* Search Bar & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '340px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink)', opacity: 0.5 }} />
              <input 
                type="text" 
                placeholder="SEARCH MENU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-clean" 
                style={{ paddingLeft: '40px' }} 
              />
            </div>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-ink)', opacity: 0.6, display: 'flex', flexShrink: 0 }}>
              <Github size={24} />
            </a>
            {userInfo && (
              <button 
                onClick={handleLogout}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', opacity: 0.7, padding: '8px', display: 'flex', flexShrink: 0 }}
                aria-label="Logout"
              >
                <LogOut size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content Layout ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar (Categories) */}
        <aside style={{ 
          width: '200px', 
          flexShrink: 0, 
          position: 'sticky', 
          top: '100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <p className="t-section" style={{ marginBottom: '12px', paddingLeft: '16px' }}>Menu</p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCat(cat)}
              className={`cat-item ${selectedCat === cat ? 'cat-item-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Right Content Grid */}
        <main style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card" style={{ display: 'flex', flexDirection: 'row', height: '140px' }}>
                  <div style={{ width: '120px', background: 'var(--color-card-border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ padding: '16px', flex: 1 }}>
                    <div style={{ height: 16, width: '60%', background: 'var(--color-card-border)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-stamp)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>ERR: {error}</p>
            </div>
          ) : (
            grouped.map(({ cat, items: catItems }) => (
              <div key={cat} style={{ marginBottom: '40px' }}>
                {selectedCat === 'All' && (
                  <p className="t-section" style={{ marginBottom: '16px', paddingBottom: '8px', opacity: 0.8 }}>
                    {cat}
                  </p>
                )}

                {catItems.length === 0 ? (
                  <div style={{ padding: '24px', color: 'var(--color-ink)', opacity: 0.5, fontSize: '14px', background: 'var(--color-card-surface)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-card-border)' }}>
                    EMPTY CATEGORY
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '12px' // Strict 12px gap
                  }}>
                    {catItems.map((item) => {
                      const cartItem = cartItems.find((c) => c._id === item._id);
                      return (
                        <FoodTicket
                          key={item._id}
                          item={item}
                          cartQty={cartItem?.quantity ?? 0}
                          isFav={favorites.some((f) => f._id === item._id)}
                          onAdd={onAdd}
                          onInc={onInc}
                          onDec={onDec}
                          onFav={onFav}
                          favLoading={loadingAdd || loadingRemove}
                          showFav={!!userInfo}
                          onImageClick={setSelectedItem}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>

      {/* ── Item Detail Modal (Claim Ticket Style) ── */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(36, 31, 26, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            background: 'var(--color-card-surface)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            border: '1px solid var(--color-card-border)',
          }} onClick={(e) => e.stopPropagation()} className="page-enter">
            
            <button 
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--color-background)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={16} style={{ color: 'var(--color-ink)' }} />
            </button>

            <div style={{ width: '100%', height: '240px', background: 'var(--color-card-border)', overflow: 'hidden', borderBottom: '2px dashed var(--color-card-border)' }}>
              {selectedItem.imageUrl ? (
                <img src={selectedItem.imageUrl} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '64px', color: 'var(--color-ink)', opacity: 0.1, fontFamily: 'var(--font-display)' }}>
                    {selectedItem.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div style={{ padding: '24px' }}>
              <p className="t-page-title" style={{ fontSize: '24px', marginBottom: '12px' }}>{selectedItem.name}</p>
              <p className="t-desc" style={{ fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                {selectedItem.description}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '2px solid var(--color-ink)' }}>
                <p className="t-price" style={{ fontSize: '24px' }}>₹{selectedItem.price.toFixed(0)}</p>
                
                {(() => {
                  const cartQty = cartItems.find((c) => c._id === selectedItem._id)?.quantity ?? 0;
                  return cartQty > 0 ? (
                    <div className="qty-stepper" style={{ height: '40px' }}>
                      <button className="qty-btn" style={{ width: '40px' }} onClick={() => onDec(selectedItem)}>
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="qty-count" style={{ fontSize: '16px', padding: '0 8px' }}>{cartQty}</span>
                      <button
                        className="qty-btn" style={{ width: '40px' }}
                        onClick={() => onInc(selectedItem)}
                        disabled={cartQty >= 10}
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn-cta"
                      onClick={() => onAdd(selectedItem)} 
                    >
                      Add to Cart <Plus size={16} strokeWidth={3} />
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
