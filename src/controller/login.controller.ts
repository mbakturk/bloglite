import { SessionUtils } from './../utils/session.utils';
import { UserDAO } from "./../repo/user.dao";
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";

import { Request, Response, NextFunction } from "express";
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SecurityUtils } from '../utils';

@controller(SecurityUtils.securityPath)
export class LoginController implements interfaces.Controller {

    @inject(UserDAO) private userDAO: UserDAO;

    @httpGet("/")
    private loginPage(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            res.redirect(SecurityUtils.securityPath + "/dashboard")
            return;
        }
        res.render("login");
    }

    @httpPost("/")
    private authenticate(req: Request, res: Response, next: NextFunction) {
        // you might like to do a database look-up or something more scalable here
        if (req.body.email) {

            return this.userDAO.getUserByEmail(req.body.email)
                .pipe(
                    switchMap(user => {
                        if (user && user.password === req.body.password) {
                            req.session.user = user;
                            return SessionUtils.saveSession(req.session);
                        }
                        return of(false);
                    })
                ).toPromise()
                .then(isSuccess => {
                    if (isSuccess) {
                        res.redirect(SecurityUtils.securityPath + "/dashboard")
                    } else {
                        res.redirect(SecurityUtils.securityPath);
                    }
                });
        }
        res.redirect(SecurityUtils.securityPath);
    }


}