const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
require('dotenv').config();

// Veritabanı bağlantısı
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tattoos', require('./routes/tattooRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Tattoo Site API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});