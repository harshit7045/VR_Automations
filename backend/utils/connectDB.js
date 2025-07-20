import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db_name = 'vr_automation';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB URI:', process.env.MONGO_URI); // Debug log
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: db_name,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
