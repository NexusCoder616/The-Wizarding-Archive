import React from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <section className="about-content">
        <span className="about-sub">The Philosophy</span>
        <h2 className="about-title">Preserving Wizarding Heritage</h2>
        <div className="about-body-text">
          <p>
            The Wizarding Archive was established in 2026 as a digital conservatory. We believe that history is not merely a collection of dates, but a lineage of personalities, house allegiances, and custom wandcraft.
          </p>
          <p>
            Our database connects directly to local ministries and registry endpoints to retrieve authenticated profiles. Every entry is displayed in its purest form, devoid of noise, color, or distraction.
          </p>
        </div>
        <button className="editorial-btn" onClick={() => navigate("/characters")}>
          Return to Registry
        </button>
      </section>
    </div>
  );
}
