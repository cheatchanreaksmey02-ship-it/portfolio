import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts(data || []);
    }
    load();
  }, []);

  return (
    <>
      <section id="page-header">
        <h2>Style Up</h2>
        <p>Save more with special coupons & up to 70% off!</p>
      </section>

      <section id="product1" className="section-p1">
        <div className="pro-container" id="shop-products">
          {products.length === 0
            ? <p>No products yet — check back soon!</p>
            : products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
