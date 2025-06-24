require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const authRoutes  = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const marketRoutes  = require('./routes/market');
const authenticate = require('./middleware/authenticate');



const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stocks', authenticate, stockRoutes);
app.use('/api/market', marketRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
