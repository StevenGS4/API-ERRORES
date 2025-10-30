import mongoose from 'mongoose';
import dotenvXConfig from './dotenvXConfig.js';

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(dotenvXConfig.CONNECTION_STRING);
    console.log(`Database is connected to: ${db.connection.name}`);
  } catch (error) {
    console.log(`Error ${error}`);
  }
};
