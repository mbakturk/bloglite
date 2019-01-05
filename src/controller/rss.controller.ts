import "reflect-metadata";
import { Response, Request } from 'express';
import { httpGet, controller, interfaces } from 'inversify-express-utils';
import * as RSS from 'rss';
import { PostDAO } from "../repo/post.dao";
import { inject } from "inversify";
import { Config } from "../config-reader";

@controller("/")
export class RSSController implements interfaces.Controller {

    @inject(PostDAO) private postDAO: PostDAO;
    @inject('Config') private config: Config;

    @httpGet("rss")
    public rss(req: Request, res: Response) {
        const feed = new RSS({
            title: "mbakturk.com",
            description: "Yazılım Mühendisi / Kişisel Blog Sitesi",
            site_url: this.config.baseUrl,
            feed_url: this.config.baseUrl + "/rss",
            language: "tr"
        });

        return this.postDAO.getPostList(100, 0).toPromise()
        .then(postList => {

            postList.forEach(post => {
                feed.item({
                    title: post.title,
                    url: `${this.config.baseUrl}/p/${post.permalink}`,
                    date: post.postDate
                })
            })

            res.set('Content-Type', 'text/xml');
            res.send(feed.xml({ indent: true }));    
        });

        
    }    

}