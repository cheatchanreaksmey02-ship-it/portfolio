import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

    return (
    <>
      <section id="page-header" className="about-header">
        <h2>My Account</h2>
        <p>Welcome back, {profile?.full_name || user.email}</p>
      </section>

      <section className="section-p1">
        <h3>Order History</h3>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="order-table">
            <thead><tr><th>Order #</th><th>Items</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.items || '—'}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{o.status}</td>
                  <td>${Number(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
