import { User } from "./user";

export interface Post {
    id:number;
    title?:string;
    permalink?:string;
    postDate?:Date;
    updateDate?:Date;
    entry?:string;
    authorId?: number;
    authorName?: string;
    status: number;
}