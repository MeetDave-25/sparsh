'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((s) => {
        if (s.authenticated) router.push('/admin/dashboard');
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin/dashboard');
        return;
      }
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}>
          <Sparkles size={32} />
        </div>
        <h1>Studio Admin</h1>
        <p>Enter password to access the dashboard</p>
        
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className="form-group" style={{ position: 'relative' }}>
             <Lock size={18} className={styles.inputIcon} />
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className={`form-input ${styles.pwdInput} ${error ? styles.inputError : ''}`}
               placeholder="Admin Password"
               required
             />
             {error && <span className={styles.errorText}>Incorrect password</span>}
          </div>
          <button type="submit" className="btn btn-primary w-full" id="admin-login-btn" disabled={submitting}>
            {submitting ? 'Checking…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
