import { User } from './../repo/entity/user';
import { UserDAO } from "./../repo/user.dao";
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import * as session from "express-session";
import * as express from "express";

@controller("/s")
export class LoginController implements interfaces.Controller {

    @inject(UserDAO) private userDAO: UserDAO;

    @httpGet("/")
    private loginPage(req: Express.Request, res: express.Response, next: express.NextFunction) {
        if (req.session.user) {
            res.redirect("/s/dashboard")
            return;
        }
        res.render("login");
    }

    @httpPost("/")
    private authenticate(req: Express.Request & express.Request, res: express.Response, next: express.NextFunction) {
        // you might like to do a database look-up or something more scalable here
        if (req.body.email) {
            const user: User = this.userDAO.getUserByEmail(req.body.email);
            if (user && user.password === req.body.password) {
                return new Promise((resolve, reject) => {
                    req.session.user = user;
                    req.session.save(() => res.redirect('/s/dashboard'));
                }).then(() => res.redirect('/s/dashboard'));
            }
        }        
        res.redirect('/s');
    }


}