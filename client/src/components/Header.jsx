import React from 'react';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg w-[100vw] ">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Crypto Tracker</h1>
              <p className="text-xs text-blue-100">Real-time cryptocurrency data</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-blue-200 transition-colors font-medium">
              Dashboard
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Markets
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              News
            </a>
          </nav>

          {/* Right side - Stats */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 text-white">
              <div className="text-right">
                <p className="text-xs text-blue-200">Market Cap</p>
                <p className="text-sm font-semibold">$2.34T</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">24h Vol</p>
                <p className="text-sm font-semibold">$89.2B</p>
              </div>
            </div>
            
            <button className="p-2 text-white hover:text-blue-200 transition-colors">
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 