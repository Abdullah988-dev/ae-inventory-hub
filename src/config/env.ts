function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  mongodbUri: getEnvVar("MONGODB_URI"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  nodeEnv: process.env.NODE_ENV ?? "development",
} as const;