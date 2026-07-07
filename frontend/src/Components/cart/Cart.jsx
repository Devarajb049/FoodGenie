import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faTrash, faMinus, faPlus, faShoppingBag, faCreditCard, faMobileAlt, faArrowRight, faTruck, faPercent } from "@fortawesome/free-solid-svg-icons";
import { fetchCartItems, updateCartQuantity, removeItemFromCart } from "../../redux/actions/cartActions";
import api from "../../utils/api";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems, loading, restaurant } = useSelector((state) => state.cart || { cartItems: [], loading: false });
  const { isAuthenticated } = useSelector((state) => state.user || { isAuthenticated: false });

  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [upiId, setUpiId] = React.useState("");
  const [showUpiModal, setShowUpiModal] = React.useState(false);
  const [payingUpi, setPayingUpi] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCartItems());
  }, [dispatch, isAuthenticated]);

  const increaseQty = (id, quantity, stock) => {
    if (quantity < stock) dispatch(updateCartQuantity(id, quantity + 1));
    else toast.warn("Stock limit reached!");
  };

  const decreaseQty = (id, quantity) => {
    if (quantity > 1) dispatch(updateCartQuantity(id, quantity - 1));
    else { dispatch(removeItemFromCart(id)); toast.info("Item removed from cart."); }
  };

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
    toast.success("Item removed from cart!");
  };

  const subTotal = cartItems.reduce((acc, item) => acc + (item.foodItem?.price || 0) * item.quantity, 0);
  const deliveryFee = subTotal > 0 ? 55 : 0;
  const gst = parseFloat((subTotal * 0.05).toFixed(2));
  const finalTotal = subTotal + deliveryFee + gst;

  const checkoutHandler = async () => {
    if (paymentMethod === "card") {
      try {
        toast.info("Redirecting to Stripe payment...");
        const { data } = await api.post("/v1/payment/process", { items: cartItems });
        if (data?.url) window.location.href = data.url;
        else toast.error("Failed to generate payment session.");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Checkout failed");
      }
    } else {
      setShowUpiModal(true);
    }
  };

  const handleUpiPaymentSubmit = (e) => {
    e.preventDefault();
    if (!upiId) { toast.error("Please enter a valid UPI ID"); return; }
    setPayingUpi(true);
    setTimeout(() => {
      setPayingUpi(false);
      setShowUpiModal(false);
      toast.success("Payment Received Successfully!");
      window.location.href = `/success?session_id=upi_${Date.now()}`;
    }, 2500);
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "80vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontWeight: "800", color: "#F1F5F9", marginBottom: "8px" }}>Please Log In</h2>
        <p style={{ color: "#94A3B8", marginBottom: "24px" }}>You need to be logged in to view your cart.</p>
        <Link to="/users/login" style={{
          background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
          color: "white", fontWeight: "700", borderRadius: "30px",
          border: "none", textDecoration: "none", padding: "12px 32px",
          boxShadow: "0 4px 15px rgba(255,87,34,0.3)"
        }}>
          Log In &nbsp;<FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "80vh",
      background: "linear-gradient(160deg, #0F172A 0%, #1A2235 50%, #0D1B2A 100%)",
      padding: "40px 16px",
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div className="container-lg">
        {loading ? (
          <Loader />
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <div style={{ fontSize: "5rem", marginBottom: "16px" }}>🛒</div>
            <h2 style={{ fontWeight: "800", color: "#F1F5F9", marginBottom: "8px" }}>Your Cart is Empty</h2>
            <p style={{ color: "#94A3B8", marginBottom: "28px" }}>Add some delicious dishes to satisfy your cravings!</p>
            <Link to="/" style={{
              background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              color: "white", fontWeight: "700", borderRadius: "30px",
              textDecoration: "none", padding: "12px 32px",
              boxShadow: "0 4px 15px rgba(255,87,34,0.3)", display: "inline-block"
            }}>
              Browse Restaurants &nbsp;<FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{
                fontWeight: "900", fontSize: "2rem", color: "#F1F5F9",
                marginBottom: "4px", letterSpacing: "-0.5px"
              }}>
                <FontAwesomeIcon icon={faShoppingBag} style={{ color: "#FF5722", marginRight: "12px" }} />
                Your Cart
              </h1>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                {cartItems.length} item{cartItems.length > 1 ? "s" : ""} · {restaurant?.name || "FoodGenie"}
              </p>
            </div>

            <div className="row g-4">
              {/* LEFT: Cart Items */}
              <div className="col-12 col-lg-7">
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {cartItems.map((item) => {
                    const f = item.foodItem;
                    if (!f) return null;
                    return (
                      <div key={f._id} style={{
                        background: "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        transition: "all 0.2s"
                      }}>
                        {/* Food Image */}
                        <img
                          src={f.images?.[0]?.url || "/images/placeholder.png"}
                          alt={f.name}
                          style={{
                            width: "86px", height: "86px", objectFit: "cover",
                            borderRadius: "14px", flexShrink: 0,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                          }}
                        />

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h5 style={{
                            fontWeight: "700", fontSize: "0.95rem",
                            color: "#F1F5F9", margin: "0 0 4px 0",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                          }}>{f.name}</h5>
                          <span style={{ fontWeight: "800", fontSize: "1rem", color: "#FF7043" }}>
                            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" style={{ marginRight: "3px" }} />
                            {f.price}
                          </span>
                          <div style={{ color: "#64748B", fontSize: "0.75rem", marginTop: "2px" }}>
                            per item · subtotal &nbsp;
                            <span style={{ color: "#CBD5E1", fontWeight: "700" }}>
                              ₹{f.price * item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Qty Controls */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "40px", padding: "6px 14px"
                        }}>
                          <button
                            onClick={() => decreaseQty(f._id, item.quantity)}
                            style={{
                              background: "rgba(255,87,34,0.15)", border: "none",
                              color: "#FF7043", width: "28px", height: "28px",
                              borderRadius: "50%", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.8rem", fontWeight: "bold", transition: "all 0.15s"
                            }}
                          >
                            <FontAwesomeIcon icon={faMinus} size="xs" />
                          </button>
                          <span style={{ color: "#F1F5F9", fontWeight: "800", fontSize: "0.9rem", minWidth: "18px", textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(f._id, item.quantity, f.stock)}
                            style={{
                              background: "rgba(255,87,34,0.15)", border: "none",
                              color: "#FF7043", width: "28px", height: "28px",
                              borderRadius: "50%", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.8rem", fontWeight: "bold", transition: "all 0.15s"
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} size="xs" />
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeCartItemHandler(f._id)}
                          style={{
                            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#EF4444", width: "36px", height: "36px",
                            borderRadius: "10px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all 0.15s"
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="col-12 col-lg-5">
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "28px",
                  position: "sticky",
                  top: "90px"
                }}>
                  <h3 style={{ fontWeight: "800", color: "#F1F5F9", fontSize: "1.2rem", marginBottom: "20px" }}>
                    Order Summary
                  </h3>

                  {/* Price Breakdown */}
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "16px",
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}>
                    {[
                      { icon: faShoppingBag, label: "Subtotal", value: subTotal },
                      { icon: faTruck, label: "Delivery", value: deliveryFee },
                      { icon: faPercent, label: "GST (5%)", value: gst },
                    ].map(({ icon, label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94A3B8", fontSize: "0.87rem" }}>
                          <FontAwesomeIcon icon={icon} size="xs" style={{ opacity: 0.6 }} />
                          {label}
                        </div>
                        <span style={{ fontWeight: "600", color: "#CBD5E1", fontSize: "0.87rem" }}>
                          ₹{value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 16px",
                    background: "linear-gradient(135deg, rgba(255,87,34,0.15) 0%, rgba(255,112,67,0.08) 100%)",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,87,34,0.25)",
                    marginBottom: "24px"
                  }}>
                    <span style={{ fontWeight: "800", color: "#F1F5F9", fontSize: "1rem" }}>Total Payable</span>
                    <span style={{ fontWeight: "900", color: "#FF7043", fontSize: "1.3rem" }}>
                      ₹{finalTotal}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <h5 style={{ fontWeight: "700", color: "#94A3B8", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                    Payment Method
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                    {[
                      { value: "card", icon: faCreditCard, title: "Credit / Debit Card", sub: "Secure via Stripe" },
                      { value: "upi", icon: faMobileAlt, title: "UPI", sub: "GPay / PhonePe / BHIM" },
                    ].map(({ value, icon, title, sub }) => (
                      <label key={value} onClick={() => setPaymentMethod(value)} style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "14px 16px",
                        borderRadius: "14px",
                        border: paymentMethod === value
                          ? "2px solid #FF7043"
                          : "1.5px solid rgba(255,255,255,0.08)",
                        background: paymentMethod === value
                          ? "rgba(255,87,34,0.12)"
                          : "rgba(255,255,255,0.03)",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}>
                        <input type="radio" name="pay" value={value} checked={paymentMethod === value}
                          onChange={() => setPaymentMethod(value)}
                          style={{ display: "none" }} />
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: paymentMethod === value ? "rgba(255,87,34,0.2)" : "rgba(255,255,255,0.06)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: paymentMethod === value ? "#FF7043" : "#64748B",
                          flexShrink: 0
                        }}>
                          <FontAwesomeIcon icon={icon} />
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", color: "#E2E8F0", fontSize: "0.88rem" }}>{title}</div>
                          <div style={{ color: "#64748B", fontSize: "0.73rem" }}>{sub}</div>
                        </div>
                        {paymentMethod === value && (
                          <div style={{
                            marginLeft: "auto", width: "20px", height: "20px",
                            borderRadius: "50%", background: "#FF7043",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontSize: "0.65rem", fontWeight: "bold"
                          }}>✓</div>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={checkoutHandler}
                    style={{
                      width: "100%", padding: "16px",
                      background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                      color: "white", fontWeight: "800", fontSize: "1rem",
                      borderRadius: "14px", border: "none",
                      boxShadow: "0 8px 24px rgba(255,87,34,0.35)",
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                      letterSpacing: "0.3px"
                    }}
                  >
                    Proceed to Checkout &nbsp;<FontAwesomeIcon icon={faArrowRight} />
                  </button>

                  <p style={{ textAlign: "center", color: "#475569", fontSize: "0.72rem", marginTop: "12px" }}>
                    🔒 Secured checkout · Encrypted payment
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* UPI Modal */}
      {showUpiModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100000, padding: "16px"
        }}>
          <div style={{
            background: "linear-gradient(160deg, #1E293B 0%, #0F172A 100%)",
            borderRadius: "28px", width: "100%", maxWidth: "400px",
            padding: "36px 32px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            position: "relative", textAlign: "center"
          }}>
            <button onClick={() => setShowUpiModal(false)} style={{
              position: "absolute", top: "16px", right: "16px",
              border: "none", background: "rgba(255,255,255,0.08)",
              color: "#94A3B8", width: "32px", height: "32px",
              borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem"
            }}>✕</button>

            <div style={{
              width: "64px", height: "64px", borderRadius: "18px",
              background: "linear-gradient(135deg, #10B981, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: "1.8rem",
              boxShadow: "0 8px 20px rgba(16,185,129,0.3)"
            }}>📱</div>

            <h3 style={{ fontWeight: "800", color: "#F1F5F9", fontSize: "1.3rem", marginBottom: "6px" }}>
              Pay via UPI
            </h3>
            <p style={{ fontSize: "0.83rem", color: "#64748B", marginBottom: "24px" }}>
              Opens your UPI app with the amount pre-filled
            </p>

            <a
              href={`upi://pay?pa=bhojanapudevaraj-1@oksbi&pn=Payment&am=${finalTotal}&cu=INR`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                width: "100%", padding: "16px",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "white", fontWeight: "800", borderRadius: "14px",
                textDecoration: "none", marginBottom: "20px",
                boxShadow: "0 6px 20px rgba(16,185,129,0.3)",
                fontSize: "1rem"
              }}
            >
              🚀 Pay ₹{finalTotal} via UPI
            </a>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
              <p style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: "12px" }}>
                After paying, enter your UPI ID to confirm:
              </p>
              <form onSubmit={handleUpiPaymentSubmit}>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. name@okaxis"
                  required
                  style={{
                    width: "100%", padding: "12px 16px", marginBottom: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px", color: "#F1F5F9",
                    fontSize: "0.9rem", textAlign: "center",
                    outline: "none"
                  }}
                />
                <button type="submit" disabled={payingUpi} style={{
                  width: "100%", padding: "13px",
                  background: payingUpi ? "#374151" : "rgba(255,87,34,0.15)",
                  border: "1px solid rgba(255,87,34,0.3)",
                  color: "#FF7043", fontWeight: "700", borderRadius: "12px",
                  cursor: payingUpi ? "not-allowed" : "pointer", fontSize: "0.9rem"
                }}>
                  {payingUpi ? "⏳ Verifying..." : "Confirm Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
