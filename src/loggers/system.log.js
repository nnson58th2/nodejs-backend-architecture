'use strict';

const { v4: uuidv4 } = require('uuid');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

class SystemLogger {
    constructor() {
        const formatPrint = format.printf(({ level, message, context, requestId, timestamp, metadata }) => {
            return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}}`;
        });

        this.logger = createLogger({
            format: format.combine(format.timestamp({ format: 'YYY-MM-DD HH:mm:ss' }), formatPrint),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH', // 20, 21 YYYY-MM-DD-HH-mm
                    zippedArchive: true, // true: backup log zipped archive
                    maxSize: '1m', // Dung lượng file log
                    maxFiles: '14d', // Nếu đạt thì sẽ xoá log trong vòng 14 ngày
                    format: format.combine(format.timestamp({ format: 'YYY-MM-DD HH:mm:ss' }), formatPrint),
                    level: 'info',
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH', // 20, 21 YYYY-MM-DD-HH-mm
                    zippedArchive: true, // true: backup log zipped archive
                    maxSize: '1m', // Dung lượng file log
                    maxFiles: '14d', // Nếu đạt thì sẽ xoá log trong vòng 14 ngày
                    format: format.combine(format.timestamp({ format: 'YYY-MM-DD HH:mm:ss' }), formatPrint),
                    level: 'error',
                }),
            ],
        });
    }

    commonParams(params) {
        let context, req, metadata;

        if (!Array.isArray(params)) {
            context = params.context;
            req = params.req;
            metadata = params.metadata;
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuidv4();
        return {
            requestId,
            context,
            metadata,
        };
    }

    log(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign({ message }, paramLog);
        this.logger.info(logObject);
    }

    error(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign({ message }, paramLog);
        this.logger.error(logObject);
    }
}

module.exports = new SystemLogger();
