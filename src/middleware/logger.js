import winston from "winston";

const customLevelOptions = {
    levels: {
        error: 0,
        warning: 1,
        http: 2,
        debug: 3
    }
};

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.File({
            filename: 'src/services/loggers/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'src/services/loggers/warning.log',
            level: 'warning'
        })
    ]
});

export const levels = [
    winston.info("Info valida..."),
    logger.warning("Cuidado, Tenemos un problemita..."),
    logger.error("Un error se ha detectado..."),
];

export const addLoger = (req, res, next) => {
    req.logger = logger;
    req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`);
    next();
};