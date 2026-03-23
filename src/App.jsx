import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CryptoList from "./components/CryptoList";
import SearchBar from "./components/SearchBar";
import useCryptoData from "./hooks/useCryptoData";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const { cryptoData, loading, error, refreshData } = useCryptoData();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (cryptoData) {
      const filtered = cryptoData.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, cryptoData]);

  return (
    <div className="app">
      <Header onRefresh={refreshData} />
      <main className="main-content">
        <Dashboard cryptoData={cryptoData} loading={loading} />
        <div className="crypto-section">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CryptoList
            cryptoData={filteredData}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
