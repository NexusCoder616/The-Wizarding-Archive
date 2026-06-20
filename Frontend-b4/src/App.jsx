import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Characters from "./Characters";
import About from "./About";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("Logged out successfully");
  };

  // Unauthenticated shell: Show branding header and Login/Register page
  if (!token) {
    return (
      <Router>
        <div className="shell-auth">
          <header className="hdr-auth">
            <div className="hdr-branding">
              <div className="logo">
                <span className="logo-icon">⚡</span> The Wizarding Archive
              </div>
              <p className="tagline">A catalogue of every witch and wizard</p>
            </div>
          </header>
          <main className="main-auth">
            <Routes>
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }

  // Authenticated shell: Show full website with navbar and footer
  return (
    <Router>
      <div className="shell">
        <Navbar token={token} onLogout={handleLogout} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<Characters token={token} />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Navigate to="/characters" replace />} />
            <Route path="/register" element={<Navigate to="/characters" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="ftr">
          <p>© {new Date().getFullYear()} The Wizarding Archive</p>
        </footer>
      </div>
    </Router>
  );
}