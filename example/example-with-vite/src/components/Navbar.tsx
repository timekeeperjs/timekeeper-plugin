import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        Navbar in Vite
      </div>
      <div className="navbar-right">
        <img src='/vite.svg' alt="Vite Logo" className="vite-logo" />
      </div>
    </nav>
  );
};

export default Navbar;