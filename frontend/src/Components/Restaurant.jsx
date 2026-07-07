import React, { useState } from "react";
import { Link } from "react-router-dom";

const Restaurant = ({ restaurant }) => {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-3 d-flex align-items-stretch">
      <div className="card restaurant-card">

        {/* Image Wrapper with overlay badge */}
        <div className="restaurant-image-wrapper">
          <Link to={`/eats/stores/${restaurant._id}/menus`}>
            <img
              className="restaurant-image"
              src={restaurant.images?.[0]?.url}
              alt={restaurant.name}
            />
          </Link>
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: restaurant.isVeg ? '#E8F5E9' : '#FFEBEE',
            color: restaurant.isVeg ? '#2E7D32' : '#C62828',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '700',
            fontSize: '0.72rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            pointerEvents: 'none'
          }}>
            <i className={`fa ${restaurant.isVeg ? 'fa-leaf' : 'fa-circle'}`} aria-hidden="true" style={{ marginRight: '4px' }}></i>
            {restaurant.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Restaurant Details */}
        <div className="restaurant-info">
          <h5 style={{ fontWeight: '700', margin: '0 0 4px 0', fontSize: '1.05rem', color: '#333' }}>
            {restaurant.name}
          </h5>

          <p className="rest_address mb-2" style={{ fontSize: '0.82rem', margin: 0 }}>
            <i className="fa fa-map-marker" aria-hidden="true" style={{ color: "#FF5722", marginRight: "4px" }}></i>
            {restaurant.address}
          </p>

          <div className="d-flex align-items-center justify-content-between mt-auto pt-2" style={{ borderTop: '1px solid #f5f5f5' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#4CAF50',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '0.8rem',
              gap: '3px'
            }}>
              <i className="fa fa-star" aria-hidden="true" style={{ fontSize: '0.75rem' }}></i> {restaurant.ratings}
            </span>
            <span className="text-muted small" style={{ fontSize: '0.8rem' }}>
              {restaurant.numOfReviews} Reviews
            </span>
          </div>

          <div className="mt-3">
            <Link to={`/eats/stores/${restaurant._id}/menus`} className="btn btn-primary w-100" style={{
              background: 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)',
              borderColor: '#FF5722',
              color: 'white',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '8px 16px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(255, 87, 34, 0.15)',
              transition: 'all 0.2s ease'
            }}>
              View Menu
              <i className="fa fa-chevron-right" aria-hidden="true" style={{ marginLeft: '8px', fontSize: '0.75rem' }}></i>
            </Link>
          </div>

          {restaurant.reviewSentiment && (
            <button
              className="ai-btn w-100 mt-2"
              onClick={() => setShowAI(!showAI)}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem'
              }}
            >
              {showAI ? (
                <>
                  <i className="fa fa-minus-circle" aria-hidden="true" style={{ marginRight: "4px" }}></i>
                  Hide Summary
                </>
              ) : (
                <>
                  <i className="fa fa-commenting" aria-hidden="true" style={{ marginRight: "4px" }}></i>
                  View Review Summary
                </>
              )}
            </button>
          )}
        </div>

        {/* Review Insights Dropdown Tray */}
        {showAI && (
          <div className="ai-insights-box">
            <div className="ai-status mb-2" style={{
              fontSize: '0.78rem',
              width: '100%',
              marginTop: 0,
              padding: '3px 8px'
            }}>
              <i className="fa fa-magic" aria-hidden="true" style={{ marginRight: "4px" }}></i>
              Summary: <strong>{restaurant.reviewSentiment}</strong>
            </div>

            <ul className="mb-2 pl-3" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
              {(restaurant.reviewSummaryBullets || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            <div className="mentions" style={{ marginTop: '8px' }}>
              {(restaurant.reviewTopMentions || []).map((item, index) => (
                <span
                  key={index}
                  className="mention-tag"
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    marginRight: '4px',
                    marginBottom: '4px'
                  }}
                >
                  #{item}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Restaurant;