# Crypto Tracker

A real-time cryptocurrency tracking application with automated data collection and historical analysis.

## Tech Stack Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework for API development
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **Axios** - HTTP client for API requests
- **node-cron** - Cron job scheduling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - JavaScript library for building user interfaces
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Icons** - Icon library

### External APIs
- **CoinGecko API** - Cryptocurrency data source

## Setup and Installation Steps

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tapFrontendAssingnment-main
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173`

### Quick Start (Windows)
Run the provided batch file to start both servers:
```bash
start-servers.bat
```

## How Your Cron Job Works

### Cron Job Configuration
- **Schedule**: Runs every hour (`0 * * * *`)
- **Purpose**: Fetches current cryptocurrency data and stores it in the database
- **Location**: `backend/index.js`

### Cron Job Process
1. **API Call**: Makes a POST request to `/api/coins/history`
2. **Data Fetching**: Calls CoinGecko API to get top 10 cryptocurrencies
3. **Data Storage**: 
   - Stores current snapshot in `currentsnapshots` collection
   - Appends historical data to `cryptohistories` collection
4. **Rate Limiting**: Implements 5-second delays between API calls to prevent rate limiting

### Data Flow
```
Cron Job (every hour)
    ↓
POST /api/coins/history
    ↓
CoinGecko API (top 10 coins)
    ↓
Store in MongoDB
    ↓
Frontend GET /api/coins (from database)
```

### Database Collections
- **`currentsnapshots`**: Latest price snapshots for quick access
- **`cryptohistories`**: Historical price data with records array per coin

### API Endpoints
- `GET /api/coins` - Get latest snapshot from database
- `POST /api/coins/history` - Store current snapshot (used by cron job)
- `GET /api/coins/history/:coinId` - Get historical data for specific coin
- `GET /health` - Health check endpoint

## Features

- **Real-time Data**: Live cryptocurrency prices and market data
- **Historical Analysis**: 30-day price charts and historical data
- **Automated Collection**: Cron job runs every minute to update data
- **Responsive Design**: Works on desktop and mobile devices
- **Search & Filter**: Find and sort cryptocurrencies
- **Interactive Charts**: Visual price history with detailed statistics

## Project Structure

```
├── backend/
│   ├── index.js              # Main server with cron job
│   ├── routes/coins.js       # API endpoints
│   ├── models/
│   │   ├── CoinRecord.js     # Historical data schema
│   │   └── CurrentSnapshot.js # Current snapshot schema
│   └── utils/connectDB.js    # Database connection
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CryptoDashboard.jsx
│   │   │   ├── CryptoChart.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/api.js   # API service
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Deployment Links

### Frontend
- **Local**: http://localhost:5173
- **Production**: [Deploy to Vercel/Netlify]

### Backend
- **Local**: http://localhost:5000
- **Production**: [Deploy to Railway/Heroku]

### API Documentation
- **Health Check**: http://localhost:5000/health
- **Current Data**: http://localhost:5000/api/coins
- **Historical Data**: http://localhost:5000/api/coins/history/:coinId

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
```

## Troubleshooting

### Common Issues
1. **Backend not starting**: Check MongoDB connection string
2. **Frontend can't connect**: Ensure backend is running on port 5000
3. **Cron job not working**: Check console logs for API rate limiting
4. **No data showing**: Wait for cron job to populate initial data

### Development Commands
```bash
# Backend
cd backend
npm run dev    # Development with nodemon
npm start      # Production

# Frontend
cd frontend
npm run dev    # Development server
npm run build  # Production build
``` 