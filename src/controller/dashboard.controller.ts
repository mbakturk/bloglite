import { PostDAO } from './../repo/post.dao';
import { User } from './../repo/entity/user';
import { UserDAO } from "./../repo/user.dao";
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost, requestParam, response, queryParam } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import * as session from "express-session";
import * as express from "express";
import { Post } from '../repo/entity/post';

@controller("/s")
export class DashboardController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;
    private PAGE_SIZE: number = 10;

    @httpGet("/dashboard")
    private dashboardPage(@queryParam("page") page: string, @response() res: express.Response) {
        let mPage: number = 0;

        if (page) {
            mPage = +page - 1;
        }

        let postList: Post[] = this.postDAO.getPostLiteList(this.PAGE_SIZE, this.PAGE_SIZE * mPage);
        let totalPage: number = this.postDAO.getPostCount() / this.PAGE_SIZE;
        
        res.render("dashboard", { postList, pageNum: mPage + 1, totalPage: totalPage === 0 ? 1 : Math.ceil(totalPage) });
    }

}