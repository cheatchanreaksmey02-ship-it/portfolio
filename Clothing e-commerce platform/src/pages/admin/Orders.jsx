import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const STATUSES = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];

function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed') return { bg: '#e6f7ec', color: '#16a34a' };
  if (s === 'shipped') return { bg: '#eaf1fb', color: '#2563eb' };
  if (s === 'paid' || s === 'processing') return { bg: '#fdf0e2', color: '#d97706' };
  if (s === 'cancelled') return { bg: '#fde8e8', color: '#e63946' };
  return { bg: '#f0f0f0', color: '#606063' };
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');

  async function load() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  }

  const filtered = useMemo(() => orders.filter(o => {
    if (statusTab !== 'all' && o.status !== statusTab) return false;
    if (search) {
      const hay = `#ord-${o.id} ${o.customer_name || ''} ${o.email || ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }), [orders, statusTab, search]);

  return (
    <>
      <div className="adash-topbar">
        <div><h1>Manage Orders</h1><p>View and manage all customer orders.</p></div>
      </div>

      <div className="ord-tabs">
        {['all', ...STATUSES].map(s => (
          <div key={s} className={`ord-tab ${statusTab === s ? 'active' : ''}`} onClick={() => setStatusTab(s)}>
            {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ord-tab-count">{s === 'all' ? orders.length : orders.filter(o => o.status === s).length}</span>
          </div>
        ))}
      </div>

      <div className="ord-filters">
        <input type="text" className="ord-search-input" placeholder="Search by order ID, customer, email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="ord-panel">
        <div className="ord-table-scroll">
          <table className="ord-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>No orders found.</td></tr>
              ) : filtered.map(o => {
                const c = statusColor(o.status);
                return (
                  <tr key={o.id}>
                    <td data-label="Order ID">#ORD-{o.id}</td>
                    <td data-label="Customer">
                      <div className="ord-cust-name">{o.customer_name || 'Guest'}</div>
                      <div className="ord-cust-email">{o.email || ''}</div>
                    </td>
                    <td data-label="Date">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td data-label="Total">${Number(o.total).toFixed(2)}</td>
                    <td data-label="Payment"><span className="ord-pay-pill">{o.payment_method === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}</span></td>
                    <td data-label="Status">
                      <select className="ord-status-select" style={{ background: c.bg, color: c.color }} value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
