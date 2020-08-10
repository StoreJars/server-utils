import path from 'path';
import { createLogger, format, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import chalk from 'chalk';

const { combine, colorize, label, printf, splat, timestamp } = format;

const LOGS_DIR = 'logs';

const myFormat = printf((info) => `${info.timestamp} ${chalk.cyan(info.label)} ${info.level}: ${info.message}`);

const loggingWinston = new LoggingWinston();

function logFormat(loggerLabel) {
  return combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(),
    colorize(),
    label({ label: loggerLabel }),
    myFormat,
  );
}
const debugFileTransport = new transports.File({
  filename: path.join(LOGS_DIR, 'debug.log'),
  level: 'info',
});

const errorFileTransport = new transports.File({
  filename: path.join(LOGS_DIR, 'error.log'),
  level: 'error',
});

function createLoggerWithLabel(labelName: string) {
  return createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
      new transports.Console({
        // timestamp: myFormat,
        level: 'debug',
        // showLevel: true,
        handleExceptions: true,
        // humanReadableUnhandledException: true,
      }),
      debugFileTransport,
      errorFileTransport,
    ],
    format: logFormat(labelName),
  });
}

export default function (name: string) {
  if (process.env.NODE_ENV !== 'production') {
    createLoggerWithLabel(name).add(
      new transports.Console({
        format: combine(colorize(), label({ label: name }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
      }),
    );
  }

  if (process.env.NODE_ENV == 'production') {
    createLoggerWithLabel(name).remove(debugFileTransport);
    createLoggerWithLabel(name).remove(errorFileTransport);
    createLoggerWithLabel(name).add(loggingWinston);
  }

  return {
    gateway: createLoggerWithLabel(`[${name}:gateway]`),
    config: createLoggerWithLabel(`[${name}:config]`),
    db: createLoggerWithLabel(`[${name}:db]`),
    admin: createLoggerWithLabel(`[${name}:admin]`),
    email: createLoggerWithLabel(`[${name}:email]`),
  };
}
