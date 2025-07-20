import mongoose from 'mongoose';

const currentSnapshotSchema = new mongoose.Schema({
  snapshotId: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  totalCoins: {
    type: Number,
    required: true
  },
  coins: [{
    coinId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
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
      type: String,
      required: true
    }
  }]
});

export default mongoose.model('CurrentSnapshot', currentSnapshotSchema); 