import React, { useState, useEffect } from 'react';
import { cryptoAPI } from '../services/api';

const CryptoChart = ({ coinId, coinName, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, [coinId]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cryptoAPI.getCoinHistory(coinId);
      
      if (response.success && response.data && response.data.records) {
        // Transform data for chart display
        const transformedData = response.data.records.map(record => ({
          date: new Date(record.timestamp).toISOString().split('T')[0],
          price: record.priceUSD,
          timestamp: record.timestamp
        }));
        
        setChartData(transformedData);
      } else {
        setError('No data available for this coin');
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriceChange = () => {
    if (chartData.length < 2) return { change: 0, percentage: 0 };
    
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return { change, percentage };
  };

  const renderChart = () => {
    if (chartData.length === 0) return null;

    const maxPrice = Math.max(...chartData.map(d => d.price));
    const minPrice = Math.min(...chartData.map(d => d.price));
    const priceRange = maxPrice - minPrice;

    return (
      <div className="chart-container">
        <div className="chart-bars">
          {chartData.map((dataPoint, index) => {
            const height = priceRange > 0 
              ? ((dataPoint.price - minPrice) / priceRange) * 100 
              : 50;
            
            return (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: dataPoint.price >= chartData[Math.max(0, index - 1)]?.price 
                      ? '#10b981' 
                      : '#ef4444'
                  }}
                  title={`${formatDate(dataPoint.date)}: ${formatPrice(dataPoint.price)}`}
                />
                {index % 5 === 0 && (
                  <div className="chart-label">
                    {formatDate(dataPoint.date)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const { change, percentage } = getPriceChange();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{coinName} Price History</h2>
            <p className="text-gray-600">30-day price chart</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
            <button
              onClick={fetchChartData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Current Price</div>
                  <div className="text-lg font-semibold">
                    {formatPrice(chartData[chartData.length - 1].price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">30-Day Change</div>
                  <div className={`text-lg font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '+' : ''}{formatPrice(change)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%)
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Highest Price</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatPrice(Math.max(...chartData.map(d => d.price)))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Lowest Price</div>
                  <div className="text-lg font-semibold text-red-600">
                    {formatPrice(Math.min(...chartData.map(d => d.price)))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Price Chart (30 Days)</h3>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                {renderChart()}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Historical Data</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Price (USD)</th>
                      <th className="text-right p-2">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((dataPoint, index) => {
                      const prevPrice = index > 0 ? chartData[index - 1].price : dataPoint.price;
                      const dayChange = dataPoint.price - prevPrice;
                      const dayChangePercent = (dayChange / prevPrice) * 100;
                      
                      return (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-2">{formatDate(dataPoint.date)}</td>
                          <td className="text-right p-2 font-mono">
                            {formatPrice(dataPoint.price)}
                          </td>
                          <td className={`text-right p-2 font-mono ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dayChange >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .chart-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: end;
          justify-content: space-between;
          padding: 0 10px;
        }
        
        .chart-bars {
          display: flex;
          align-items: end;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          gap: 2px;
        }
        
        .chart-bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          position: relative;
        }
        
        .chart-bar {
          width: 100%;
          min-height: 4px;
          border-radius: 2px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .chart-bar:hover {
          opacity: 0.8;
          transform: scaleY(1.1);
        }
        
        .chart-label {
          position: absolute;
          bottom: -20px;
          font-size: 10px;
          color: #6b7280;
          white-space: nowrap;
          transform: rotate(-45deg);
          transform-origin: top left;
        }
      `}</style>
    </div>
  );
};

export default CryptoChart; 