import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, profile, isAdmin, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const adminName = profile?.full_name || user.email;

  return (
    <div className="adash-wrap">
      <nav className="adash-sidebar">
        <div className="adash-brand"><img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Cara" /></div>
        <div className="adash-nav">
          <NavLink to="/admin/dashboard"><i className="fas fa-home"></i> Dashboard</NavLink>
          <NavLink to="/admin/products"><i className="fas fa-box"></i> Products</NavLink>
          <NavLink to="/admin/orders"><i className="fas fa-shopping-bag"></i> Orders</NavLink>
          <NavLink to="/admin/users"><i className="fas fa-users"></i> Users</NavLink>
          <NavLink to="/admin/messages"><i className="fas fa-envelope"></i> Messages</NavLink>
        </div>
        <div className="adash-nav-logout">
          <NavLink to="/"><i className="fas fa-arrow-left"></i> Back to Site</NavLink>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}><i className="fas fa-sign-out-alt"></i> Logout</a>
        </div>
      </nav>

      <main className="adash-main">
        <Outlet context={{ adminName }} />
      </main>
    </div>
  );
}
