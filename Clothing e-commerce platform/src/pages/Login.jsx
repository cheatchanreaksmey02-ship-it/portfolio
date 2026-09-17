import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await login(email, password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/');
  }

  return (
    <>
      <section id="page-header" className="about-header auth-header">
        <h2>Login</h2>
      </section>

      <section className="auth-section">
        <div className="auth-card">
          <span className="subtitle">SIGN IN</span>
          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              required
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="form-error">{error}</p>}
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            No account? <Link to="/register">Register</Link> · <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </section>
    </>
  );
}
