import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import "./ChartModal.css";

function ChartModal({ crypto, onClose }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, [crypto, timeframe]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch historical data from CoinGecko
      const days =
        timeframe === "1"
          ? 1
          : timeframe === "7"
          ? 7
          : timeframe === "30"
          ? 30
          : 365;
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart?vs_currency=usd&days=${days}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const data = await response.json();

      // Format data untuk chart
      const formattedData = data.prices.map((price, index) => ({
        date: new Date(price[0]).toLocaleDateString(),
        price: price[1],
        volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0,
        timestamp: price[0],
      }));

      setChartData(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-price">
            Price: {formatPrice(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="tooltip-volume">
              Volume: {formatVolume(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getPriceChange = () => {
    if (chartData.length < 2) return 0;
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const priceChange = getPriceChange();
  const isPositive = priceChange >= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="crypto-title">
            <img src={crypto.image} alt={crypto.name} className="modal-icon" />
            <div>
              <h2>{crypto.name}</h2>
              <span className="modal-symbol">
                {crypto.symbol.toUpperCase()}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="price-info">
          <div className="current-price">
            {formatPrice(crypto.current_price)}
          </div>
          <div
            className={`price-change ${isPositive ? "positive" : "negative"}`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}% (
            {timeframe} days)
          </div>
        </div>

        <div className="timeframe-buttons">
          <button
            className={`time-btn ${timeframe === "1" ? "active" : ""}`}
            onClick={() => setTimeframe("1")}
          >
            1D
          </button>
          <button
            className={`time-btn ${timeframe === "7" ? "active" : ""}`}
            onClick={() => setTimeframe("7")}
          >
            7D
          </button>
          <button
            className={`time-btn ${timeframe === "30" ? "active" : ""}`}
            onClick={() => setTimeframe("30")}
          >
            30D
          </button>
          <button
            className={`time-btn ${timeframe === "365" ? "active" : ""}`}
            onClick={() => setTimeframe("365")}
          >
            1Y
          </button>
        </div>

        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <p>Loading chart data...</p>
            </div>
          ) : error ? (
            <div className="chart-error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchChartData}>
                Retry
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  tickFormatter={formatPrice}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  tickFormatter={formatVolume}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: "white" }}
                  formatter={(value) => (
                    <span style={{ color: "white" }}>{value}</span>
                  )}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  name="Price"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Volume"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="additional-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Market Cap</span>
              <span className="info-value">
                ${(crypto.market_cap / 1e9).toFixed(2)}B
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">24h Volume</span>
              <span className="info-value">
                ${(crypto.total_volume / 1e9).toFixed(2)}B
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Circulating Supply</span>
              <span className="info-value">
                {crypto.circulating_supply?.toLocaleString()}{" "}
                {crypto.symbol.toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">All Time High</span>
              <span className="info-value">{formatPrice(crypto.ath)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartModal;
