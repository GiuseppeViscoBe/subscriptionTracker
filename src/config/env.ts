import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

function required(envVar: string | undefined, name: string): string {
  if (!envVar) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return envVar;
}

export const ENV = {
  PORT: required(process.env.PORT, "PORT"),
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URI: required(process.env.DB_URI, "DB_URI"),
  JWT_SECRET: required(process.env.JWT_SECRET, "JWT_SECRET"),
  JWT_EXPIRES_IN: required(process.env.JWT_EXPIRES_IN , "JWT_EXPIRES_IN") as string | number
};
