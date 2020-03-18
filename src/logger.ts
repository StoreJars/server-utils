import path from 'path';
import { createLogger, format, transports } from 'winston';

const { colorize, combine, timestamp, label, printf } = format;

const LOGS_DIR = 'logs';

const logFormat = printf(info => {
  return `${info.timestamp} [ ${info.label} ] ${info.level} : ${info.message}`;
});

const Log = createLogger({
  format: combine(label({ label: 'SHOPPIE-USER' }), timestamp(), logFormat),
  transports: [
    new transports.File({ filename: path.join(LOGS_DIR, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(LOGS_DIR, 'debug.log'), level: 'info' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  Log.add(
    new transports.Console({
      format: combine(colorize(), label({ label: 'SHOPPIE-USER' }), timestamp()),
    }),
  );
}

export default Log;
