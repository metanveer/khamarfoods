import SSLCommerz from "sslcommerz-nodejs";
import dotenv from "dotenv";

dotenv.config();

const settings = {
  isSandboxMode: true, //false if live version
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWORD,
};

export const sslcommerz = new SSLCommerz(settings);
