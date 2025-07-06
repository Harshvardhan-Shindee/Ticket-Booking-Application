import './Footer.css';

function Footer() {
  return (
    <div id="Footer">
      <div className="container">
        <div className="row">
          {/* Address */}
          <div className="col-lg-3 col-md-6">
            <h4>Address</h4>
            <p><i className="fa fa-map-marker-alt me-2"></i>123 Street, New York</p>
            <p><i className="fa fa-phone-alt me-2"></i>+012 345 67890</p>
            <p><i className="fa fa-envelope me-2"></i>info@example.com</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <h4>Services</h4>
            <a href="#">Air Freight</a>
            <a href="#">Sea Freight</a>
            <a href="#">Road Freight</a>
            <a href="#">Logistic Solutions</a>
          </div>

          {/* Links */}
          <div className="col-lg-3 col-md-6">
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Support</a>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h4>Newsletter</h4>
            <p>Subscribe for updates and news.</p>
            <div className="newsletter-form">
              <input type="text" placeholder="Your email" />
              <button type="button">Sign Up</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 BookMyShow. All Rights Reserved.</p>
          <p>Designed by <a href="https://htmlcodex.com">HTML Codex</a></p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
