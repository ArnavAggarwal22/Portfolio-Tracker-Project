
const express = require('express');
const router  = express.Router();
const pool    = require('../config/database');
const axios   = require('axios');


router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT *
         FROM stocks
        WHERE user_id = $1
     ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});


router.post('/', async (req, res) => {
  const userId = req.user?.id;
  const { symbol, quantity, purchase_price, purchase_date } = req.body;

  if (!userId) {
    console.error('User ID missing in request!');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO stocks
         (symbol, quantity, purchase_price, purchase_date, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        symbol.toUpperCase(),
        quantity,
        purchase_price,
        purchase_date,
        userId
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Failed to add stock' });
  }
});


router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM stocks
         WHERE id = $1
           AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found or not owned by you' });
    }

    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});


router.get('/price/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    res.json({
      symbol,
      currentPrice: response.data.c
    });
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
});


router.post('/prices', async (req, res) => {
  const { symbols } = req.body;

  try {
    const promises = symbols.map(async (symbol) => {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
      );
      return {
        symbol,
        currentPrice: response.data.c,
        d: response.data.d,
        dp: response.data.dp
      };
    });

    const results = await Promise.all(promises);
    res.json(results);
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    res.status(500).json({ error: 'Failed to fetch stock prices' });
  }
});

module.exports = router;
