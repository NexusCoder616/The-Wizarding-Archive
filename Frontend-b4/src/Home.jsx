import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* ── Editorial Hero ── */}
      <section className="hero-section">
        <span className="hero-sub">Collection I / 2026</span>
        <h2 className="hero-title">
          Where magic meets <br />
          <em>form & record.</em>
        </h2>
        <p className="hero-copy">
          A meticulously curated index documenting the names, houses, and wand profiles of the wizarding world's most notable figures. Designed for the modern scholar.
        </p>
        <button className="editorial-btn" onClick={() => navigate("/characters")}>
          Explore the Archive
        </button>
      </section>

      {/* ── Feature Rows/Grid ── */}
      <section className="features-grid">
        <div className="feature-block" onClick={() => navigate("/characters")}>
          <div className="feature-img-wrapper">
            <div className="feature-img placeholder-house-gryffindor">⚡</div>
          </div>
          <h3 className="feature-title">The Four Houses</h3>
          <p className="feature-desc">Filter archives by Gryffindor, Slytherin, Ravenclaw, and Hufflepuff.</p>
        </div>
      </section>
    </div>
  );
}
