import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT
export const MONGO_URL = process.env.MONGO_URL
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL 
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const SESSION_SECRET = process.env.SESSION_SECRET

// Login
export const GITHUB_USER = process.env.GITHUB_USER
export const GITHUB_PASS = process.env.GITHUB_PASS
export const GOOGLE_USER = process.env.GOOGLE_USER
export const GOOGLE_PWD = process.env.GOOGLE_PWD

export const JWT_KEY = process.env.JWT_KEY

// Nodemailer
export const GMAIL_ACCOUNT_NODEMAILER = process.env.GMAIL_ACCOUNT_NODEMAILER
export const GMAIL_PASS_NODEMAILER = process.env.GMAIL_PASS_NODEMAILER