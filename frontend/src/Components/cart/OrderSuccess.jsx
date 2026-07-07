import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear cart in Redux state upon successful checkout
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="container py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
      <div className="card p-5 text-center" style={{
        maxWidth: "500px",
        background: "#FFFFFF",
        borderRadius: "24px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.03)"
      }}>
        {/* Success Icon */}
        <div className="mb-4" style={{ color: "#10B981" }}>
          <FontAwesomeIcon icon={faCheckCircle} size="5x" className="animate-bounce" />
        </div>

        <h1 style={{ fontWeight: "900", color: "#1E1E24", fontSize: "2rem" }} className="mb-3">
          Order Confirmed!
        </h1>
        
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
          Thank you for ordering with <strong>Food Genie</strong>. Your payment was processed successfully, and the kitchen has started preparing your meal!
        </p>

        {sessionId && (
          <div className="p-3 mb-4 text-left" style={{
            background: "#F3F4F6",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            fontSize: "0.78rem",
            color: "#4B5563"
          }}>
            <span style={{ fontWeight: "700", display: "block", marginBottom: "4px" }}>Transaction Reference:</span>
            <code style={{ wordBreak: "break-all", color: "#2563EB" }}>{sessionId}</code>
          </div>
        )}

        <div className="d-flex flex-column gap-3 w-100" style={{ gap: "12px" }}>
          <Link 
            to="/" 
            className="btn py-2.5 w-100 text-white" 
            style={{
              background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              fontWeight: "700",
              borderRadius: "12px",
              border: "none",
              textDecoration: "none"
            }}
          >
            Order More Food
          </Link>
          
          <Link 
            to="/" 
            className="btn btn-outline-dark py-2.5 w-100" 
            style={{
              fontWeight: "700",
              borderRadius: "12px"
            }}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
