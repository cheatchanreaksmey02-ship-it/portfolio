import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

      if (!data) return;
      setFeatured(data.filter(p => p.categories?.name === 'Feature').slice(0, 8));
      setNewArrivals(data.filter(p => p.categories?.name === 'New').slice(0, 8));
    }
    load();
  }, []);

  return (
    <>
      <section id="hero">
        <h4>Exclusive Offer</h4>
        <h2>The Deals You </h2>
        <h1>Can't Miss</h1>
        <p>Score extra savings at checkout + up to 70% off your favorites</p>
        <button>Shop Now</button>
      </section>

      <section id="feature" className="section-p1">
        {[1, 2, 3, 4].map(i => (
          <div className="fe-box" key={i}>
            <img src={`${import.meta.env.BASE_URL}img/features/f${i}.jpg`} alt="" />
            <h6>{['Free Shipping', 'Online Order', 'Save Money', '24/7 Support'][i - 1]}</h6>
          </div>
        ))}
      </section>

      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container" id="featured-products">
          {featured.length === 0
            ? <p>No products yet — check back soon!</p>
            : featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section id="banner" className="section-m1">
        <h4>Style Upgrade</h4>
        <h2>Up to <span>70% off</span> - Your New Favorite Looks</h2>
        <button className="normal">Explore More</button>
      </section>

      <section id="product1" className="section-p1">
        <h2>New Arrivals</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container" id="new-arrivals">
          {newArrivals.length === 0
            ? <p>No products yet — check back soon!</p>
            : newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section id="sm-banner" className="section-p1">
        <div className="banner-box">
          <h4>Weekend Flash Sale</h4>
          <h2>buy 1 get 1 free</h2>
          <span>The hottest trending casual clothes <br />are now on sale at Cara.</span>
          <button className="white">Learn More</button>
        </div>
        <div className="banner-box banner-box2">
          <h4>Streetwear Collection</h4>
          <h2>New Arrivals</h2>
          <span>Discover premium quality tees and essentials <br />designed for comfort at Cara.</span>
          <button className="white">View Collection</button>
        </div>
      </section>

      <section id="banner3">
        <div className="banner-box">
          <h2>HOT SEASON SALE</h2>
          <h3>-50% Off Selected Items</h3>
        </div>
        <div className="banner-box banner-box2">
          <h2>WEEKEND LOOKBOOK</h2>
          <h3>Trending Styles for your Daily Outfits</h3>
        </div>
        <div className="banner-box banner-box3">
          <h2>CASUAL ESSENTIALS</h2>
          <h3>Lightweight & Comfortable</h3>
        </div>
      </section>

      <section id="newsletter" className="section-p1 section-m1">
        <div className="newstext">
          <h4>Sign Up For Newsletters</h4>
          <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <div className="form">
          <input type="text" placeholder="Your email address" />
          <button className="normal">Sign Up</button>
        </div>
      </section>
    </>
  );
}
