import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb_uri in env variables.");
}

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    mongoose.connect(MONGODB_URI).then(() => mongoose.connection);
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (error) {
    cachedConnection.promise = null;
    throw error;
  }

  return cachedConnection.conn;
}
