import { Request } from 'express';

const hallPassAPIs = ['login',];

export class SecurityUtils {

    public static securePath = "/s";

    public static checkReqAuth(req: Request, res, next) {
        // don't serve /secure to those not logged in
        // you should add to this list, for each and every secure url
        if (req.url.indexOf(SecurityUtils.securePath + "/") === 0 &&
            !hallPassAPIs.find(path => req.url.includes(path)) &&
            (!req.session || !req.session.user)) {

            res.json({ retCode: -100 });
            return;
        }

        next();
    }

}