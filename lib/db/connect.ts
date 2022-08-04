import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached)
  cached = (global as any).mongoose = { connection: null, promise: null };

const connectToMongoDB = async () => {
  if (cached.connection) return cached.connection;

  if (!cached.promise)
    cached.promise = await mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    });

  return await cached.promise;
};

export default connectToMongoDB;
