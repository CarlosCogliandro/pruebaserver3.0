import dotenv from "dotenv";
import { Command } from "commander";

dotenv.config();

// Mongo DB
export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;

// Admin
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Login
export const GITHUB_USER = process.env.GITHUB_USER;
export const GITHUB_PASS = process.env.GITHUB_PASS;
export const GOOGLE_USER = process.env.GOOGLE_USER;
export const GOOGLE_PWD = process.env.GOOGLE_PWD;

export const JWT_KEY = process.env.JWT_KEY;

// Nodemailer
export const GMAIL_ACCOUNT_NODEMAILER = process.env.GMAIL_ACCOUNT_NODEMAILER;
export const GMAIL_PASS_NODEMAILER = process.env.GMAIL_PASS_NODEMAILER;

// Premium
export const PREMIUM_EMAIL = process.env.PREMIUM_EMAIL;
export const PREMIUM_PASSWORD = process.env.PREMIUM_PASSWORD;

// Instancia de Commander
const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'developer!')
program.parse();

console.log('Mode Option: ', program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path:
        environment === "production" ? "./src/config/.env.production" : environment === "test" ? "./src/config/.env.test" : "./src/config/.env.development",
});

export default { environment: environment };