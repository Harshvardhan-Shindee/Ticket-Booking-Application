import './Header.css';
import logo from '../assets/img/pic.webp'; // Correct path as import

function Header() {
  return (
    <header className="header-container">
      <div className="scrolling-image">
        <img src={logo} alt="header" />
      </div>
    </header>
  );
}

export default Header;
