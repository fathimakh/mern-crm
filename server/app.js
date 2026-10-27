const path = require('path');

// Load environment variables from the project root .env file
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoutes');
const customerRoutes = require('./routes/CustomerRoutes');
const requestLogger = require('./middleware/Logger');
const { notFound, errorHandler } = require('./middleware/ErrorHandler');

const app = express();

// ---------- Global middleware ----------
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim());

if (process.env.NODE_ENV !== 'test') app.use(requestLogger);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }));

// ---------- Routes ----------
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CRM API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

// ---------- Error handling (must be registered last) ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start ----------
const PORT = process.env.PORT || 5014;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined. Add it to the .env file.');
    }
    await connectDB();
    // Express 5 passes listen errors (e.g. EADDRINUSE) to this callback
    app.listen(PORT, (error) => {
      if (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
      }
      console.log(`CRM API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start only when run directly (node app.js / nodemon app.js)
if (require.main === module) {
  startServer();
}

module.exports = app;
