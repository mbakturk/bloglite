import * as moment from 'moment-timezone';

export class DateUtils {

    public static timezone: string;

    public static now() {
        return moment().tz(DateUtils.timezone);
    }
}