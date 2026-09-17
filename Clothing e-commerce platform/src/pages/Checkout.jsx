import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: '', phone: '', email: user?.email || '', address: '', province: '', note: '',
    payment_method: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { data: order, error: orderErr } = await supabase.from('orders').insert({
      user_id: user?.id || null,
      status: 'pending',
      total,
      shipping_fee: shipping,
      ...form,
    }).select().single();

    if (orderErr) {
      setError(orderErr.message);
      setSubmitting(false);
      return;
    }

    const items = cart.map(i => ({ order_id: order.id, product_id: i.id, quantity: i.qty, price: i.price }));
    const { error: itemsErr } = await supabase.from('order_items').insert(items);

      if (itemsErr) {
      setError(itemsErr.message);
      setSubmitting(false);
      return;
    }

    setPlacedOrder({ items: cart, subtotal, shipping, total, payment_method: form.payment_method });
    clearCart();
    setSubmitting(false);
  }

    if (placedOrder) {
    return (
      <>
        <section id="page-header" className="about-header">
          <h2>Checkout</h2>
        </section>

        <section className="section-p1 checkout-layout">
          <div className="checkout-form" style={{ textAlign: 'center' }}>
            <h3>Scan to Pay</h3>
            <p>Your order has been placed. Please scan the QR code below to complete your payment.</p>
            <img src={`${import.meta.env.BASE_URL}img/payment-qr.jpg`} alt="Payment QR" style={{ maxWidth: 240, margin: '20px auto', display: 'block' }} />
            <button className="btn-primary" onClick={() => navigate('/account')} style={{ marginTop: 10 }}>
              Done — View My Orders
            </button>
          </div>

          <div className="cart-summary-box">
            <h3>Order Summary</h3>
            {placedOrder.items.map(i => (
              <p key={i.id}>{i.name} × {i.qty} <span>${(i.price * i.qty).toFixed(2)}</span></p>
            ))}
            <hr />
            <p>Subtotal <span>${placedOrder.subtotal.toFixed(2)}</span></p>
            <p>Shipping <span>{placedOrder.shipping === 0 ? 'Free' : `$${placedOrder.shipping.toFixed(2)}`}</span></p>
            <hr />
            <p><strong>Total</strong> <strong>${placedOrder.total.toFixed(2)}</strong></p>
          </div>
        </section>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <section id="page-header" className="about-header">
        <h2>Your cart is empty</h2>
      </section>
    );
  }

  return (
    <>
      <section id="page-header" className="about-header">
        <h2>Checkout</h2>
      </section>

      <section className="section-p1 checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Contact & Delivery</h3>
          <label>Full Name</label>
          <input required value={form.customer_name} onChange={e => update('customer_name', e.target.value)} />

          <label>Phone</label>
          <input required value={form.phone} onChange={e => update('phone', e.target.value)} />

          <label>Email</label>
          <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} />

          <label>Province</label>
          <select required value={form.province} onChange={e => update('province', e.target.value)}>
            <option value="">Select province</option>
            <option>Phnom Penh</option>
            <option>Siem Reap</option>
            <option>Battambang</option>
            <option>Sihanoukville</option>
            <option>Other</option>
          </select>

          <label>Address</label>
          <input required value={form.address} onChange={e => update('address', e.target.value)} />

          <label>Note (optional)</label>
          <textarea value={form.note} onChange={e => update('note', e.target.value)}></textarea>

                    <h3>Payment Method</h3>
          <div className="payment-options">
            <label className="payment-option">
              <input type="radio" name="payment" checked={form.payment_method === 'cod'}
                     onChange={() => update('payment_method', 'cod')} /> Cash on Delivery
            </label>
            <label className="payment-option">
              <input type="radio" name="payment" checked={form.payment_method === 'bank'}
                     onChange={() => update('payment_method', 'bank')} /> Bank Transfer / QR
            </label>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="btn-primary" type="submit" disabled={submitting} style={{ marginTop: 20 }}>
            {submitting ? 'Placing order…' : 'Place Order'}
          </button>
        </form>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          {cart.map(i => (
            <p key={i.id}>{i.name} × {i.qty} <span>${(i.price * i.qty).toFixed(2)}</span></p>
          ))}
          <hr />
          <p>Subtotal <span>${subtotal.toFixed(2)}</span></p>
          <p>Shipping <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></p>
          <hr />
          <p><strong>Total</strong> <strong>${total.toFixed(2)}</strong></p>
        </div>
      </section>
    </>
  );
}
