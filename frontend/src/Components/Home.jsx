import React, { useEffect } from "react";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import { getRestaurants } from "../redux/actions/restaurantAction";

import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  // Get the restaurant data from redux
  const { loading: restaurantsLoading, error: restaurantsError, restaurants, showVegOnly } = useSelector((state) => state.restaurants);

  useEffect(() => {
    if (restaurantsError) {
      alert(restaurantsError);
      return;
    }
    dispatch(getRestaurants(keyword));
  }, [dispatch, restaurantsError, keyword]);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };

  return (
    <>
      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantsError}</Message>
      ) : (
        <>
          <section className="container-fluid px-0 mt-2">
            {/* HERO BANNER */}
            <div className="hero-banner mb-5" style={{
              background: "#03081F",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
            }}>
              <div className="row m-0 align-items-center">
                {/* Left Content */}
                <div className="col-12 col-lg-7 p-4 p-md-5 text-left d-flex flex-column justify-content-center" style={{ minHeight: "420px" }}>
                  <span style={{ color: "#FF5722", fontSize: "0.95rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Order Food
                  </span>
                  <h1 style={{ fontWeight: "900", fontSize: "3.2rem", color: "white", marginTop: "12px", lineHeight: "1.2" }}>
                    Feast Your Senses,<br />
                    <span style={{ color: "#FF5722" }}>Fast and Fresh</span>
                  </h1>
                </div>

                {/* Right Image */}
                <div className="col-12 col-lg-5 p-0 d-none d-lg-block" style={{
                  height: "420px",
                  background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                  position: "relative"
                }}>
                  <img
                    src="/images/hero_food.png"
                    alt="Feast Your Senses"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                  />
                  {/* Floating Badges */}
                  <div className="d-flex flex-column" style={{
                    position: "absolute",
                    top: "30px",
                    right: "20px",
                    gap: "10px",
                    pointerEvents: "none"
                  }}>
                    <div style={{ background: "white", borderRadius: "10px", padding: "8px 16px", fontSize: "0.75rem", fontWeight: "700", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#FF5722", fontWeight: "800" }}>1</span> Orders Received!
                    </div>
                    <div style={{ background: "white", borderRadius: "10px", padding: "8px 16px", fontSize: "0.75rem", fontWeight: "700", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#FF5722", fontWeight: "800" }}>2</span> Order Delivered!
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* RESTAURANTS HEADER & SORT */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 mt-5">
              <h3 style={{ fontWeight: "800", color: "#1E1E24", margin: 0, fontSize: "1.6rem" }}>
                Popular Restaurants ({restaurants?.filter(r => !showVegOnly || r.isVeg).length || 0})
              </h3>

              {/* SORT BUTTONS */}
              <div className="sort mb-0" style={{ gap: "10px" }}>
                <button className="sort_veg" onClick={handleToggleVegOnly} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  <i className="fa fa-leaf" aria-hidden="true" style={{ marginRight: '6px' }}></i>
                  {showVegOnly ? "Show All" : "Pure Veg"}
                </button>

                <button className="sort_rev" onClick={handleSortByReviews} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  <i className="fa fa-comments" aria-hidden="true" style={{ marginRight: '6px' }}></i>
                  Sort By Reviews
                </button>

                <button className="sort_rate" onClick={handleSortByRatings} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  <i className="fa fa-star" aria-hidden="true" style={{ marginRight: '6px' }}></i>
                  Sort By Ratings
                </button>
              </div>
            </div>

            {/* RESTAURANTS GRID */}
            <div className="row mt-4">
              {restaurants?.length > 0 ? (
                restaurants.map((restaurant) =>
                  !showVegOnly || restaurant.isVeg ? (
                    <Restaurant key={restaurant._id} restaurant={restaurant} />
                  ) : null
                )
              ) : (
                <Message variant="info">No restaurants Found.</Message>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;