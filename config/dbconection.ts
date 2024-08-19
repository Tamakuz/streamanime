import mongoose from 'mongoose';

export const connectDB = async () => {

  const password = "R19yJzPgRXIwERQx";
  const uri = `mongodb://tamakuz:${password}@cluster0-shard-00-00.onqly.mongodb.net:27017,cluster0-shard-00-01.onqly.mongodb.net:27017,cluster0-shard-00-02.onqly.mongodb.net:27017/animexqu?ssl=true&replicaSet=atlas-8a28iu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

  const mongoUri = uri;

  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
