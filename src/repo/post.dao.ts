import { injectable, inject } from "inversify";
import "reflect-metadata";
import { User } from "./entity/user";
import { Post } from "./entity/post";
import * as Database from "better-sqlite3";

@injectable()
export class PostDAO {

    @inject(Database) private _db: Database;

    public getPostList(count?:number, offset?:number): Post[] {
        let query: string = `SELECT p.id, p.title, p.permalink, p.post_date as postDate, p.entry, u.id as authorId, u.name as authorName 
        FROM t_post as p LEFT JOIN t_user u ON p.author == u.id`;

        if(Number.isInteger(offset) && Number.isInteger(count)) {
            query += ` LIMIT ${count} OFFSET ${offset}`;
        }

        return this._db.prepare(query).all();
    }

    public getPostLiteList(count?:number, offset?:number): Post[] {
        let query: string = `SELECT p.id, p.title, p.permalink, p.post_date as postDate, u.name as authorName 
        FROM t_post as p LEFT JOIN t_user u ON p.author == u.id`;

        if(Number.isInteger(offset) && Number.isInteger(count)) {
            query += ` LIMIT ${count} OFFSET ${offset}`;
        }

        return this._db.prepare(query).all();
    }

    public createPost(title: string, permalink: string, entry: string, authorId: number): number {
        return <number>this._db.prepare(
            `INSERT INTO t_post (title, permalink, entry, author) VALUES (?,?,?,?)`
        ).run(title, permalink, entry, authorId).lastInsertROWID;
    }

    public deletePostById(id: number): void {
        this._db.prepare(
            `DELETE FROM t_post WHERE id = ?`
        ).run(id);
    }

    public updatePost(post: Post): void {
        const updateables = ["title", "permalink", "entry"];
        let updates = [];

        updateables.forEach(property => {
            if (post[property]) {
                updates.push(`${property} = "${post[property]}"`);
            }
        });

        this._db.prepare(
            `UPDATE t_post SET ${updates.join(",")} WHERE id = ?`
        ).run(post.id);
    }

    public getPostByPermalink(permalink: string): Post {
        return this._db.prepare(
            `SELECT p.id, p.title, p.permalink, p.post_date as postDate, p.entry, u.id as authorId, u.name as authorName 
             FROM t_post as p LEFT JOIN t_user u ON p.author == u.id WHERE p.permalink = ?`
        ).get(permalink);
    }

    public getPostById(id: number): Post {
        return this._db.prepare(
            `SELECT p.id, p.title, p.permalink, p.post_date as postDate, p.entry, u.id as authorId, u.name as authorName 
             FROM t_post as p LEFT JOIN t_user u ON p.author == u.id WHERE p.id = ?`
        ).get(id);
    }

    public getPostCount(): number {
        let count:number = +this._db.prepare(`SELECT value FROM t_metadata WHERE key = 't_post_count'`).get().value;
        return Number.isInteger(count) ? count : 0;
    }

}