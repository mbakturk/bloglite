import { MarkdownIt } from 'markdown-it';
import { PostDAO } from './../repo/post.dao';
import { User } from './../repo/entity/user';
import { UserDAO } from "./../repo/user.dao";
import "reflect-metadata";
import { interfaces, controller, httpGet, requestParam, response, queryParam } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import * as session from "express-session";
import * as express from "express";
import { Post } from '../repo/entity/post';
import markdownit = require('markdown-it');


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

        const postList: Post[] = this.postDAO.getPostList(this.PAGE_SIZE, this.PAGE_SIZE * mPage);
        postList.forEach(post => post.entry = this.md.render(post.entry));

        let totalPage: number = this.postDAO.getPostCount() / this.PAGE_SIZE;

        res.render("home", { postList, pageNum: mPage + 1, totalPage: totalPage === 0 ? 1 : Math.ceil(totalPage) });
    }

    @httpGet(":permalink")
    private postPage(@requestParam("permalink") permalink: string, @response() res: express.Response) {
        
        const post: Post = this.postDAO.getPostByPermalink(permalink);
        post.entry = this.md.render(post.entry);        

        res.render("post", { post });
    }

}