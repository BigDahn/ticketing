import mongoose from 'mongoose';

import { app } from './app.js';

const start = async () => {
  console.log('Starting up auth service...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('connected to DB');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Auth service is running on port 3000!!!!!!');
  });
};

start();
