import React, { useState } from "react";
import ChartModal from "./ChartModal";
import "./CryptoCard.css";

function CryptoCard({ crypto, rank }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const priceChange = crypto.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  const formatPrice = (price) => {
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    if (price < 1000000) return `$${price.toLocaleString()}`;
    return `$${(price / 1000000).toFixed(2)}M`;
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className={`crypto-card ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="card-header">
          <div className="rank">#{rank}</div>
          <div className="crypto-info">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="crypto-icon"
              loading="lazy"
            />
            <div>
              <h3 className="crypto-name">{crypto.name}</h3>
              <span className="crypto-symbol">
                {crypto.symbol.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="price-section">
            <div className="current-price">
              {formatPrice(crypto.current_price)}
            </div>
            <div
              className={`price-change ${isPositive ? "positive" : "negative"}`}
            >
              {isPositive ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}%
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Market Cap</div>
              <div className="stat-value">
                {formatMarketCap(crypto.market_cap)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">24h Volume</div>
              <div className="stat-value">
                {formatMarketCap(crypto.total_volume)}
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <div className="ath-info">
            <span className="ath-label">All Time High:</span>
            <span className="ath-value">{formatPrice(crypto.ath)}</span>
          </div>
          <div className="ath-change">
            {crypto.ath_change_percentage?.toFixed(2)}% from ATH
          </div>
        </div>

        <div className="chart-preview">
          <div className="preview-icon">📈</div>
          <span>Click to view detailed chart</span>
        </div>
      </div>

      {showModal && (
        <ChartModal crypto={crypto} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default CryptoCard;
