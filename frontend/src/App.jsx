import React, { useEffect } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/userActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";
import Login from "./Components/users/Login";
import Register from "./Components/users/Register";
import Cart from "./Components/cart/Cart";
import AdminDashboard from "./Components/AdminDashboard";
import Chatbot from "./Components/layout/Chatbot";
import OrderSuccess from "./Components/cart/OrderSuccess";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);


  return (
    <>
      <ToastContainer />
      <Router>
        <div className="App">
          <Header />
          <div className="container-fluid px-3 px-md-5">
            <Routes>
              <Route path="/" element={<Home />} exact />
              <Route
                path="/eats/stores/search/:keyword"
                element={<Home />}
                exact
              />
              <Route path="/eats/stores/:id/menus" element={<Menu />} />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/signup" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/success" element={<OrderSuccess />} />

            </Routes>
          </div>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </>
  );
}

export default App;
