import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, X } from 'lucide-react';
import FoodTicket from '../components/FoodTicket';
import Header from '../components/Header';

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
      <Header 
        showSearch={true} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

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
          <div style={{ marginBottom: '16px' }}>
            <p className="t-page-title">Menu</p>
            <p className="t-desc" style={{ marginTop: '4px', letterSpacing: '0.2px' }}>
              {loading ? '' : `${safeItems.length} items`}
            </p>
          </div>
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
                <p className="t-section" style={{ marginBottom: '16px', paddingBottom: '8px', opacity: 0.8 }}>
                  {cat}
                </p>

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
