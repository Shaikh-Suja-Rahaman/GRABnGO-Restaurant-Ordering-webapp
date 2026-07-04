import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError } from '../redux/slices/authSlice';
import { Loader2 } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((s) => s.auth);

  useEffect(() => { if (userInfo) navigate('/'); }, [userInfo, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, { username, email, password });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    }
  };

  const fields = [
    { id: 'reg-username', label: 'Username',       type: 'text',     value: username, set: setUsername, placeholder: 'johndoe' },
    { id: 'reg-email',    label: 'Email',           type: 'email',    value: email,    set: setEmail,    placeholder: 'you@example.com' },
    { id: 'reg-password', label: 'Password',        type: 'password', value: password, set: setPassword, placeholder: '••••••••' },
  ];

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p className="t-brand" style={{ fontSize: '36px', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            GRAB<span style={{ fontSize: '0.85em', margin: '0 2px', textTransform: 'lowercase' }}>n</span>GO
          </p>
          <p className="t-desc" style={{ marginTop: '4px' }}>Create your account</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px' }}>
          {error && (
            <div style={{
              background: 'transparent', border: '1px dashed var(--color-stamp)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '20px',
            }}>
              <p style={{ color: 'var(--color-stamp)', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={submit}>
            {fields.map(({ id, label, type, value, set, placeholder }, idx) => (
              <div key={id} style={{ marginBottom: idx < fields.length - 1 ? '16px' : '24px' }}>
                <label style={{
                  display: 'block', fontSize: '12px', fontWeight: 700,
                  color: 'var(--color-ink)', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {label}
                </label>
                <input
                  id={id}
                  type={type} value={value}
                  onChange={(e) => set(e.target.value)}
                  required placeholder={placeholder}
                  className="input-clean"
                />
              </div>
            ))}

            <button
              id="register-submit"
              type="submit" disabled={loading}
              className="btn-cta"
              style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '12px' }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> STAMPING…</>
                : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0' }}>
            <div style={{ flex: 1, borderTop: '1px dashed rgba(36, 31, 26, 0.15)' }} />
            <span className="t-desc" style={{ fontSize: '12px' }}>or</span>
            <div style={{ flex: 1, borderTop: '1px dashed rgba(36, 31, 26, 0.15)' }} />
          </div>

          <button
            id="goto-login"
            onClick={() => navigate('/login')}
            className="btn-outline"
            style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '12px' }}
          >
            SIGN IN INSTEAD
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}