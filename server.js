require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const authRoutes  = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const marketRoutes  = require('./routes/market');
const authenticate = require('./middleware/authenticate');



const app = express();

// 1) Enable CORS so front-end (localhost:5173) can talk to port 5000
app.use(cors({ origin: 'http://localhost:5173' }));

// 2) Allow JSON bodies
app.use(express.json());

// 3) Mount our auth endpoints under /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/stocks', authenticate, stockRoutes);
app.use('/api/market', marketRoutes);

// 4) Mount your portfolio endpoints under /api/stocks


// 5) Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
