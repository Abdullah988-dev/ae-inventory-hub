import mongoose from "mongoose";
import { env } from "@/config/env";
import { seedDefaultAdmin } from "@/lib/seedAdmin";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongodbUri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    await seedDefaultAdmin();
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}