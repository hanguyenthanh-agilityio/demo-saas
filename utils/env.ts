import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL!,
  EMAIL: process.env.EMAIL!,
  PASSWORD: process.env.PASSWORD!,
  EMAIL_LOGOUT: process.env.EMAIL_LOGOUT!,
  PASSWORD_LOGOUT: process.env.PASSWORD_LOGOUT!,
};
