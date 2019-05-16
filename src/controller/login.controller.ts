import { SessionUtils } from './../utils/session.utils';
import { UserDAO } from "./../repo/user.dao";
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";

import { Request, Response, NextFunction } from "express";
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SecurityUtils } from '../utils';

@controller(SecurityUtils.securePath)
export class LoginController implements interfaces.Controller {

    @inject(UserDAO) private userDAO: UserDAO;

    /*@httpGet("/")
    private loginPage(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            res.redirect(SecurityUtils.securePath + "/dashboard")
            return;
        }
        res.render("login");
    }*/

    @httpPost("/login")
    private authenticate(req: Request, res: Response, next: NextFunction) {
        // you might like to do a database look-up or something more scalable here
        if (req.body.email) {

            return this.userDAO.getUserByEmail(req.body.email)
                .pipe(
                    switchMap(user => {
                        if (user && user.password === req.body.password) {
                            req.session.user = user;
                            return SessionUtils.save(req.session);
                        }
                        return of(false);
                    })
                ).toPromise()
                .then(isSuccess => {
                    res.json({ retCode: isSuccess === false ? 1 : 0 })
                });
        }
        res.json({ retCode: 2 });
    }

    @httpPost("/logout")
    private logout(req: Request, res: Response, next: NextFunction) {
        return SessionUtils.destroy(req.session).toPromise()
            .then(isSuccess => {
                res.json({ retCode: isSuccess === false ? 1 : 0 })
            }).catch(err => {
                retCode: -1 // internal error
            });
    }

    @httpPost("/heartbeat")
    private heartbeat(req: Request, res: Response, next: NextFunction) {
        res.json({ retCode: 0 });
    }

}