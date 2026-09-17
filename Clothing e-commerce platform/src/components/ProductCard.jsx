import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Stars({ rating = 5 }) {
  const full = Math.round(rating);
  return (
    <div className="star">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`${i <= full ? 'fas' : 'far'} fa-star`}></i>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="pro">
      <Link to={`/product/${product.id}`}>
        <img src={`${import.meta.env.BASE_URL}${product.image_url || 'img/product/f1.jpg'}`} alt={product.name} />
        <div className="des">
          <span>{product.brand || ''}</span>
          <h5>{product.name}</h5>
          <Stars rating={product.rating || 5} />
          <h4>${Number(product.price).toFixed(2)}</h4>
        </div>
      </Link>
      <a href="#" className="cart-btn" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
        <i className="fal fa-shopping-cart cart"></i>
      </a>
    </div>
  );
}
