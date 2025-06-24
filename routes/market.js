const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/market/symbols
// Fetch all US exchange symbols from Finnhub
router.get('/symbols', async (req, res) => {
  try {
    console.log('🔐 Finnhub key:', process.env.FINNHUB_API_KEY);
    const response = await axios.get(
      'https://finnhub.io/api/v1/stock/symbol',
      {
        params: {
          exchange: 'US',
          token: process.env.FINNHUB_API_KEY
        }
      }
    );
    console.log('✅ Got', response.data.length, 'symbols');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching market symbols:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to fetch market symbols' });
  }
});

// POST /api/market/prices
// Accepts { symbols: ['AAPL', 'MSFT', ...] }
router.post('/prices', async (req, res) => {
  const { symbols } = req.body;

  if (!symbols || !Array.isArray(symbols)) {
    return res.status(400).json({ error: 'Invalid or missing symbols array' });
  }

  console.log('⏳ Fetching prices for:', symbols.length, 'symbols');

  const promises = symbols.map(symbol =>
    axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol, token: process.env.FINNHUB_API_KEY }
    })
      .then(response => ({
        symbol,
        currentPrice: response.data.c,
        d: response.data.d,
        dp: response.data.dp
      }))
      .catch(err => {
        console.error(`❌ Error fetching ${symbol}:`, err.response?.data || err.message);
        return null;
      })
  );

  try {
    const results = (await Promise.all(promises)).filter(Boolean);
    console.log('✅ Fetched prices for', results.length, 'symbols');
    res.json(results);
  } catch (error) {
    console.error('❌ Error fetching multiple prices:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

module.exports = router;
