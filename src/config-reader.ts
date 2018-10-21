import * as path from "path";
import * as fs from "fs";

export interface Config {
    server: {
        port: number
    };
    database: {
        path: string
    };

    log: {
        level: string,
        path: string,
        silent: boolean
    }
}


const fetchServerConfig = (): Config => {
    const filePath = path.join(__dirname, "../config.json");
    // console.log('Config file\'s path is ' + filePath);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

export { fetchServerConfig };