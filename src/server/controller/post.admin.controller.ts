import { BaseResp } from './model/response/base.resp';
import { PostDAO } from '../repo/post.dao';
import "reflect-metadata";
import { interfaces, controller, httpGet, httpPost, response, queryParam } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { Post } from '../repo/entity/post';
import { map, switchMap } from 'rxjs/operators';
import { CommonUtils, SecurityUtils } from '../utils';
import { Observable } from 'rxjs';

@controller(SecurityUtils.securePath)
export class PostAdminController implements interfaces.Controller {

    @inject(PostDAO) private postDAO!: PostDAO;
    private PAGE_SIZE: number = 10;

    @httpPost("/post")
    private post(req: Request, res: Response) {
        return this.postDAO.getPostById(req.body.postId)
            .toPromise()
            .then(post => res.json({
                retCode: 0,
                post
            }));
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
            return this.postDAO.createPost(post.title!, post.permalink!, post.entry, post.status,
                req.session!.user.id)
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
        const postId: number | null = req.body ? +req.body.id : null;
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
                            if (r) {
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

    @httpPost("/getLitePostList")
    private getLitePostList(req: Request, res: Response) {
        let mPage: number = 0;
        const page = req.body.page;
        if (page) {
            mPage = +page - 1;
        }

        return this.postDAO.getLitePostList(this.PAGE_SIZE, this.PAGE_SIZE * mPage)
            .pipe(
                switchMap(postList => this.postDAO.getPostCount()
                    .pipe(map(c => ({ totalPage: Math.ceil(c / this.PAGE_SIZE), postList })))
                )
            ).toPromise()
            .then(data => {
                res.json(Object.assign(data, { retCode: 0 }));
            });
    }
}