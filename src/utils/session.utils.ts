import { Observable } from 'rxjs';
export class SessionUtils {
    public static saveSession(session: Express.Session): Observable<boolean> {
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
}