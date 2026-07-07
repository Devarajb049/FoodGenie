import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, clearErrors } from "../../redux/actions/userActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector((state) => state.user || { isAuthenticated: false });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Successfully registered and logged in!");
      navigate("/");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !passwordConfirm || !phoneNumber) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
      avatar: {
        public_id: "avatar_id",
        url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
      }
    };

    dispatch(register(userData));
  };

  return (
    <div className="row justify-content-center mt-5" style={{ minHeight: "75vh", alignItems: "center" }}>
      <div className="col-12 col-md-6 col-lg-5">
        {loading ? (
          <Loader />
        ) : (
          <form 
            onSubmit={submitHandler} 
            className="p-4 p-md-5" 
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}
          >
            <h2 className="mb-4 text-center" style={{ fontWeight: "800", color: "#1E1E24" }}>
              Join Food Genie
            </h2>
            <p className="text-muted text-center mb-4" style={{ fontSize: "0.85rem" }}>
              Create an account to start ordering delicious meals
            </p>

            <div className="form-group mb-3">
              <label htmlFor="name_field" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4B5563", marginBottom: "6px", display: "block" }}>
                Full Name
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "0.9rem",
                  border: "1.5px solid #E5E7EB",
                  outline: "none"
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email_field" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4B5563", marginBottom: "6px", display: "block" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "0.9rem",
                  border: "1.5px solid #E5E7EB",
                  outline: "none"
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone_field" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4B5563", marginBottom: "6px", display: "block" }}>
                Phone Number (10 Digits)
              </label>
              <input
                type="text"
                id="phone_field"
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "0.9rem",
                  border: "1.5px solid #E5E7EB",
                  outline: "none"
                }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password_field" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4B5563", marginBottom: "6px", display: "block" }}>
                Password (min. 8 characters)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password_field"
                  className="form-control"
                  style={{
                    borderRadius: "10px",
                    padding: "10px 40px 10px 14px",
                    fontSize: "0.9rem",
                    border: "1.5px solid #E5E7EB",
                    outline: "none",
                    width: "100%"
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password_confirm_field" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4B5563", marginBottom: "6px", display: "block" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirm_field"
                  className="form-control"
                  style={{
                    borderRadius: "10px",
                    padding: "10px 40px 10px 14px",
                    fontSize: "0.9rem",
                    border: "1.5px solid #E5E7EB",
                    outline: "none",
                    width: "100%"
                  }}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block w-100 py-3 mb-3"
              style={{
                background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                color: "white",
                fontWeight: "700",
                fontSize: "0.95rem",
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 15px rgba(255, 87, 34, 0.2)",
                transition: "all 0.2s ease"
              }}
            >
              Sign Up
            </button>

            <div className="text-center mt-3">
              <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                Already have an account?{" "}
              </span>
              <Link to="/users/login" style={{ color: "#FF5722", fontWeight: "700", textDecoration: "none", fontSize: "0.82rem" }}>
                Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
