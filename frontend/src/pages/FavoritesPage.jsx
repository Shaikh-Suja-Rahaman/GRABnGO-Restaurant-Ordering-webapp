import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2, Heart, Search, X, Plus, Minus } from 'lucide-react';
import FoodTicket from '../components/FoodTicket';
import Header from '../components/Header';

const apiUrl = import.meta.env.VITE_API_URL;

import {
  favoritesRequest, favoritesSuccess, favoritesFail,
  favoriteAddRequest, favoriteAddSuccess, favoriteAddFail,
  favoriteRemoveRequest, favoriteRemoveSuccess, favoriteRemoveFail,
} from '../redux/slices/favoritesSlice';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';
import { orderReset } from '../redux/slices/orderSlice';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((s) => s.auth);
  const { favorites, loading, error, loadingAdd, loadingRemove } = useSelector((s) => s.favorites);
  const { cartItems } = useSelector((s) => s.cart);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCat, setSelectedCat] = useState('All');

  const CATEGORIES = ['All', 'Burgers', 'Meals', 'Pizzas', 'Biryanis', 'Sandwich', 'Hot Beverages', 'Cold Beverages'];

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
    // In Favorites page, un-hearting removes it from favorites
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
      // It's possible they re-add from the modal if it's still open
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

  const filtered = favorites.filter((i) => {
    const matchesCat = selectedCat === 'All' || i.category?.trim().toLowerCase() === selectedCat.trim().toLowerCase();
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* ── Sticky Page Header ── */}
      <Header 
        showSearch={true} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* ── Main Content Layout ── */}
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        
        {/* Left Sidebar (Categories) */}
        <aside className="w-full md:w-[200px] shrink-0 sticky top-[90px] md:top-[100px] z-40 bg-[var(--color-background)] pb-2 md:pb-0">
          {/* Mobile Title */}
          <div className="md:hidden mb-2 px-1">
            <p className="t-page-title text-[24px]">Saved</p>
          </div>
          
          <div className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto no-scrollbar items-center md:items-stretch px-1 md:px-0">
            <div className="hidden md:block mb-4 shrink-0">
              <p className="t-page-title">Saved</p>
              <p className="t-desc" style={{ marginTop: '4px', letterSpacing: '0.2px' }}>
                {loading ? '' : `${favorites.length} item${favorites.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-item whitespace-nowrap shrink-0 w-auto md:w-full ${selectedCat === cat ? 'cat-item-active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Content ── */}
        <div style={{ flex: 1, minWidth: 0, paddingBottom: '80px', width: '100%' }}>
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
          <div className="bg-[var(--color-card-surface)] border border-black/10 rounded-2xl p-12 md:p-16 flex flex-col items-center text-center max-w-[400px] mx-auto my-16">
            <Heart size={48} style={{ color: 'var(--color-ink)', opacity: 0.15, marginBottom: '24px' }} />
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
        ) : filtered.length === 0 ? (
           <div style={{ padding: '24px', color: 'var(--color-ink)', opacity: 0.5, fontSize: '14px', background: 'var(--color-card-surface)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-card-border)' }}>
             NO RESULTS FOUND
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((item) => {
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}