import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp } from 'lucide-react';
import { marketAPI } from '../services/api';

export default function LiveTrends() {
  const [symbols, setSymbols] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch market symbols
  useEffect(() => {
    async function loadSymbols() {
      try {
        const resp = await marketAPI.getSymbols();
        const allSymbols = resp.data.map(item => item.symbol);
        setSymbols(allSymbols.slice(0, 50));
      } catch (err) {
        console.error('❌ Error loading market symbols:', err);
      }
    }
    loadSymbols();
  }, []);

  // 2. Fetch live prices
  useEffect(() => {
    if (!symbols.length) return;
    async function loadPrices() {
      setLoading(true);
      try {
        const resp = await marketAPI.getPrices(symbols);
        const cleaned = resp.data.filter(item => item && item.currentPrice != null);
        setPrices(cleaned);
      } catch (err) {
        console.error('❌ Error loading prices:', err);
      }
      setLoading(false);
    }
    loadPrices();
  }, [symbols]);

  if (loading) {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-4 px-6 py-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="text-gray-300 text-sm">Loading live trends...</span>
      </div>
    </div>
  );
}


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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Live Market Trends</h1>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full table-auto">
            <thead className="bg-gray-800 text-gray-400 text-sm uppercase">
              <tr>
                {['Symbol', 'Price', 'Change', '% Change'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {prices
                .filter(item =>
                  item &&
                  item.currentPrice != null &&
                  item.d != null &&
                  item.dp != null
                )
                .map(({ symbol, currentPrice, d, dp }) => {
                  const isPos = dp >= 0;
                  return (
                    <tr key={symbol} className="hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{symbol}</td>
                      <td className="px-4 py-3">
                        {currentPrice != null ? `$${currentPrice.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className={`px-4 py-3 ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                        {d != null ? `${isPos ? '+' : ''}${d.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className={`px-4 py-3 ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                        {dp != null ? `${isPos ? '+' : ''}${dp.toFixed(2)}%` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
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
