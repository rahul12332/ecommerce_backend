const mongoose = require('mongoose');

// Replace 'yourdbname' with your actual database name
const DB_URI = 'mongodb+srv://camit97chandra:Amit1234@cluster0.qchjokb.mongodb.net/?retryWrites=true&w=majority'

const connectDB = async () => {
    try {
      await mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of default 30s
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  };
  

module.exports = connectDB;
