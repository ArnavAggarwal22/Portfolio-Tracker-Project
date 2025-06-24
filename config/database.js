
require('dotenv').config();


const { Pool } = require('pg');
// Uses DATABASE_URL from your .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;



