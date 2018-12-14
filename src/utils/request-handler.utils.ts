import { Request, Response, NextFunction } from "express";

export class RequestHandlerUtils {

    public static handle404(req: Request, res: Response, next: NextFunction) {
        res.status(404);
        res.render("404");
    }

    public static handle500(err: Error, req: Request, res: Response, next: NextFunction) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.render('500')
    }
}