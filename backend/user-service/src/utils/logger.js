const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

// ✅ Define log directory
const logDir = path.join(__dirname, "../../logs");

// ✅ Create rotating file transports
const transports = {
  combined: new winston.transports.DailyRotateFile({
    filename: `${logDir}/combined-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "50m",
    maxFiles: "14d",
  }),

  error: new winston.transports.DailyRotateFile({
    filename: `${logDir}/error-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "50m",
    maxFiles: "14d",
    level: "error",
  }),

  auth: new winston.transports.DailyRotateFile({
    filename: `${logDir}/auth-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "50m",
    maxFiles: "14d",
  }),

  audit: new winston.transports.DailyRotateFile({
    filename: `${logDir}/audit-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "50m",
    maxFiles: "30d",
  }),

  console: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
};

// ✅ Main Logger (Writes only to combined + console)
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [transports.combined, transports.console],
});

// ✅ Specific Loggers (Only write to their own transports)
const authLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [transports.auth], // ✅ Writes only to auth logs
});

const auditLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [transports.audit], // ✅ Writes only to audit logs
});

const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [transports.error], // ✅ Writes only to error logs
});

// ✅ Attach Specific Loggers to Main Logger
logger.auth = authLogger;
logger.audit = auditLogger;
logger.errorLog = errorLogger;

// ✅ Handle Uncaught Exceptions & Unhandled Rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: `${logDir}/exceptions.log` })
);
logger.rejections.handle(
  new winston.transports.File({ filename: `${logDir}/rejections.log` })
);

module.exports = logger;
