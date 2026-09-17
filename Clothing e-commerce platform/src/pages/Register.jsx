import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await register(fullName, email, password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/login');
  }

  return (
    <>
      <section id="page-header" className="about-header auth-header">
        <h2>Register</h2>
      </section>

      <section className="auth-section">
        <div className="auth-card">
          <span className="subtitle">SIGN UP</span>
          <h2>Create an Account</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              required
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
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
              placeholder="Password (min 6 characters)"
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {error && <p className="form-error">{error}</p>}
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </section>
    </>
  );
}
