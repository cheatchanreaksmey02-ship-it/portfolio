import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed') return { bg: '#e6f7ec', color: '#16a34a' };
  if (s === 'shipped') return { bg: '#eaf1fb', color: '#2563eb' };
  if (s === 'paid' || s === 'processing') return { bg: '#fdf0e2', color: '#d97706' };
  if (s === 'cancelled') return { bg: '#fde8e8', color: '#e63946' };
  return { bg: '#f0f0f0', color: '#606063' };
}

export default function Dashboard() {
  const { adminName } = useOutletContext();
  const [kpis, setKpis] = useState({ sales: 0, orders: 0, customers: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const [{ data: orders }, { data: profiles }, { data: products }] = await Promise.all([
        supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id'),
        supabase.from('products').select('id'),
      ]);

      const sales = (orders || []).reduce((sum, o) => sum + Number(o.total), 0);
      setKpis({
        sales, orders: (orders || []).length,
        customers: (profiles || []).length, products: (products || []).length,
      });
      setRecentOrders((orders || []).slice(0, 5));
    }
    load();
  }, []);

  return (
    <>
      <div className="adash-topbar">
        <div>
          <h1>Welcome back, {adminName.split(' ')[0]} 👋</h1>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className="adash-top-right">
          <div className="adash-search"><i className="fas fa-search"></i> Search...</div>
          <div className="adash-avatar">
            <div className="adash-avatar-circle">{adminName.charAt(0).toUpperCase()}</div>
            <div className="adash-avatar-text"><strong>{adminName}</strong><span>Admin</span></div>
          </div>
        </div>
      </div>

      <div className="adash-kpis">
        <div className="adash-kpi-card">
          <div className="adash-kpi-icon" style={{ background: '#e6f2ef', color: '#088178' }}><i className="fas fa-dollar-sign"></i></div>
          <div><p className="label">Total Sales</p><h3>${kpis.sales.toFixed(2)}</h3></div>
        </div>
        <div className="adash-kpi-card">
          <div className="adash-kpi-icon" style={{ background: '#eaf1fb', color: '#2563eb' }}><i className="fas fa-shopping-bag"></i></div>
          <div><p className="label">Total Orders</p><h3>{kpis.orders}</h3></div>
        </div>
        <div className="adash-kpi-card">
          <div className="adash-kpi-icon" style={{ background: '#f2ecfb', color: '#7c3aed' }}><i className="fas fa-users"></i></div>
          <div><p className="label">Total Customers</p><h3>{kpis.customers}</h3></div>
        </div>
        <div className="adash-kpi-card">
          <div className="adash-kpi-icon" style={{ background: '#fdf0e2', color: '#d97706' }}><i className="fas fa-box"></i></div>
          <div><p className="label">Total Products</p><h3>{kpis.products}</h3></div>
        </div>
      </div>

      <div className="adash-content-grid">
        <div>
          <div className="adash-panel">
            <div className="adash-panel-head">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders">View All</Link>
            </div>
            <div className="adash-table-scroll">
              <table className="adash-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={6}>No orders yet.</td></tr>
                  ) : recentOrders.map(o => {
                    const c = statusColor(o.status);
                    return (
                      <tr key={o.id}>
                        <td data-label="Order">#ORD-{o.id}</td>
                        <td data-label="Customer">{o.customer_name || o.profiles?.full_name || 'Guest'}</td>
                        <td data-label="Date">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td data-label="Total">${Number(o.total).toFixed(2)}</td>
                        <td data-label="Status"><span className="adash-status" style={{ background: c.bg, color: c.color }}>{o.status || 'pending'}</span></td>
                        <td data-label=""><Link to="/admin/orders"><button className="adash-view-btn" type="button"><i className="fas fa-eye"></i></button></Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="adash-panel">
            <div className="adash-panel-head"><h3>Quick Actions</h3></div>
            <Link to="/admin/products" className="adash-qa-item">
              <span><i className="fas fa-plus leading"></i> Add New Product</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/admin/orders" className="adash-qa-item">
              <span><i className="fas fa-shopping-bag leading"></i> View Orders</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/admin/users" className="adash-qa-item">
              <span><i className="fas fa-users leading"></i> Manage Users</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/admin/messages" className="adash-qa-item">
              <span><i className="fas fa-envelope leading"></i> View Messages</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
