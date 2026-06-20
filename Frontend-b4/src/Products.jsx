import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Products({ handleAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category") || "all";
  const searchParam = queryParams.get("search") || "";

  useEffect(() => {
    Promise.all([
      fetch("https://fakestoreapi.com/products").then((res) => res.json()),
      fetch("https://fakestoreapi.com/products/categories").then((res) => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (catKey) => {
    const params = new URLSearchParams(location.search);
    if (catKey === "all") params.delete("category");
    else params.set("category", catKey);
    navigate(`/products?${params.toString()}`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "clothing" ? product.category.includes("clothing") : product.category === selectedCategory);

    const matchesSearch =
      !searchParam ||
      product.title.toLowerCase().includes(searchParam.toLowerCase()) ||
      product.category.toLowerCase().includes(searchParam.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="catalog">
      <aside className="sidebar">
        <h3>CATEGORIES</h3>
        <button className={selectedCategory === "all" ? "active" : ""} onClick={() => handleCategoryChange("all")}>
          ALL PRODUCTS
        </button>
        {categories.map((cat) => {
          const val = cat.includes("clothing") ? "clothing" : cat;
          const isActive = selectedCategory === val || (selectedCategory === "clothing" && cat.includes("clothing"));
          return (
            <button key={cat} className={isActive ? "active" : ""} onClick={() => handleCategoryChange(val)}>
              {cat.toUpperCase()}
            </button>
          );
        })}
      </aside>

      <main className="main-content">
        <div className="catalog-header">
          <h2>{selectedCategory.toUpperCase()} PRODUCTS</h2>
          <span>{filteredProducts.length} ITEMS</span>
        </div>

        {loading && <div className="loading">LOADING...</div>}
        {error && <div className="error">ERROR: {error}</div>}

        {!loading && !error && (
          <div className="grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card">
                <div className="card-img">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="card-info">
                  <h4>{product.title}</h4>
                  <div className="card-meta">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <span className="rating">{product.rating?.rate} ★</span>
                  </div>
                  <button className="btn btn-sm" onClick={handleAddToCart}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;
