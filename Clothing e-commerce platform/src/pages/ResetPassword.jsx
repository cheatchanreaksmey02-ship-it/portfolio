import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const { error } = await updatePassword(password);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => navigate('/login'), 1500);
  }

  return (
    <section id="page-header" className="about-header">
      <h2>Reset Password</h2>
      {done ? (
        <p>Password updated! Redirecting to login…</p>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: 380, margin: '30px auto', textAlign: 'left' }}>
          <label>New Password</label>
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="btn-primary" style={{ width: '100%', marginTop: 15 }}>Update Password</button>
        </form>
      )}
    </section>
  );
}
