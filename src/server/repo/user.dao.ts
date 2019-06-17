import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { User } from "./entity/user";
import { Database } from "../database";

@injectable()
export class UserDAO {

    @inject(Database) private db!: Database;


    public getUserList(): Observable<User[]> {
        return this.db.queryAll("SELECT * FROM t_user");
    }

    public getUserByEmail(email:string): Observable<User> {
        return this.db.query('SELECT * FROM t_user WHERE email = ?', [email]);
    }

    public getUserById(id: number): Observable<User> {
        return this.db.query('SELECT * FROM t_user WHERE id = ?', [id]);
    }

}