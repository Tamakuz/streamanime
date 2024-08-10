import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://jovangithub:kCfgu8khcl3sYWyg@taskcrud.cnbg3xi.mongodb.net/animexqu?retryWrites=true&w=majority&appName=taskcrud';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};


