import { container } from "./di-container";
import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as fs from "fs";
import * as express from "express";
import * as session from "express-session";
import { SysLogger, LoggerCreator } from "./logger";
import { Config } from "./config-reader";
import { SecurityUtils } from "./utils";

const SessionStore = require('connect-sqlite3')(session);
const config: Config = container.get('Config');
const logger: SysLogger = container.get('Logger');

// create necessary directories
[
    path.join(process.cwd(), config.log.path)
].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {

    // add body parser
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(logger.handleExpressLogs.bind(logger));
    app.use(express.static(path.join(__dirname, '../public')));
    app.set("views", path.join(__dirname, '../views'));
    app.set("view engine", "pug");
    
    app.use(session({
        store: new SessionStore({db: config.database.path, table: 't_sessions'}),
        secret: config.sessionScreet,
        resave: true,
        saveUninitialized: false,
        cookie: {maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
    }));

    app.use(SecurityUtils.checkReqAuth);
});

let app = server.build();
app.listen(config.server.port);