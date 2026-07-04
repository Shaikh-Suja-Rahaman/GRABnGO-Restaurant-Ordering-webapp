import React from 'react';
import { LayoutGrid, ScrollText, Heart, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';

const navItems = [
  { id: 'menu',      label: 'Menu',    icon: LayoutGrid   },
  { id: 'orders',    label: 'Orders',  icon: ScrollText   },
  { id: 'favorites', label: 'Saved',   icon: Heart        },
  { id: 'cart',      label: 'Cart',    icon: ShoppingCart },
];

export default function BottomNavbar({ activeTab, setActiveTab }) {
  const cartItems = useSelector((s) => s.cart.cartItems);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <nav style={{
      position: 'fixed',
      bottom: '24px', 
      left: '50%',
      transform: 'translateX(-50%)',
      height: '64px',
      width: 'calc(100% - 32px)',
      maxWidth: '400px',
      background: 'rgba(249, 245, 236, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(36, 31, 26, 0.08)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(36, 31, 26, 0.05)',
      zIndex: 100,
      padding: '0 8px',
    }}>
      <div style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'space-between',
      }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          const showBadge = id === 'cart' && cartCount > 0;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {/* Badge */}
              {showBadge && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: 'calc(50% - 20px)',
                  background: 'var(--color-stamp)',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 600,
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}

              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                style={{
                  color: active ? 'var(--color-ink)' : 'rgba(36, 31, 26, 0.5)',
                  transition: 'color 150ms ease',
                }}
              />
              <span style={{
                fontSize: '11px',
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--color-ink)' : 'rgba(36, 31, 26, 0.5)',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
                transition: 'color 150ms ease',
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
