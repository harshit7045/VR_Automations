import mongoose from 'mongoose';

const cryptoHistorySchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  records: [{
    priceUSD: {
      type: Number,
      required: true
    },
    marketCap: {
      type: Number,
      required: true
    },
    change24h: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    }
  }],
  totalRecords: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CryptoHistory', cryptoHistorySchema); 