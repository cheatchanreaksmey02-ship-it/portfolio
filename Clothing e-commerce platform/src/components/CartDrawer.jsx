import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { drawer } = useCart();
  const show = !!drawer;
  const product = drawer?.product;
  const qty = drawer?.qty;

  return (
    <div className={`added-drawer${show ? ' show' : ''}`}>
      {product && (
        <div className="added-drawer-inner">
          <img src={`${import.meta.env.BASE_URL}${product.image_url || 'img/product/f1.jpg'}`} alt={product.name} />
          <div className="added-drawer-text">
            <strong>{product.name}</strong>
            <span>{qty} added to your bag</span>
          </div>
          <Link to="/cart" className="btn-primary added-drawer-btn">View Bag ({qty})</Link>
        </div>
      )}
    </div>
  );
}
