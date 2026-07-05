import React from 'react';
import { Search, Github, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { orderReset } from '../redux/slices/orderSlice';

export default function Header({ showSearch = false, searchQuery = '', setSearchQuery = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(orderReset());
    navigate('/login');
  };

  return (
    <div style={{
      background: 'var(--color-background)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* ── Gradient Fade Overlay ── */}
      <div style={{
        position: 'absolute', bottom: '-20px', left: 0, right: 0, height: '20px',
        background: 'linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)',
        pointerEvents: 'none'
      }}/>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 20px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/favicon.svg" alt="GRABnGO Logo" style={{ width: '28px', height: '28px', marginRight: '10px' }} />
          <span className="t-brand">
            GRAB<span style={{ fontSize: '0.85em', margin: '0 2px', textTransform: 'lowercase' }}>n</span>GO
          </span>
        </Link>
        
        {/* ── Right Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          {showSearch && setSearchQuery && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
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
          )}
          
          <a 
            href="https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp" 
            target="_blank" rel="noreferrer"
            style={{ color: 'var(--color-ink)', opacity: 0.7, padding: '8px', display: 'flex', transition: 'opacity 150ms' }}
            aria-label="GitHub"
            className="header-icon-btn"
          >
            <Github size={24} />
          </a>
          
          {userInfo && (
            <button 
              onClick={handleLogout}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', opacity: 0.7, padding: '8px', display: 'flex' }}
              aria-label="Logout"
              className="header-icon-btn"
            >
              <LogOut size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
