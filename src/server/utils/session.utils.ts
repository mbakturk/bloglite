import { Observable } from 'rxjs';
export class SessionUtils {
    public static save(session: Express.Session): Observable<boolean> {
        return Observable.create(observer => {
            session.save((err) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(true)
                }
            });
            observer.complete();
        });
    }

    public static destroy(session: Express.Session): Observable<boolean> {
        return Observable.create(observer => {
            session.destroy((err) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(true)
                }
            });
            observer.complete();
        });
    }
}