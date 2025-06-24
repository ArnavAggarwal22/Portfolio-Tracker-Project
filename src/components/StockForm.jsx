import React, { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';

const StockForm = ({ onAddStock }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.symbol && formData.quantity && formData.purchase_price) {
      onAddStock({
        ...formData,
        quantity: parseInt(formData.quantity),
        purchase_price: parseFloat(formData.purchase_price)
      });
      setFormData({
        symbol: '',
        quantity: '',
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="bg-gray-900 text-gray-300 rounded-xl shadow-sm border border-gray-800 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-900 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold">Add New Stock</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium mb-2">
            Stock Symbol
          </label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="AAPL"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="10"
            min="1"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="purchase_price" className="block text-sm font-medium mb-2">
            Purchase Price
          </label>
          <input
            type="number"
            id="purchase_price"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            placeholder="150.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="purchase_date" className="block text-sm font-medium mb-2">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchase_date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockForm;
