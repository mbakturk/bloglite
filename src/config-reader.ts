import * as path from "path";
import * as fs from "fs";
import { DateUtils } from "./utils";

export interface Config {
    server: {
        port: number
    };

    sessionScreet: string;

    database: {
        path: string
    };

    log: {
        level: string,
        path: string,
        silent: boolean
    };

    timezone: string;
}


const fetchServerConfig = (): Config => {
    const filePath = path.join(__dirname, "../config.json");
    // console.log('Config file\'s path is ' + filePath);
    const config: Config = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    // Utils settings
    DateUtils.timezone = config.timezone;    
    return config;
};

export const config: Config = fetchServerConfig();