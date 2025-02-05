import fs from "fs";
import winston from "winston";
const fsPromise = fs.promises;

// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()} Log Data:- ${logData}`;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (error) {
//     console.log(error);
//   }
// }
const errorLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-loggin" },
  transports: [new winston.transports.File({ filename: "ErrorLogs.txt" })],
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-loggin" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

export const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("login")) {
    const logData = `${req.url}-${JSON.stringify(req.body)}`;
    logger.info(logData);
  }
  next();
};

export const errorLoggerMiddleware = async (err, req, res, next) => {
  const logData = `Date and Time ${new Date().toString()} req type -${req.url} method -
  ${req.method} Error-${err}`;
  errorLogger.info(logData);
  next();
};
