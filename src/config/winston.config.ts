import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const dir = path.join(process.cwd(), '.logs');

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`),
      ),
    }),

    new winston.transports.File({
      filename: path.join(dir, 'error.log'),
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    new winston.transports.File({
      filename: path.join(dir, 'all.log'),
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
};
