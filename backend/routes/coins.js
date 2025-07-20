import express from 'express';
import axios from 'axios';
import CryptoHistory from '../models/CoinRecord.js';
import CurrentSnapshot from '../models/CurrentSnapshot.js';

const router = express.Router();

// Rate limiting
let lastApiCall = 0;
const API_CALL_INTERVAL = 5000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchCoinGeckoData = async () => {
  try {
    const now = Date.now();
    if (now - lastApiCall < API_CALL_INTERVAL) {
      const waitTime = API_CALL_INTERVAL - (now - lastApiCall);
      await delay(waitTime);
    }
    
    lastApiCall = Date.now();
    
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false
      },
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoTracker/1.0'
      }
    });
    
    return response.data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      priceUSD: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching from CoinGecko API:', error.message);
    return null;
  }
};

const storeCurrentSnapshot = async (coinData) => {
  const snapshot = new CurrentSnapshot({
    snapshotId: `snapshot_${Date.now()}`,
    timestamp: new Date(),
    totalCoins: coinData.length,
    coins: coinData
  });
  
  await snapshot.save();
  return snapshot;
};

const storeDataInMongoDB = async (coinData) => {
  for (const coin of coinData) {
    const existingRecord = await CryptoHistory.findOne({ coinId: coin.coinId });
    
    if (existingRecord) {
      const newRecord = {
        priceUSD: coin.priceUSD,
        marketCap: coin.marketCap,
        change24h: coin.change24h,
        timestamp: new Date(coin.timestamp)
      };
      
      existingRecord.records.push(newRecord);
      
      if (existingRecord.records.length > 30) {
        existingRecord.records = existingRecord.records.slice(-30);
      }
      
      existingRecord.totalRecords = existingRecord.records.length;
      existingRecord.lastUpdated = new Date();
      
      await existingRecord.save();
    } else {
      const newRecord = new CryptoHistory({
        coinId: coin.coinId,
        name: coin.name,
        symbol: coin.symbol,
        records: [{
          priceUSD: coin.priceUSD,
          marketCap: coin.marketCap,
          change24h: coin.change24h,
          timestamp: new Date(coin.timestamp)
        }],
        totalRecords: 1,
        lastUpdated: new Date(),
        createdAt: new Date()
      });
      
      await newRecord.save();
    }
  }
};

router.get('/', async (req, res) => {
  try {
    const latestSnapshot = await CurrentSnapshot.findOne().sort({ timestamp: -1 });
    
    if (!latestSnapshot) {
      return res.status(404).json({
        success: false,
        error: 'No snapshot data available'
      });
    }
    
    const formattedData = latestSnapshot.coins.map(coin => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      priceUSD: coin.priceUSD,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      timestamp: latestSnapshot.timestamp.toISOString()
    }));
    
    res.json({
      success: true,
      data: formattedData,
      lastUpdated: latestSnapshot.timestamp.toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data'
    });
  }
});

router.post('/history', async (req, res) => {
  try {
    const coinGeckoData = await fetchCoinGeckoData();
    
    if (!coinGeckoData) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch data from CoinGecko API'
      });
    }
    
    const snapshot = await storeCurrentSnapshot(coinGeckoData);
    await storeDataInMongoDB(coinGeckoData);
    
    res.json({
      success: true,
      message: 'Snapshot stored successfully',
      coinsProcessed: coinGeckoData.length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to store snapshot'
    });
  }
});

router.get('/history/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const coinHistory = await CryptoHistory.findOne({ coinId });
    
    if (!coinHistory) {
      return res.status(404).json({
        success: false,
        error: 'Coin history not found'
      });
    }
    
    res.json({
      success: true,
      data: coinHistory
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coin history'
    });
  }
});

export default router; 