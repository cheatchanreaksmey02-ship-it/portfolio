import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function roleBadge(role) {
  if (role === 'admin') return { label: 'Admin', bg: '#f2ecfb', color: '#7c3aed' };
  return { label: 'Customer', bg: '#eaf1fb', color: '#2563eb' };
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('user');

  async function load() {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: orders } = await supabase.from('orders').select('user_id');
    const counts = {};
    (orders || []).forEach(o => { if (o.user_id) counts[o.user_id] = (counts[o.user_id] || 0) + 1; });
    setUsers(profiles || []);
    setOrderCounts(counts);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search && !`${u.full_name || ''} ${u.email || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [users, roleFilter, search]);

  const kpis = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'user').length,
  };

  function startEdit(u) { setEditingId(u.id); setEditRole(u.role); }

  async function saveRole() {
    await supabase.from('profiles').update({ role: editRole }).eq('id', editingId);
    setUsers(prev => prev.map(u => u.id === editingId ? { ...u, role: editRole } : u));
    setEditingId(null);
  }

  return (
    <>
      <div className="adash-topbar">
        <div><h1>Manage Users</h1><p>View and manage all users who have access to the system.</p></div>
      </div>

      <div className="u-kpis">
        <div className="u-kpi-card"><div className="u-kpi-icon" style={{ background: '#e6f2ef', color: '#088178' }}><i className="fas fa-users"></i></div><div><p className="label">Total Users</p><h3>{kpis.total}</h3></div></div>
        <div className="u-kpi-card"><div className="u-kpi-icon" style={{ background: '#f2ecfb', color: '#7c3aed' }}><i className="fas fa-shield-alt"></i></div><div><p className="label">Admins</p><h3>{kpis.admins}</h3></div></div>
        <div className="u-kpi-card"><div className="u-kpi-icon" style={{ background: '#eaf1fb', color: '#2563eb' }}><i className="fas fa-user"></i></div><div><p className="label">Customers</p><h3>{kpis.customers}</h3></div></div>
      </div>

      <div className="u-filters">
        <input type="text" className="u-search-input" placeholder="Search by name, email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Customer</option>
        </select>
      </div>

      <div className="u-panel">
        <div className="u-table-scroll">
          <table className="u-table">
            <thead><tr><th>User</th><th>Role</th><th>Email</th><th>Orders</th><th>Date Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>No users found.</td></tr>
              ) : filtered.map(u => {
                const badge = roleBadge(u.role);
                const initial = (u.full_name || u.email || '?').charAt(0).toUpperCase();
                return (
                  <tr key={u.id}>
                    <td data-label="User">
                      <div className="u-user-cell">
                        <div className="u-user-avatar" style={{ background: badge.bg, color: badge.color }}>{initial}</div>
                        <div className="u-user-name">{u.full_name || '(no name set)'}</div>
                      </div>
                    </td>
                    <td data-label="Role">
                      {editingId === u.id ? (
                        <select value={editRole} onChange={e => setEditRole(e.target.value)} onBlur={saveRole}>
                          <option value="user">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="u-role-badge" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                      )}
                    </td>
                    <td data-label="Email">{u.email || '-'}</td>
                    <td data-label="Orders">{orderCounts[u.id] || 0}</td>
                    <td data-label="Date Joined">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    <td data-label="Actions">
                      {editingId === u.id ? (
                        <button className="u-icon-btn" onClick={saveRole}><i className="fas fa-check"></i></button>
                      ) : (
                        <button className="u-icon-btn" title="Edit role" onClick={() => startEdit(u)}><i className="fas fa-pen"></i></button>
                      )}
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
