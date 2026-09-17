export default function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="" />
        <p><strong>Address:</strong>No.562, Street 32, Boeung Keng Kang, Phnom Penh</p>
        <p><strong>Phone:</strong> +85 12 345 678</p>
        <p><strong>Hours:</strong> 08:00 - 17:00, Mon - Sat</p>
        <div className="follow">
          <h4>Follow Us</h4>
          <div className="icon">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-pinterest-p"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>About</h4>
        <a href="#">About us</a>
        <a href="#">Delivery Information</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Term & Conditions</a>
        <a href="#">Contact Us</a>
      </div>

      <div className="col">
        <h4>My Account</h4>
        <a href="#">Sign In</a>
        <a href="#">View Cart</a>
        <a href="#">My Wishlist</a>
        <a href="#">Track My Order</a>
        <a href="#">Help</a>
      </div>

      <div className="col install">
        <h4>Install App</h4>
        <p>From App Store or Google Play</p>
        <div className="row">
          <img src={`${import.meta.env.BASE_URL}img/pay/app.jpg`} alt="" />
          <img src={`${import.meta.env.BASE_URL}img/pay/play.jpg`} alt="" />
        </div>
      </div>
    </footer>
  );
}
