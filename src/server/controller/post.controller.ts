import { Error404 } from './../common/error/error-404';
import { map, switchMap } from 'rxjs/operators';
import { PostDAO } from './../repo/post.dao';

import "reflect-metadata";
import { interfaces, controller, httpGet, requestParam, response, queryParam, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Response, Request } from 'express';
import { zip } from 'rxjs';


@controller("/")
export class PostController implements interfaces.Controller {

    @inject(PostDAO) private postDAO!: PostDAO;
    private PAGE_SIZE: number = 10;

    /* @httpGet("/")
     private homePage(@queryParam("page") page: string, @response() res: Response) {
         let mPage: number = 0;
 
         if (page) {
             mPage = +page - 1;
         }
         return zip(this.postDAO.getPostList(this.PAGE_SIZE, this.PAGE_SIZE * mPage, 1), this.postDAO.getPostCount())
             .pipe(
                 map(d => ({
                     postList: d[0],
                     totalPage: Math.ceil(d[1] / this.PAGE_SIZE)
                 }))
             ).toPromise()
             .then(r => {
                 res.render("home", { postList: r.postList, pageNum: mPage + 1, totalPage: r.totalPage });
             })
 
 
     }*/

    @httpPost("api/getAllPosts")
    private getAllPosts(req: Request, res: Response) {
        let mPage: number = 0;
        const page = req.body.page;

         if (page) {
             mPage = +page - 1;
         }

        return this.postDAO.getPostList(this.PAGE_SIZE, this.PAGE_SIZE * mPage)
            .pipe(
                switchMap(postList => this.postDAO.getPostCount()
                    .pipe(map(c => ({ totalPage: Math.ceil(c / this.PAGE_SIZE), postList })))
                )
            )
            .toPromise()
            .then(resp => {
                res.json(resp);
            })
            .catch(err => {
                res.json({
                    retCode: -1,
                    retMsg: 'Internal Error'
                });
            })
    }

    @httpGet("p/:permalink")
    private postPage(@requestParam("permalink") permalink: string, @response() res: Response) {
        return this.postDAO.getPostByPermalink(permalink)
            .pipe(
                map(post => {
                    if (post) {
                        return post;
                    }
                    throw new Error404("Page not found")
                })
            ).toPromise()
            .then(post => {
                res.render("post", { post });
            })
            .catch(err => {
                if (err instanceof Error404) {
                    res.status(404);
                    res.render("404");
                }
            })
    }

}