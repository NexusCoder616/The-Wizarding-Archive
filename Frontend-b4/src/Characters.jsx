import React, { useEffect, useState } from "react";

const HOUSES = ["All", "Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

export default function Characters({ token }) {
  const [characters, setCharacters] = useState([]);
  const [house, setHouse] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/v1/get/characters", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Server responded ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setCharacters(Array.isArray(data) ? data : data.characters || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const filtered =
    house === "All"
      ? characters
      : characters.filter(
          (c) => c.house?.toLowerCase() === house.toLowerCase()
        );

  return (
    <div className="characters-page">
      {/* ── filter bar ── */}
      <div className="bar">
        {HOUSES.map((h) => (
          <button
            key={h}
            className={`pill${house === h ? " pill--on" : ""}`}
            onClick={() => setHouse(h)}
          >
            {h}
          </button>
        ))}
      </div>

      {/* ── content ── */}
      {loading && (
        <div className="status">
          <div className="spinner" />
          <p>Summoning characters…</p>
        </div>
      )}

      {error && (
        <div className="status">
          <p className="err">⚠ {error}</p>
          <p className="err-sub">
            Make sure the backend is running on port 3001.
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="count">{filtered.length} characters</p>
          <div className="grid">
            {filtered.map((c) => (
              <article key={c._id} className="card">
                <div className="card-img">
                  {c.image ? (
                    <img
                      src={
                        c.image.startsWith("http")
                          ? c.image
                          : `http://localhost:3001/${c.image}`
                      }
                      alt={c.name}
                    />
                  ) : (
                    <span className="no-img">⚡</span>
                  )}
                </div>
                <div className="card-body">
                  <h2 className="card-name">{c.name}</h2>
                  {c.house && <span className="badge">{c.house}</span>}
                  {c.wand && <p className="wand">Wand — {c.wand}</p>}
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="empty">No characters found for "{house}".</p>
          )}
        </>
      )}
    </div>
  );
}
