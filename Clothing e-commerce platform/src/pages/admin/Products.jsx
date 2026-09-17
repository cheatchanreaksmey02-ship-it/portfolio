import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const LOW_STOCK_MAX = 9;

function stockStatus(stock) {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_MAX) return 'low';
  return 'active';
}
function statusBadge(status) {
  if (status === 'out') return { label: 'Out of Stock', bg: '#fde8e8', color: '#e63946' };
  if (status === 'low') return { label: 'Low Stock', bg: '#fdf0e2', color: '#d97706' };
  return { label: 'Active', bg: '#e6f7ec', color: '#16a34a' };
}

const emptyForm = { id: null, name: '', brand: '', price: '', rating: 5, image_url: '', category_id: '', stock: 0, color: '', color_hex: '', description: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: cats } = await supabase.from('categories').select('*').order('id');
    setProducts(prods || []);
    setCategories(cats || []);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => products.filter(p => {
    if (search && !`${p.name} ${p.brand || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && String(p.category_id) !== catFilter) return false;
    if (stockFilter && stockStatus(p.stock) !== stockFilter) return false;
    return true;
  }), [products, search, catFilter, stockFilter]);

  const kpis = useMemo(() => ({
    total: products.length,
    active: products.filter(p => stockStatus(p.stock) === 'active').length,
    out: products.filter(p => stockStatus(p.stock) === 'out').length,
    low: products.filter(p => stockStatus(p.stock) === 'low').length,
    value: products.reduce((s, p) => s + Number(p.price) * Number(p.stock), 0),
  }), [products]);

  function openAdd() { setForm(emptyForm); setMsg(''); setModalOpen(true); }
  function openEdit(p) {
    setForm({
      id: p.id, name: p.name, brand: p.brand || '', price: p.price, rating: p.rating || 5,
      image_url: p.image_url || '', category_id: p.category_id || '', stock: p.stock,
      color: p.color || '', color_hex: p.color_hex || '', description: p.description || '',
    });
    setMsg('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('Saving...');
    const payload = {
      name: form.name.trim(), brand: form.brand.trim(), price: parseFloat(form.price),
      rating: parseFloat(form.rating) || 5, image_url: form.image_url.trim(),
      category_id: form.category_id || null, stock: parseInt(form.stock) || 0,
      color: form.color.trim() || null, color_hex: form.color_hex.trim() || null,
      description: form.description.trim(),
    };
    const { error } = form.id
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert(payload);
    if (error) { setMsg(error.message); return; }
    setModalOpen(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  return (
    <>
      <div className="adash-topbar">
        <div><h1>Manage Products</h1><p>View and manage all products in your store.</p></div>
      </div>

      <div className="pr-kpis">
        <div className="pr-kpi-card"><div className="pr-kpi-icon" style={{ background: '#e6f2ef', color: '#088178' }}><i className="fas fa-box"></i></div><div><p className="label">Total Products</p><h3>{kpis.total}</h3></div></div>
        <div className="pr-kpi-card"><div className="pr-kpi-icon" style={{ background: '#f2ecfb', color: '#7c3aed' }}><i className="fas fa-check-circle"></i></div><div><p className="label">Active Products</p><h3>{kpis.active}</h3></div></div>
        <div className="pr-kpi-card"><div className="pr-kpi-icon" style={{ background: '#fde8e8', color: '#e63946' }}><i className="fas fa-times-circle"></i></div><div><p className="label">Out of Stock</p><h3>{kpis.out}</h3></div></div>
        <div className="pr-kpi-card"><div className="pr-kpi-icon" style={{ background: '#fdf0e2', color: '#d97706' }}><i className="fas fa-exclamation-triangle"></i></div><div><p className="label">Low Stock</p><h3>{kpis.low}</h3></div></div>
        <div className="pr-kpi-card"><div className="pr-kpi-icon" style={{ background: '#eaf1fb', color: '#2563eb' }}><i className="fas fa-dollar-sign"></i></div><div><p className="label">Total Value</p><h3>${kpis.value.toFixed(2)}</h3></div></div>
      </div>

      <div className="pr-filters">
        <input type="text" className="pr-search-input" placeholder="Search by product name, brand..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
          <option value="">All Stock</option>
          <option value="active">Active</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button type="button" className="pr-btn pr-btn-primary" onClick={openAdd}><i className="fas fa-plus"></i> Add New Product</button>
      </div>

      <div className="pr-panel">
        <div className="pr-table-scroll">
          <table className="pr-table">
            <thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>No products found.</td></tr>
              ) : filtered.map(p => {
                const st = stockStatus(p.stock);
                const badge = statusBadge(st);
                const catName = categories.find(c => c.id === p.category_id)?.name || '-';
                return (
                  <tr key={p.id}>
                    <td data-label="Product">
                      <div className="pr-prod-cell">
                        <img src={`${import.meta.env.BASE_URL}${p.image_url || 'img/product/f1.jpg'}`} alt="" />
                        <div><div className="pr-prod-name">{p.name}</div>{p.color && <div className="pr-prod-sub">{p.color}</div>}</div>
                      </div>
                    </td>
                    <td data-label="Brand">{p.brand || '-'}</td>
                    <td data-label="Category">{catName}</td>
                    <td data-label="Price">${Number(p.price).toFixed(2)}</td>
                    <td data-label="Stock" className="pr-stock-num" style={{ color: badge.color }}>{p.stock}</td>
                    <td data-label="Status"><span className="pr-status-badge" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span></td>
                    <td data-label="Actions">
                      <button className="pr-icon-btn" title="Edit" onClick={() => openEdit(p)}><i className="fas fa-pen"></i></button>
                      <button className="pr-icon-btn danger" title="Delete" onClick={() => handleDelete(p.id)}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="pr-modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="pr-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{form.id ? 'Edit Product' : 'Add New Product'}</h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Product Name</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <label>Brand</label>
              <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
              <label>Price</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              <label>Category</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label>Stock quantity</label>
              <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
              <label>Image path</label>
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="img/product/f1.jpg" />
              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}></textarea>
              <p>{msg}</p>
              <div className="pr-modal-actions">
                <button type="submit" className="pr-btn pr-btn-primary" style={{ flex: 1 }}>Save Product</button>
                <button type="button" className="pr-btn" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
