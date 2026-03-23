export const formatNumber = (num) => {
  if (!num) return "N/A";

  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const formatPrice = (price) => {
  if (!price) return "N/A";
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString()}`;
};

export const formatPercentage = (value) => {
  if (!value) return "0.00%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};
