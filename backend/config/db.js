const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Updated connection string to use IPv4 loopback address (127.0.0.1)
    await mongoose.connect('mongodb://127.0.0.1:27017/oee-portal');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;
