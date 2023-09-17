import mongoose from 'mongoose';
import logger from '../lib/logger/logger.js'
import  { env } from '../env.js'

// MongoDB connection URL
const dbUrl = env.db.mongoUrl;

// Create a function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1); // Exit the application on database connection error
  }
};

connectToDatabase();

// Export the database connection instance
export default mongoose.connection;
