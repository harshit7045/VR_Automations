import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiBarChart } from 'react-icons/fi';

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {/* Total Market Cap */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Market Cap</p>
            <p className="text-xl font-bold">$2.34T</p>
            <p className="text-blue-200 text-xs">+2.5% from yesterday</p>
          </div>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FiDollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 24h Volume */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">24h Volume</p>
            <p className="text-xl font-bold">$89.2B</p>
            <p className="text-green-200 text-xs">+12.3% from yesterday</p>
          </div>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FiBarChart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bitcoin Dominance */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">BTC Dominance</p>
            <p className="text-xl font-bold">51.2%</p>
            <p className="text-orange-200 text-xs">+0.8% from yesterday</p>
          </div>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Coins */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Active Coins</p>
            <p className="text-xl font-bold">2,295</p>
            <p className="text-purple-200 text-xs">+15 new today</p>
          </div>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 