import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3 } from 'lucide-react';
import StockForm from "./StockForm";
import StockTable from "./StockTable";
import PortfolioSummary from "./PortfolioSummary";
import { stockAPI } from "../services/api";

function App() {
  const [stocks, setStocks]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStocks(); }, []);
  useEffect(() => {
    if (stocks.length > 0) {
      updateStockPrices();
      const int = setInterval(updateStockPrices, 30000);
      return () => clearInterval(int);
    }
  }, [stocks.length]);

  const fetchStocks = async () => {
    try {
      const resp = await stockAPI.getAllStocks();
      setStocks(resp.data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }
  };

  const updateStockPrices = async () => {
    if (!stocks.length) return;
    try {
      const symbols = [...new Set(stocks.map(s => s.symbol))];
      const resp    = await stockAPI.getMultiplePrices(symbols);
      const priceData = resp.data;
      setStocks(prev =>
        prev.map(stock => {
          const p = priceData.find(x => x.symbol === stock.symbol);
          return { ...stock, currentPrice: p?.currentPrice ?? stock.currentPrice };
        })
      );
    } catch (err) {
      console.error('Error updating prices:', err);
    }
  };

  const addStock = async data => {
    setLoading(true);
    try {
      await stockAPI.addStock(data);
      await fetchStocks();
    } catch (err) {
      console.error('Error adding stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteStock = async id => {
    try {
      await stockAPI.deleteStock(id);
      setStocks(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting stock:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="w-full bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <Link to="/app" className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </Link>
              <Link to="/app">
                <h1 className="text-xl font-bold">Portfolio Tracker</h1>
                <p className="text-sm text-gray-400">
                  Track your stock investments in real-time
                </p>
              </Link>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <Link
                to="/app/trends"
                className="flex items-center hover:text-white transition"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Live Market Trends
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortfolioSummary stocks={stocks} />
        <StockForm onAddStock={addStock} />
        <StockTable stocks={stocks} onDeleteStock={deleteStock} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            <p>2025 Portfolio Tracker</p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
