import { BaseResp } from './model/response/base.resp';
import { PostDAO } from './../repo/post.dao';
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost, response, queryParam } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { Post } from '../repo/entity/post';
import { map } from 'rxjs/operators';
import { CommonUtils, SecurityUtils } from '../utils';
import { Observable } from 'rxjs';
import { MarkdownIt } from 'markdown-it';

@controller(SecurityUtils.securityPath)
export class EditorController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;
    @inject('MarkdownIt') private md: MarkdownIt;

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
            return this.postDAO.createPost(post.title, post.permalink, post.entry, req.session.user.id)
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

    @httpPost("/getPermalink")
    private getPermalink(req: Request, res: Response) {
        let permalink = req.body.permalink || '';
        if (permalink) {
            permalink = CommonUtils.generatePermalink(permalink);
            let counter = 0, suffix = '';
            return Observable.create(observer => {
                const checkPermalink = (p) => {
                    p += suffix;
                    this.postDAO.isPermalinkExist(p)
                    .subscribe(r => {
                        if(r) {
                            suffix += '-' + (counter++);
                            checkPermalink(permalink);
                        } else {
                            observer.next(permalink);
                            observer.complete();
                        }
                    }, e => {
                        observer.error(e);
                        observer.complete();
                    })
                }
                checkPermalink(permalink);
            }).toPromise()
                .then(r => res.json({
                    retCode: 0,
                    retMsg: 'Success',                    
                    permalink
                })).catch(err => res.json({
                    retCode: 1,
                    retMsg: 'Generating permalink error'
                }))
        }

        return res.json({
            retCode: -1,
            retMsg: 'Input error'
        })
    }

    @httpPost("/convertToHTML")
    private convertToHTML(req: Request, res: Response) {
        const entry = this.md.render(req.body.entry);
        res.json({
            retCode: 0,
            retMsg: 'Success',
            entry
        });
    }


}