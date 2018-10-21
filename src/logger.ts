import { SysLogger } from './logger';
import { Request, NextFunction, Response } from "express";
import { Logger, format, createLogger, transports } from "winston";
import { Config } from "./config-reader";
import * as path from "path";

export interface SysLogger extends Logger {
    handleExpressLogs(req: Request, res: Response, next: NextFunction);
}

const LoggerCreator = (container): SysLogger => {

    const config: Config = container.get("Config");
    const logDir: string = path.join(__dirname, config.log.path);

    const logFormat = format.combine(
        format.timestamp(),
        format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    );



    const logger: SysLogger = createLogger({
        level: config.log.level,
        format: logFormat,
        transports: [
            new transports.Console({ format: format.combine(format.colorize(), logFormat) }),
            new transports.File({ filename: logDir + "error.log", level: "error" }),
            new transports.File({ filename: logDir + "combined.log" })
        ],
        silent: config.log.silent
    }) as SysLogger;

    logger.handleExpressLogs = (req: Request, res: Response, next: NextFunction) => {
        logger.debug(`${req.method} ${req.url} ${res.statusCode}`);
        next();
    }

    return logger;
}

export { LoggerCreator };