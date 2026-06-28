import { createLogger, format, transports } from "winston";

const { combine, colorize, printf, errors, splat } = format;

const consoleFormat = printf(({ level, message, stack }) => {
  return `${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "debug",
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        splat(),
        errors({ stack: true }),
        consoleFormat,
      ),
    }),
  ],
});

export { logger };
