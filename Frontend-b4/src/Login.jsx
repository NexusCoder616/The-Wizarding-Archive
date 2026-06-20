import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        if (onLoginSuccess) {
          onLoginSuccess(token);
        }
        alert(response.data.message || "Login successful");
        navigate("/characters");
      } else {
        throw new Error("No token returned from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <span className="auth-sub">Registry Access</span>
        <h2 className="auth-title">Account Login</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
            />
          </div>

          <button className="editorial-btn auth-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>

        <p className="auth-footer">
          New to the archive? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
