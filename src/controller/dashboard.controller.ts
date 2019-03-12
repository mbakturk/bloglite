import { PostDAO } from './../repo/post.dao';
import { User } from './../repo/entity/user';
import { UserDAO } from "./../repo/user.dao";
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost, requestParam, response, queryParam } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import * as session from "express-session";
import * as express from "express";
import { Post } from '../repo/entity/post';
import { switchMap, map } from 'rxjs/operators';
import { SecurityUtils } from '../utils';

@controller(SecurityUtils.securePath)
export class DashboardController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;
    private PAGE_SIZE: number = 10;

    @httpGet("/dashboard")
    private dashboardPage(@queryParam("page") page: string, @response() res: express.Response) {
        let mPage: number = 0;

        if (page) {
            mPage = +page - 1;
        }

        return this.postDAO.getLitePostList(this.PAGE_SIZE, this.PAGE_SIZE * mPage)
            .pipe(
                switchMap(postList => this.postDAO.getPostCount()
                    .pipe(map(c => ({ totalPage: Math.ceil(c / this.PAGE_SIZE), postList })))
                )
            ).toPromise()
            .then(r => {
                res.render("dashboard", { postList: r.postList, pageNum: mPage + 1, totalPage: r.totalPage === 0 ? 1 : r.totalPage });
            });
    }

}