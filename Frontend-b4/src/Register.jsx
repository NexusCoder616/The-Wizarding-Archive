import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(response.data.message || "Registration successful");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <span className="auth-sub">Registry Access</span>
        <h2 className="auth-title">Create Account</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Name"
              required
            />
          </div>

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
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
