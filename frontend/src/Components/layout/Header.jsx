import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/userActions";
import Search from "./Search";
import "../../index.css";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user || { user: null, isAuthenticated: false });
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* Top Tagline Announcement Bar */}
      <div style={{
        background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
        color: "white",
        fontSize: "0.82rem",
        fontWeight: "600",
        textAlign: "center",
        padding: "6px 0",
        letterSpacing: "0.5px"
      }}>
        ✨ Feast Your Senses, Fast and Fresh — Lightning-fast food delivery to your doorstep! ✨
      </div>
      <nav className="navbar sticky-top">
        <div className="container-fluid px-3 px-md-5 d-flex flex-wrap align-items-center justify-content-between w-100">
          {/* logo */}
          <div className="col-12 col-md-3 d-flex align-items-center justify-content-center justify-content-md-start p-0">
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.svg" alt="logo" className="logo" style={{ height: "40px", width: "auto" }} />
            </Link>
          </div>

          {/* search bar and search icon */}
          <div className="col-12 col-md-6 mt-2 mt-md-0 p-0">
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/eats/stores/search/:keyword" element={<Search />} />
            </Routes>
          </div>

          {/* Login & Cart */}
          <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex align-items-center justify-content-center justify-content-md-end p-0" style={{ gap: "20px" }}>
            <Link to="/admin/dashboard" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              <span style={{ color: "#FF5722", fontSize: "0.9rem", fontWeight: "700" }}>AI Dashboard</span>
            </Link>
            <Link to="/cart" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              <i className="fa fa-shopping-cart" aria-hidden="true" style={{ color: "#FF5722", fontSize: "1.3rem", marginRight: "6px" }}></i>
              <span id="cart" style={{ color: "#333333", fontSize: "1.05rem", fontWeight: "600" }}>
                Cart
              </span>
              <span id="cart_count" style={{
                marginLeft: "6px",
                backgroundColor: "#FF5722",
                color: "white",
                borderRadius: "50%",
                padding: "2px 8px",
                fontSize: "0.75rem",
                fontWeight: "700"
              }}>
                {cartItems.length}
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#333" }}>
                  {user && user.name}
                </span>
                <button 
                  onClick={logoutHandler}
                  className="btn py-1 px-3"
                  style={{
                    backgroundColor: "#1E1E24",
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    border: "none"
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/users/login" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                <i className="fa fa-user-circle-o web_logo" aria-hidden="true" style={{ fontSize: "1.6rem", color: "#666" }}></i>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;