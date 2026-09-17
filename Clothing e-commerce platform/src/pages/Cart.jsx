import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, subtotal, shipping, total } = useCart();

  if (cart.length === 0) {
    return (
      <section id="page-header" className="about-header">
        <h2>Your cart is empty</h2>
        <p><Link to="/shop">Continue shopping →</Link></p>
      </section>
    );
  }

  return (
    <>
      <section id="page-header" className="about-header">
        <h2>Your Cart</h2>
      </section>

      <section className="section-p1 cart-layout">
        <div>
          {cart.map(item => (
            <div className="cart-row" key={item.id}>
              <img src={`${import.meta.env.BASE_URL}${item.image_url || 'img/product/f1.jpg'}`} alt={item.name} />
              <div style={{ flex: 1 }}>
                <p><strong>{item.name}</strong></p>
                <p>${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <p>${(item.price * item.qty).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fal fa-trash-alt"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <p>Subtotal <span>${subtotal.toFixed(2)}</span></p>
          <p>Shipping <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></p>
          <hr />
          <p><strong>Total</strong> <strong>${total.toFixed(2)}</strong></p>
          <Link to="/checkout"><button className="btn-primary" style={{ width: '100%' }}>Checkout</button></Link>
        </div>
      </section>
    </>
  );
}
