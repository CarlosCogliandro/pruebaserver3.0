import winston from "winston";
import config from "../config/config.js";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
};

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/services/loggers/warning.log',
            level: 'warning',
            format: winston.format.simple(),
        })
    ]
})

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({
            filename: 'src/services/loggers/http.log',
            level: 'warning'
        }),
    ]
})

export const addLogger = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger
    } else {
        req.logger = devLogger
    }
    req.logger.info(`Se disparo un llamado ${req.method} en ${req.url} - Fecha y Hora: ${new Date().toLocaleTimeString}`);
    next();
};