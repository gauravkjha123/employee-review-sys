import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

class CustomLogger {
  
    constructor() {
  
      const transport = new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      });
  
      this.logger = createLogger({
        transports: [transport, new transports.Console()],
        format: format.combine(
         format.timestamp(),
         format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      });
    }
  
    info(message, context) {
  
      this.logger.log('info', `${context ? `[${context}] ` : ''}${message}`);
    }
  
    error(message, trace, context) {
  
      this.logger.error(`${context ? `[${context}] ` : ''}${message}`, trace);
    }
  
    warn(message, context) {
  
      this.logger.warn(`${context ? `[${context}] ` : ''}${message}`);
    }
  
    debug(message, context) {
  
      this.logger.debug(`${context ? `[${context}] ` : ''}${message}`);
    }
  
    verbose(message, context) {
  
      this.logger.verbose(`${context ? `[${context}] ` : ''}${message}`);
    }
  }
  
  export default new CustomLogger();
  