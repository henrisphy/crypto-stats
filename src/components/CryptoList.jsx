import React from "react";
import CryptoCard from "./CryptoCard";
import "./CryptoList.css";

function CryptoList({ cryptoData, loading, error }) {
  if (loading) {
    return (
      <div className="crypto-list">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="crypto-card skeleton">
            <div className="skeleton-content">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (cryptoData.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-icon">🔍</div>
        <h3>No cryptocurrencies found</h3>
        <p>Try searching with a different name</p>
      </div>
    );
  }

  return (
    <div className="crypto-list">
      {cryptoData.map((crypto, index) => (
        <CryptoCard key={crypto.id} crypto={crypto} rank={index + 1} />
      ))}
    </div>
  );
}

export default CryptoList;
