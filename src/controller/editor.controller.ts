import { BaseResp } from './model/response/base.resp';
import { PostDAO } from './../repo/post.dao';
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost, response, queryParam } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { Post } from '../repo/entity/post';
import { map } from 'rxjs/operators';

@controller("/s")
export class EditorController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;

    @httpGet("/editor")
    private editorPage(@queryParam("post") postId: string, @response() res:Response) {
        return this.postDAO.getPostById(+postId)
            .pipe(
                map(post => ({ post }))
            ).toPromise()
            .then(viewModel => res.render("editor", viewModel))
    }

    @httpPost("/updatePost")
    private updatePost(req: Request, res: Response) {
        const resp: BaseResp = { retCode: -1 };
        const post: Post = req.body;
        if (post) {
            return this.postDAO.updatePost(post)
                .toPromise()
                .then(r => {
                    resp.retCode = 0;
                    res.json(resp);
                });
        }

        res.json(resp);
    }

    @httpPost("/createPost")
    private createPost(req: Request, res: Response) {
        const resp: BaseResp = { retCode: -1 };
        const post: Post = req.body;
        if (post) {
            return this.postDAO.createPost(post.title, Math.random() + "", post.entry, req.session.user.id)
                .toPromise()
                .then(r => {
                    resp.retCode = 0;
                    res.json(resp);
                });
        }

        res.json(resp);
    }

    @httpPost("/deletePost")
    private deletePost(req: Request, res: Response) {
        const resp: BaseResp = { retCode: -1 };
        const postId: number = req.body ? +req.body.id : null;
        if (postId) {
            return this.postDAO.deletePostById(postId)
                .toPromise()
                .then(r => {
                    resp.retCode = 0;
                    res.json(resp);
                })
        }
        res.json(resp);
    }

}