import { injectable, inject } from "inversify";
import "reflect-metadata";
import { User } from './entity/user';
import * as Database from "better-sqlite3";

@injectable()
export class UserDAO {

    @inject(Database) private _db: Database;


    public getUserList(): User[] {
        return this._db.prepare('SELECT * FROM t_user').all();
    }

    public getUserByEmail(email:string): User {
        return this._db.prepare('SELECT * FROM t_user WHERE email = ?').get(email);
    }

    public getUserById(id: number): User {
        return this._db.prepare('SELECT * FROM t_user WHERE id = ?').get(id);
    }

}