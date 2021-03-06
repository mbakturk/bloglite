import * as path from "path";
import * as fs from "fs";
import { DateUtils, SecurityUtils } from "./utils";

export interface Config {

    baseUrl: string;
    adminPanel: string;

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

    securePath: string;
}


const fetchServerConfig = (): Config => {
    const filePath = path.join(__dirname, "../config.json");
    // console.log('Config file\'s path is ' + filePath);
    const config: Config = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    // Utils settings
    DateUtils.timezone = config.timezone;    
    SecurityUtils.securePath = "/" + config.securePath;
    return config;
};

export const config: Config = fetchServerConfig();