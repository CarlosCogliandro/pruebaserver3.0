import dotenv from "dotenv";
import { Command } from "commander";

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


// Instancia de Commander
const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();

console.log('Mode Option: ', program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment === 'production' ? '.src/config/.env.production' : 'src/config/.env.development'
});

export default { environment: environment }