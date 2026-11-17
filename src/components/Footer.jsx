export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" />
              <path d="M19 10C19 13.3 16.3 16 13 16C9.7 16 7 13.3 7 10C7 6.7 9.7 4 13 4C16.3 4 19 6.7 19 10Z" />
              <path d="M12 18C14.2 18 16 16.2 16 14C16 13.4 15.7 12.9 15.2 12.4" />
              <path d="M8 14C8 16.2 9.8 18 12 18C12.6 17.5 13.1 16.9 13.4 16.2" />
            </svg>
            <span className="logo-text">Pawsome</span>
          </div>
          <p className="footer-tagline">Connecting loving homes with pets in need since 2024</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/pets">Browse Pets</a></li>
            <li><a href="/add-pet">List a Pet</a></li>
            <li><a href="/my-pets">My Pets</a></li>
            <li><a href="/pet-care">Care Guides</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Pet Types</h4>
          <ul className="footer-links">
            <li><a href="/pets?type=Dog">Dogs</a></li>
            <li><a href="/pets?type=Cat">Cats</a></li>
            <li><a href="/pets?type=Rabbit">Rabbits</a></li>
            <li><a href="/pets?type=Bird">Birds</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety Tips</a></li>
            <li><a href="#">Adoption Process</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 Pawsome. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="#" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
            <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  )
}