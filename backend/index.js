import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/connectDB.js';
import coinsRouter from './routes/coins.js';
import cron from 'node-cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();
app.use('/api/coins', coinsRouter);

cron.schedule('0 * * * *', async () => {
  try {
    const response = await fetch('http://localhost:5000/api/coins/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`Cron job completed: ${result.message}`);
    }
  } catch (error) {
    console.error('Cron job error:', error.message);
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 