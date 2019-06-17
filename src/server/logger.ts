import { SysLogger } from './logger';
import { Request, NextFunction, Response } from "express";
import { Logger, format, createLogger, transports, info } from "winston";
import { Config } from "./config-reader";
import * as path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { DateUtils } from './utils';

export interface SysLogger extends Logger {
    handleExpressLogs(req: Request, res: Response, next: NextFunction);
}

const LoggerCreator = (container): SysLogger => {

    const config: Config = container.get("Config");
    const logDir: string = path.join(process.cwd(), config.log.path);

    const timestamp = format((info, opts) => {
        info.timestamp = DateUtils.now().format('YYYY-MM-DD HH:mm:ss');
        return info;
    });

    const logFormat = format.combine(
        timestamp(),
        format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    );

    const errorTransport = new DailyRotateFile({
        filename: logDir + "error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        level: "error"
    });

    const combinedTransport = new DailyRotateFile({
        filename: logDir + "combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
    })

    const logger: SysLogger = createLogger({
        level: config.log.level,
        format: logFormat,
        transports: [
            errorTransport,
            combinedTransport,
            new transports.Console({ level: "info" })
        ]
    }) as SysLogger;

    logger.handleExpressLogs = (req: Request, res: Response, next: NextFunction) => {
        const ip = req.connection.remoteAddress;
        logger.debug(`(${ip}) ${req.method} ${req.url} ${res.statusCode}`);
        next();
    }

    return logger;
}

export { LoggerCreator };