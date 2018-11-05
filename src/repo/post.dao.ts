import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Post } from "./entity/post";
import { Database } from "../database";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@injectable()
export class PostDAO {

    @inject(Database) private db: Database;

    public getPostList(count: number, offset: number): Observable<Post[]> {
        return this.db.queryAll(`SELECT p.id, p.title, p.permalink, p.post_date as postDate, p.entry, u.id as authorId, u.name as authorName 
        FROM t_post as p LEFT JOIN t_user u ON p.author == u.id LIMIT ? OFFSET ?`, [count, offset]);
    }

    public getPostLiteList(count: number, offset: number): Observable<Post[]> {
        return this.db.queryAll(`SELECT p.id, p.title, p.permalink, p.post_date as postDate, u.name as authorName 
        FROM t_post as p LEFT JOIN t_user u ON p.author == u.id LIMIT ? OFFSET ?`, [count, offset]);
    }
    
    public createPost(title: string, permalink: string, entry: string, authorId: number): Observable<number> {
        return this.db.run("INSERT INTO t_post (title, permalink, entry, author) VALUES (?,?,?,?)", [title, permalink, entry, authorId])
        .pipe(map(data => data.lastID));
    }

    public deletePostById(id: number): Observable<any> {
        return this.db.run(`DELETE FROM t_post WHERE id = ?`, [id]);
    }

    public updatePost(post: Post): Observable<any> {
        const updateables = ["title", "permalink", "entry"];
        let updates = [];

        updateables.forEach(property => {
            if (post[property]) {
                updates.push(`${property} = "${post[property]}"`);
            }
        });

        return this.db.run(
            `UPDATE t_post SET ${updates.join(",")} WHERE id = ?`, [post.id]
        );
    }

    public getPostByPermalink(permalink: string): Observable<Post> {
        return this.db.query(`SELECT p.id, p.title, p.permalink, p.post_date as postDate, p.entry, u.id as authorId, u.name as authorName 
             FROM t_post as p LEFT JOIN t_user u ON p.author == u.id WHERE p.permalink = ?`,[permalink]);
    }

    public getPostById(id: number): Observable<Post> {
        return this.db.query(
            `SELECT p.id, p.title, p.permalink, p.post_date as postDate, p.entry, u.id as authorId, u.name as authorName 
             FROM t_post as p LEFT JOIN t_user u ON p.author == u.id WHERE p.id = ?`, [id]);
    }

    public getPostCount(): Observable<number> {
        return this.db.query(`SELECT value FROM t_metadata WHERE key = 't_post_count'`)
            .pipe(map(row => {
                const count = +row.value;
                return Number.isInteger(count) ? count : 0;
            }));
    }

    public isPermalinkExist(permalink: string): Observable<boolean> {
        return this.db.query('SELECT permalink FROM t_post WHERE permalink = ?', [permalink])
        .pipe(map(row => {
            if(row) {
                return true;
            } else {
                return false;
            }
        }))
    }

}