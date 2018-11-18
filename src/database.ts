import { injectable, inject } from "inversify";
import { Logger } from "winston";
import { Config } from "./config-reader";
import { Database as SqliteDatabase } from "sqlite3";
import { Observable } from "rxjs";

@injectable()
export class Database {

    @inject("Logger") private logger: Logger;
    private db: SqliteDatabase;

    constructor(@inject("Config") private config: Config) {
        this.db = new SqliteDatabase(this.config.database.path, (err) => {
            if (err) {
                return this.logger.error(`An error accoured while connection database. Error stack is ${err.stack}`);
            }
            this.logger.debug("Database connection is successful.");
        });
    }

    public queryAll(queryString: string, values?: Array<any>): Observable<any> {
        return this._query("all", queryString, values);
    }

    public query(queryString: string, values?: Array<any>): Observable<any> {
        return this._query("get", queryString, values);
    }

    public run(queryString, values?: Array<any>): Observable<any> {
        return this._query("run", queryString, values);
    }

    private _query(method: string, queryString: string, values?: Array<any>): Observable<any> {
        return Observable.create(observer => {
            this.db[method](queryString, values, (err, data?) => {
                if (err) {
                    this.logger.error(`An error accoured while querying db. Error stack it ${err.stack}`);
                    observer.error(err);
                } else {
                    observer.next(method === "run" ? this : data);
                }
                observer.complete();
            });
        });

    }
}