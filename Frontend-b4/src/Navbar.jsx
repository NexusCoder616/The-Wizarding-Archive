import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
  return (
    <header className="hdr">
      <div className="hdr-branding">
        <Link to="/" className="logo">
          <span className="logo-icon">⚡</span> The Wizarding Archive
        </Link>
        <p className="tagline">A catalogue of every witch and wizard</p>
      </div>
      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}>
          Home
        </NavLink>
        
        {token && (
          <NavLink to="/characters" className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}>
            Archive
          </NavLink>
        )}

        <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}>
          About
        </NavLink>

        {!token ? (
          <>
            <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}>
              Register
            </NavLink>
          </>
        ) : (
          <button onClick={onLogout} className="nav-btn-logout">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
