
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <section id="header">
      <Link to="/"><img src={`${import.meta.env.BASE_URL}img/logo.jpg`} className="logo" alt="Cara" /></Link>

      <div>
        <ul id="navbar" className={open ? 'active' : ''}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>

          {user ? (
            <>
              {isAdmin && <li><NavLink to="/admin/dashboard">Admin</NavLink></li>}
              <li><NavLink to="/account">My Account</NavLink></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
            </>
          )}

          <li id="lg-bag">
            <Link to="/cart"><i className="fas fa-shopping-bag"></i> <span id="cart-count">{itemCount}</span></Link>
          </li>
          <a href="#" id="close" onClick={(e) => { e.preventDefault(); setOpen(false); }}><i className="far fa-times"></i></a>
        </ul>
      </div>
      <div id="mobile">
        <Link to="/cart"><i className="fas fa-shopping-bag"></i></Link>
        <i id="bar" className="fas fa-bars" onClick={() => setOpen(true)}></i>
      </div>
    </section>
  );
}
