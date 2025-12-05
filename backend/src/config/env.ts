import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  TTD_API_KEY: required("TTD_API_KEY"),
  TTD_SECRET_KEY: process.env.TTD_SECRET_KEY || "",
  TTD_DEFAULT_LANG: (process.env.TTD_DEFAULT_LANG as "th" | "en" | "zh") || "th"
};
