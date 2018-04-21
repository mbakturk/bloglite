import { container } from "./di-container";
import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as express from "express";
import * as session from "express-session";

var logger = require('morgan');

let FileStore = require('session-file-store')(session);



function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

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

    //TODO: disable in production mode
    app.use(logger('dev'));
    app.use(bodyParser.json());
    

    app.use(express.static(path.join(__dirname, '../public')));
    app.set("views", path.join(__dirname, '../views'));
    app.set("view engine", "pug");

    app.use(session({
        store: new FileStore(),
        secret: 'keyboard cat',
    }));

    app.use(checkAuth);
});

let app = server.build();
app.listen(3000);