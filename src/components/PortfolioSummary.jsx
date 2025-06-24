import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

const PortfolioSummary = ({ stocks }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // calculate totals
  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalGainLoss = 0;

  stocks.forEach(stock => {
    const invested = stock.purchase_price * stock.quantity;
    const currentValue = stock.currentPrice ? stock.currentPrice * stock.quantity : invested;
    totalInvested += invested;
    totalCurrentValue += currentValue;
    totalGainLoss += currentValue - invested;
  });

  const percentageChange = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;
  const isPositive = totalGainLoss >= 0;

  const cards = [
    {
      label: 'Total Invested',
      value: totalInvested,
      Icon: DollarSign,
      iconBg: 'bg-blue-800',
      iconColor: 'text-blue-300',
      textPrimary: 'text-gray-300'
    },
    {
      label: 'Current Value',
      value: totalCurrentValue,
      Icon: PieChart,
      iconBg: 'bg-green-800',
      iconColor: 'text-green-300',
      textPrimary: 'text-gray-300'
    },
    {
      label: 'Total Gain/Loss',
      value: totalGainLoss,
      Icon: isPositive ? TrendingUp : TrendingDown,
      iconBg: isPositive ? 'bg-green-800' : 'bg-red-800',
      iconColor: isPositive ? 'text-green-300' : 'text-red-300',
      textPrimary: isPositive ? 'text-green-300' : 'text-red-300'
    },
    {
      label: 'Performance',
      value: `${percentageChange.toFixed(2)}%`, // string
      Icon: isPositive ? TrendingUp : TrendingDown,
      iconBg: isPositive ? 'bg-green-800' : 'bg-red-800',
      iconColor: isPositive ? 'text-green-300' : 'text-red-300',
      textPrimary: isPositive ? 'text-green-300' : 'text-red-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ label, value, Icon, iconBg, iconColor, textPrimary }) => (
        <div key={label} className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{label}</p>
              {typeof value === 'number' ? (
                <p className={`text-2xl font-bold ${textPrimary}`}>{formatCurrency(value)}</p>
              ) : (
                <p className={`text-2xl font-bold ${textPrimary}`}>{value}</p>
              )}
            </div>
            <div className={`p-3 ${iconBg} rounded-full`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioSummary;
