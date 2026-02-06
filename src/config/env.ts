import { config } from "dotenv";

config();

const { PORT, NODE_ENV } = process.env;

export const ENV = {
  PORT,
  NODE_ENV,
};
