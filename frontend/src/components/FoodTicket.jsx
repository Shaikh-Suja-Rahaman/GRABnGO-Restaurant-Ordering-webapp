import React, { useState } from 'react';
import { Heart, Plus, Minus } from 'lucide-react';

export default function FoodTicket({ item, cartQty, isFav, onAdd, onInc, onDec, onFav, favLoading, showFav, onImageClick }) {
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
