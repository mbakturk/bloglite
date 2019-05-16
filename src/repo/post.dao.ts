import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Post } from "./entity/post";
import { Database } from "../database";
import { Observable, EMPTY } from "rxjs";
import { map } from "rxjs/operators";

@injectable()
export class PostDAO {

    @inject(Database) private db: Database;

    public getPostList(count: number, offset: number, status?:number): Observable<Post[]> {
        return this.db.queryAll(`SELECT p.*, u.id as authorId, u.name as authorName 
        FROM t_post as p LEFT JOIN t_user u ON p.author == u.id
        ${!isNaN(status) ? 'WHERE p.status = ' + status : '' } 
        ORDER BY p.post_date DESC LIMIT ? OFFSET ?`, [count, offset]);
    }

    public getLitePostList(count: number, offset: number): Observable<Post[]> {
        return this.db.queryAll(`SELECT p.id, p.title, p.permalink, p.post_date, p.status, u.name as authorName 
        FROM t_post as p LEFT JOIN t_user u ON p.author == u.id ORDER BY p.post_date DESC LIMIT ? OFFSET ?`, [count, offset]);
    }
    
    public createPost(title: string, permalink: string, entry: string, status: number, authorId: number): Observable<number> {
        return this.db.run("INSERT INTO t_post (title, permalink, entry, author, status) VALUES (?,?,?,?,?)", [title, permalink, entry, authorId, status])
        .pipe(map(data => data.lastID));
    }

    public deletePostById(id: number): Observable<any> {
        return this.db.run(`DELETE FROM t_post WHERE id = ?`, [id]);
    }

    public updatePost(post: Post): Observable<any> {
        const updateables = ["title", "permalink", "entry", "status"];
        let updates = [];
        const values = [];

        updateables.forEach(property => {
            const value = post[property];
            if (value) {
                updates.push(`${property} = ?`);
                values.push(value);
            }
        });

        if(values.length === 0) {
            return EMPTY;
        }

        values.push(post.id);        

        return this.db.run(`UPDATE t_post SET update_date = CURRENT_TIMESTAMP, ${updates.join(",")} WHERE id = ?`, values);
    }

    public getPostByPermalink(permalink: string): Observable<Post> {
        return this.db.query(`SELECT p.*, u.id as authorId, u.name as authorName 
             FROM t_post as p LEFT JOIN t_user u ON p.author == u.id
             WHERE p.permalink = ? AND p.status = 1`,[permalink]);
    }

    public getPostById(id: number): Observable<Post> {
        return this.db.query(
            `SELECT  p.*, u.id as authorId, u.name as authorName 
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