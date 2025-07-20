import React, { useState, useEffect } from 'react';
import { cryptoAPI } from '../services/api';
import CryptoChart from './CryptoChart';

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchCryptoData();
    
    // Set up automatic refresh every 30 minutes using setTimeout
    const scheduleNextRefresh = () => {
      setTimeout(() => {
        fetchCryptoData();
        scheduleNextRefresh(); // Schedule the next refresh
      }, 30 * 60 * 1000); // 30 minutes
    };
    
    scheduleNextRefresh();
    
    // Cleanup function
    return () => {
      // Note: setTimeout cleanup is handled by the recursive scheduling
    };
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cryptoAPI.getCurrentData();
      
      if (response.success && response.data) {
        setCryptoData(response.data);
        setLastUpdated(new Date(response.lastUpdated));
        console.log(`✅ Data loaded from: ${response.source}`);
      } else {
        setError('Failed to fetch cryptocurrency data');
      }
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleChartClick = (coin) => {
    setSelectedCoin(coin);
    setShowChart(true);
  };

  const closeChart = () => {
    setShowChart(false);
    setSelectedCoin(null);
  };

  const filteredAndSortedData = cryptoData
    .filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'change24h') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">❌ {error}</div>
        <button
          onClick={fetchCryptoData}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cryptocurrency Dashboard</h1>
          <p className="text-gray-600">
            Top {cryptoData.length} cryptocurrencies by market cap
            {lastUpdated && (
              <span className="ml-2 text-sm">
                • Last updated: {formatTimestamp(lastUpdated)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchCryptoData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="marketCap">Market Cap</option>
            <option value="priceUSD">Price</option>
            <option value="change24h">24h Change</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Crypto Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">#</th>
                <th className="text-left p-4 font-semibold text-gray-900">Name</th>
                <th className="text-right p-4 font-semibold text-gray-900">Price</th>
                <th className="text-right p-4 font-semibold text-gray-900">24h Change</th>
                <th className="text-right p-4 font-semibold text-gray-900">Market Cap</th>
                <th className="text-center p-4 font-semibold text-gray-900">Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedData.map((coin, index) => (
                <tr key={coin.coinId} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{coin.name}</div>
                        <div className="text-sm text-gray-500">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono">
                    {formatPrice(coin.priceUSD)}
                  </td>
                  <td className={`p-4 text-right font-mono ${
                    parseFloat(coin.change24h) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(coin.change24h) >= 0 ? '+' : ''}{parseFloat(coin.change24h).toFixed(2)}%
                  </td>
                  <td className="p-4 text-right font-mono">
                    {formatMarketCap(coin.marketCap)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleChartClick(coin)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Modal */}
      {showChart && selectedCoin && (
        <CryptoChart
          coinId={selectedCoin.coinId}
          coinName={selectedCoin.name}
          onClose={closeChart}
        />
      )}
    </div>
  );
};

export default CryptoDashboard; 