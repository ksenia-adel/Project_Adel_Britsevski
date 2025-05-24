const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectMongo;
