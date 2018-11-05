import { map } from 'rxjs/operators';
import { MarkdownIt } from 'markdown-it';
import { PostDAO } from './../repo/post.dao';

import "reflect-metadata";
import { interfaces, controller, httpGet, requestParam, response, queryParam } from "inversify-express-utils";
import { inject } from "inversify";
import * as express from "express";
import markdownit = require('markdown-it');
import { zip } from 'rxjs';


@controller("/")
export class PostController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;
    @inject(markdownit) private md: MarkdownIt;
    private PAGE_SIZE: number = 10;

    @httpGet("/")
    private homePage(@queryParam("page") page: string, @response() res: express.Response) {
        let mPage: number = 0;

        if (page) {
            mPage = +page - 1;
        }
        return zip(this.postDAO.getPostList(this.PAGE_SIZE, this.PAGE_SIZE * mPage), this.postDAO.getPostCount())
            .pipe(
                map(d => ({
                    postList: d[0].map(post => {
                        post.entry = this.md.render(post.entry)
                        return post;
                    }),
                    totalPage: Math.ceil(d[1] / this.PAGE_SIZE)
                }))
            ).toPromise()
            .then(r => {
                res.render("home", { postList: r.postList, pageNum: mPage + 1, totalPage: r.totalPage });
            })


    }

    @httpGet("p/:permalink")
    private postPage(@requestParam("permalink") permalink: string, @response() res: express.Response) {
        return this.postDAO.getPostByPermalink(permalink)
            .pipe(
                map(post => {
                    post.entry = this.md.render(post.entry);
                    return post;
                })
            ).toPromise()
            .then(post => {
                res.render("post", { post });
            })
    }

}