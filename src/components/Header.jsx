import React from "react";
import "./Header.css";

function Header({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">💰</div>
          <h1 className="logo-text">Crypto & Finance Dashboard</h1>
        </div>
        <button
          className={`refresh-btn ${isRefreshing ? "refreshing" : ""}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <span className="refresh-icon">⟳</span>
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
    </header>
  );
}

export default Header;
