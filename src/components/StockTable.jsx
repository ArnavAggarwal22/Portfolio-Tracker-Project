import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const StockTable = ({ stocks, onDeleteStock, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateGainLoss = (currentPrice, purchasePrice, quantity) => {
    if (!currentPrice) return 0;
    const currentValue = currentPrice * quantity;
    const purchaseValue = purchasePrice * quantity;
    return currentValue - purchaseValue;
  };

  const calculatePercentage = (currentPrice, purchasePrice) => {
    if (!currentPrice) return 0;
    return ((currentPrice - purchasePrice) / purchasePrice) * 100;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white rounded-xl shadow-sm border border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Loading stock data...</span>
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="bg-gray-900 text-white rounded-xl shadow-sm border border-gray-700 p-8 text-center">
        <div className="p-4 bg-gray-800 rounded-lg inline-block mb-4">
          <TrendingUp className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No stocks in your portfolio</h3>
        <p className="text-gray-400">Add your first stock to start tracking your portfolio performance.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-sm border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Your Portfolio</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Purchase Price</th>
              <th className="px-6 py-3">Current Price</th>
              <th className="px-6 py-3">Current Value</th>
              <th className="px-6 py-3">Gain/Loss</th>
              <th className="px-6 py-3">Purchase Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {stocks.map((stock) => {
              const gainLoss = calculateGainLoss(stock.currentPrice, stock.purchase_price, stock.quantity);
              const percentage = calculatePercentage(stock.currentPrice, stock.purchase_price);
              const isPositive = gainLoss >= 0;

              return (
                <tr key={stock.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-800 rounded-lg mr-3">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-white font-medium">{stock.symbol}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{stock.quantity}</td>
                  <td className="px-6 py-4">{formatCurrency(stock.purchase_price)}</td>
                  <td className="px-6 py-4">
                    {stock.currentPrice ? formatCurrency(stock.currentPrice) : 'Loading...'}
                  </td>
                  <td className="px-6 py-4">
                    {stock.currentPrice ? formatCurrency(stock.currentPrice * stock.quantity) : 'Loading...'}
                  </td>
                  <td className="px-6 py-4">
                    {stock.currentPrice ? (
                      <div className="flex items-center">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                        )}
                        <span className={isPositive ? 'text-green-300' : 'text-red-300'}>
                          {formatCurrency(gainLoss)} ({percentage.toFixed(2)}%)
                        </span>
                      </div>
                    ) : 'Loading...'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(stock.purchase_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDeleteStock(stock.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900 p-2 rounded-lg transition-all duration-200"
                      title="Delete stock"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
