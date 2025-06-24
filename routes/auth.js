// backend/routes/auth.js


// backend/routes/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = express.Router();

// ── Sign Up ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // hash the password
    const hash = await bcrypt.hash(password, 10);
    // store in DB
    await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
      [email, hash]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err.code === '23505') {
      // unique violation
      return res.status(400).json({ error: 'Email already in use' });
    }
    console.error(err);
    res.sendStatus(500);
  }
});

// ── Log In ──────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // fetch the user
    const { rows } = await pool.query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { id, password_hash } = rows[0];
    // compare password
    const match = await bcrypt.compare(password, password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // create a JWT and send it back
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
