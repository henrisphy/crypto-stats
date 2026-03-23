import React from "react";
import "./Dashboard.css";

function Dashboard({ cryptoData, loading }) {
  if (loading || !cryptoData) {
    return (
      <div className="dashboard">
        <div className="dashboard-stats">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card skeleton">
              <div className="stat-label">Loading...</div>
              <div className="stat-value">---</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalMarketCap = cryptoData.reduce(
    (sum, crypto) => sum + crypto.market_cap,
    0
  );
  const totalVolume = cryptoData.reduce(
    (sum, crypto) => sum + crypto.total_volume,
    0
  );
  const avgChange =
    cryptoData.reduce(
      (sum, crypto) => sum + crypto.price_change_percentage_24h,
      0
    ) / cryptoData.length;
  const topGainer = cryptoData.reduce(
    (max, crypto) =>
      crypto.price_change_percentage_24h > max.price_change_percentage_24h
        ? crypto
        : max,
    cryptoData[0]
  );

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Market Cap</div>
          <div className="stat-value">{formatNumber(totalMarketCap)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">24h Volume</div>
          <div className="stat-value">{formatNumber(totalVolume)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. 24h Change</div>
          <div
            className={`stat-value ${avgChange >= 0 ? "positive" : "negative"}`}
          >
            {avgChange.toFixed(2)}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top Gainer</div>
          <div className="stat-value">{topGainer.name}</div>
          <div
            className={`stat-change ${
              topGainer.price_change_percentage_24h >= 0
                ? "positive"
                : "negative"
            }`}
          >
            {topGainer.price_change_percentage_24h.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
