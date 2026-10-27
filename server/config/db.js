const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the MONGO_URI from .env.
 * Throws if the connection cannot be established so the server never
 * starts without a working database.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Add it to the .env file.');
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // fail fast if MongoDB is not running
  });

  console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
  return conn;
};

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));

module.exports = connectDB;
