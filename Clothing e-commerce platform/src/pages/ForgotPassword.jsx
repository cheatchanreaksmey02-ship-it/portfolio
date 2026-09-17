import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const { error } = await sendPasswordReset(email);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  return (
    <section id="page-header" className="about-header">
      <h2>Forgot Password</h2>
      {sent ? (
        <p>Check your email for a password reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: 380, margin: '30px auto', textAlign: 'left' }}>
          <label>Email</label>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="btn-primary" style={{ width: '100%', marginTop: 15 }}>Send Reset Link</button>
        </form>
      )}
    </section>
  );
}
