import React from "react";

const Loader = () => {
  return (
    <div className="loader-container">
      <img src="/images/logo.svg" alt="loading..." className="loader-logo-pulsing" style={{ height: "60px", width: "auto" }} />
    </div>
  );
};

export default Loader;
