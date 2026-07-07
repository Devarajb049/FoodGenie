import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMenus } from "../redux/actions/menuActions";
import Fooditem from "./Fooditem";
import Loader from "./layout/Loader";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { menus, loading, error } = useSelector((state) => state.menus);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedCategory("All");
  }, [id]);

  // Extract unique categories from menus
  const categoriesList = ["All"];
  if (Array.isArray(menus)) {
    menus.forEach((m) => {
      if (m.category && !categoriesList.includes(m.category)) {
        categoriesList.push(m.category);
      }
    });
  }

  // Filter menus based on selected category
  const filteredMenus = selectedCategory === "All"
    ? menus
    : menus.filter((m) => m.category === selectedCategory);

  console.log("Redux menus:", menus); // ✅ DEBUG

  return (
    <div className="container-fluid px-0 mt-4">
      {/* Back Button */}
      <div className="mb-4">
        <Link 
          to="/" 
          style={{ 
            borderRadius: "30px", 
            padding: "8px 24px", 
            fontSize: "0.85rem", 
            fontWeight: "600", 
            border: "1.5px solid #FF5722", 
            color: "#FF5722",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            transition: "all 0.2s ease"
          }}
          className="hover-orange-btn"
        >
          <i className="fa fa-arrow-left" aria-hidden="true" style={{ marginRight: "8px" }}></i>
          Back to Restaurants
        </Link>
      </div>

      {/* Category Navigation Tabs */}
      {!loading && !error && Array.isArray(menus) && menus.length > 0 && (
        <div className="category-tabs-container mb-4 pb-2 d-flex align-items-center flex-wrap" style={{
          borderBottom: "1px solid #E5E7EB",
          gap: "10px",
          paddingBottom: "12px"
        }}>
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  borderRadius: "30px",
                  padding: "8px 24px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  backgroundColor: isActive ? "#FF5722" : "#F3F4F6",
                  color: isActive ? "#FFFFFF" : "#4B5563",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? "0 4px 12px rgba(255, 87, 34, 0.25)" : "none",
                  outline: "none"
                }}
                className={`category-tab-btn ${isActive ? "active" : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      ) : Array.isArray(filteredMenus) && filteredMenus.length > 0 ? (
        filteredMenus.map((menu) => (
          <div key={menu._id} className="mb-5">
            <div className="d-flex align-items-center mb-3">
              <h3 
                style={{ 
                  fontWeight: "800", 
                  color: "#333", 
                  borderLeft: "4px solid #FF5722", 
                  paddingLeft: "12px", 
                  margin: 0, 
                  fontSize: "1.45rem",
                  letterSpacing: "0.5px"
                }}
              >
                {menu.category}
              </h3>
            </div>

            {Array.isArray(menu.items) && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <Fooditem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted">No items available in this category</p>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-5">
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>No menus available for this restaurant.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;