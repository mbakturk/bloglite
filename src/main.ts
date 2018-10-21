import { container } from "./di-container";
import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as express from "express";
import * as session from "express-session";
import { Config } from "./config-reader";
import { SysLogger } from "./logger";

const SessionStore = require('connect-sqlite3')(session);
const config: Config = container.get('Config');
const logger: SysLogger = container.get('Logger');

function checkAuth (req, res, next) {
	logger.debug('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if (req.url.indexOf("/s/") === 0 && (!req.session || !req.session.user)) {
		res.redirect("/s");
		return;
	}

	next();
}


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
        secret: 'keyboard cat',
        cookie: {maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
    }));

    app.use(checkAuth);
});

let app = server.build();
app.listen(config.server.port);