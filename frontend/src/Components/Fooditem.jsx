import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { addItemToCart, updateCartQuantity, removeItemFromCart } from "../redux/actions/cartActions";
import { toast } from "react-toastify";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  
  // Get cartItems from Redux state
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  // Get user auth state
  const { isAuthenticated } = useSelector((state) => state.user || { isAuthenticated: false });

  // Find if this item is in the cart
  const cartItem = cartItems.find((item) => {
    const itemId = typeof item.foodItem === "object" ? item.foodItem._id : item.foodItem;
    return itemId === fooditem._id;
  });

  const quantity = cartItem ? cartItem.quantity : 0;
  const showButtons = quantity > 0;

  // Add button click
  const addToCartHandler = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }
    dispatch(addItemToCart(fooditem._id, restaurant, 1));
    toast.success(`${fooditem.name} added to cart!`);
  };

  // Increase quantity
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      dispatch(updateCartQuantity(fooditem._id, quantity + 1));
    } else {
      toast.warn("Stock limit reached!");
    }
  };

  // Decrease quantity
  const decreaseQty = () => {
    if (quantity > 1) {
      dispatch(updateCartQuantity(fooditem._id, quantity - 1));
    } else {
      dispatch(removeItemFromCart(fooditem._id));
      toast.info(`${fooditem.name} removed from cart.`);
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 my-3 d-flex align-items-stretch">
      <div 
        className="card fooditem-card d-flex flex-row p-3 align-items-center justify-content-between" 
        style={{
          width: "100%",
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.07)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
          background: "#fff",
          gap: "12px",
          transition: "all 0.3s ease",
          position: "relative"
        }}
      >
        {/* Left Side: Details */}
        <div className="d-flex flex-column justify-content-between flex-grow-1" style={{ height: "100%", minWidth: 0 }}>
          <div>
            <h5 style={{ 
              fontWeight: "700", 
              fontSize: "0.98rem", 
              color: "#1E1E24", 
              margin: "0 0 6px 0", 
              textOverflow: "ellipsis", 
              overflow: "hidden", 
              whiteSpace: "nowrap" 
            }}>
              {fooditem.name}
            </h5>
            <p style={{ 
              fontSize: "0.78rem", 
              color: "#666", 
              lineHeight: "1.4", 
              margin: "0 0 12px 0", 
              display: "-webkit-box", 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: "vertical", 
              overflow: "hidden", 
              height: "3.2em" 
            }}>
              {fooditem.description}
            </p>
          </div>
          
          <div className="d-flex align-items-center justify-content-between">
            <span style={{ fontWeight: "800", fontSize: "1.05rem", color: "#FF5722" }}>
              <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" style={{ marginRight: "4px" }} />
              {fooditem.price}
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: "600" }} className={fooditem.stock > 0 ? "text-success" : "text-danger"}>
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Right Side: Image and Add Button Container */}
        <div style={{ position: "relative", width: "110px", height: "110px", flexShrink: 0 }}>
          <img
            src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
            alt={fooditem.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
          />
          
          {/* Button Overlap container */}
          <div style={{ position: "absolute", bottom: "-8px", right: "-8px" }}>
            {!showButtons ? (
              <button
                type="button"
                disabled={fooditem.stock === 0}
                onClick={addToCartHandler}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#1E1E24",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                className="add-to-cart-plus"
              >
                +
              </button>
            ) : (
              <div className="d-flex align-items-center" style={{
                background: "#1E1E24",
                padding: "3px",
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}>
                <button
                  onClick={decreaseQty}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "transparent",
                    color: "white",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  -
                </button>
                <span style={{ color: "white", fontSize: "0.8rem", fontWeight: "700", padding: "0 6px" }}>
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "transparent",
                    color: "white",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;