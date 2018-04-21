import { BaseResp } from './model/response/base.resp';
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
export class EditorController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;
    private PAGE_SIZE: number = 10;

    @httpGet("/editor")
    private editorPage(@queryParam("post") postId: string, @response() res: express.Response) {
        const viewModel: any = {}
        if (postId) {
            viewModel.post = this.postDAO.getPostById(+postId);
        }

        res.render("editor", viewModel);
    }

    @httpPost("/updatePost")
    private updatePost(req: Express.Request & express.Request, res: express.Response) {
        const resp: BaseResp = { retCode: -1 };
        const post: Post = req.body;
        if (post) {
            this.postDAO.updatePost(post)
            resp.retCode = 0;
        }

        res.send(JSON.stringify(resp));
    }

    @httpPost("/createPost")
    private createPost(req: Express.Request & express.Request, res: express.Response) {
        const resp: BaseResp = { retCode: -1 };
        const post: Post = req.body;
        if (post) {
            this.postDAO.createPost(post.title, Math.random() + "", post.entry, req.session.user.id);
            resp.retCode = 0;
        }

        res.send(JSON.stringify(resp));
    }

    @httpPost("/deletePost")
    private deletePost(req: Express.Request & express.Request, res: express.Response) {
        const resp: BaseResp = { retCode: -1 };
        const postId: number = req.body ? +req.body.id : null;
        if (postId) {
            this.postDAO.deletePostById(postId);
            resp.retCode = 0;
        }

        res.send(JSON.stringify(resp));
    }

}