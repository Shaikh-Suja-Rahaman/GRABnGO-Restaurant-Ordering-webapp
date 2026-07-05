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
    <div className="sticky top-0 z-50 bg-[var(--color-background)]">
      {/* ── Gradient Fade Overlay ── */}
      <div className="absolute left-0 right-0 h-[20px] pointer-events-none" style={{
        bottom: '-20px',
        background: 'linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)',
      }}/>
      
      <div className="max-w-[1200px] mx-auto px-5 pt-6 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        
        {/* ── Top Row (Mobile): Logo + Icons ── */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/favicon.svg" alt="GRABnGO Logo" style={{ width: '28px', height: '28px', marginRight: '10px' }} />
            <span className="t-brand">
              GRAB<span style={{ fontSize: '0.85em', margin: '0 2px', textTransform: 'lowercase' }}>n</span>GO
            </span>
          </Link>

          {/* Icons (Mobile only) */}
          <div className="flex md:hidden items-center gap-2">
            <a 
              href="https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp" 
              target="_blank" rel="noreferrer"
              style={{ color: 'var(--color-ink)', opacity: 0.7, padding: '8px', display: 'flex' }}
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
        
        {/* ── Second Row (Mobile) / Right Side (Desktop): Search & Icons ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto md:flex-1 md:justify-end">
          {showSearch && setSearchQuery && (
            <div className="relative w-full md:max-w-[340px]">
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink)', opacity: 0.5 }} />
              <input 
                type="text" 
                placeholder="SEARCH MENU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-clean" 
                style={{ paddingLeft: '40px', width: '100%' }} 
              />
            </div>
          )}
          
          {/* Icons (Desktop only) */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp" 
              target="_blank" rel="noreferrer"
              style={{ color: 'var(--color-ink)', opacity: 0.7, padding: '8px', display: 'flex' }}
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
    </div>
  );
}
