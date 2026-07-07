import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/eats/stores/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={searchHandler} className="search-form">
      <div className="search-input-wrapper">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Search your favorite restaurant..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" id="search_btn">
          <i className="fa fa-search" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
};

export default Search;
