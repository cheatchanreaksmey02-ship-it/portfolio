import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*, categories(name)').eq('id', id).single();
      setProduct(data || null);
      setQty(1);

      if (data) {
        const { data: all } = await supabase.from('products').select('*').neq('id', data.id);
        if (all) {
          const same = all.filter(p => p.category_id === data.category_id);
          const others = all.filter(p => p.category_id !== data.category_id);
          const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
          setRelated(shuffle(same).concat(shuffle(others)).slice(0, 3));
        }
      }
    }
    load();
  }, [id]);

  if (!product) {
    return (
      <section id="page-header" className="about-header">
        <h2>{product === null ? 'Loading…' : 'Product not found'}</h2>
      </section>
    );
  }

  const full = Math.round(product.rating || 5);

  return (
    <>
      <section id="page-header" className="about-header">
        <h2>Product Overview</h2>
      </section>

      <section className="section-p1" style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="product-media">
          <img src={`${import.meta.env.BASE_URL}${product.image_url || 'img/product/f1.jpg'}`} alt={product.name} />
        </div>
        <div style={{ maxWidth: 450 }}>
          <span style={{ color: '#606063', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>{product.brand}</span>
          <h2 style={{ margin: '6px 0 12px', fontSize: 28, color: '#1a1a1a' }}>{product.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="star">
              {[1, 2, 3, 4, 5].map(i => <i key={i} className={`${i <= full ? 'fas' : 'far'} fa-star`}></i>)}
            </div>
          </div>
          <h4 style={{ color: '#088178', fontSize: 24, margin: '15px 0' }}>${Number(product.price).toFixed(2)}</h4>
          <hr className="pd-divider" />

          {product.color && (
            <div style={{ margin: '25px 0 15px' }}>
              <p style={{ marginBottom: 8, fontSize: 13, color: '#1a1a1a' }}>
                Color: <span style={{ color: '#606063' }}>{product.color}</span>
              </p>
              {product.color_hex && (
                <div className="color-swatch" style={{ background: product.color_hex }}></div>
              )}
            </div>
          )}

          <p style={{ margin: '15px 0', fontWeight: 600 }}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: '#1a1a1a' }}>Quantity</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 5 }}>
            <div className="qty-control">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="btn-primary" onClick={() => addToCart(product, qty)}>
              <i className="fal fa-shopping-bag" style={{ marginRight: 8 }}></i>Add to Cart
            </button>
            <button type="button" className="wishlist-btn"><i className="fal fa-heart"></i></button>
          </div>

          <div className="pd-trust-box">
            <div className="pd-trust-item">
              <i className="fas fa-truck"></i>
              <div><strong>Free Shipping</strong>on orders over $50</div>
            </div>
            <div className="pd-trust-item">
              <i className="fas fa-undo-alt"></i>
              <div><strong>Easy Returns</strong>30-day return</div>
            </div>
            <div className="pd-trust-item">
              <i className="fas fa-shield-alt"></i>
              <div><strong>Secure Checkout</strong>100% protected</div>
            </div>
          </div>
        </div>
      </section>

      <section id="product1" className="section-p1">
        <h2 className="sm-heading">You May Also Like</h2>
        <div className="pro-container" id="related-products">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
