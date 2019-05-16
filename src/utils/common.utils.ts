import * as camelCase from 'camelcase';

export class CommonUtils {

    public static generatePermalink(text: string): string {
        const specialCharDictionary = {'ş':'s', 'ı':'i','ğ':'g','ö':'o','ç':'c','ü':'u'};
        let permalink = text.toLocaleLowerCase();
        
        Object.keys(specialCharDictionary).forEach((key) => {
            permalink = CommonUtils.replaceAll(permalink, key, specialCharDictionary[key]);
        });

        permalink = permalink
        // replace unknow characters to space
        .replace(/\W/g, ' ')
        // replace more then 1 space with only one
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s+/g, '-');     

        return permalink;
    }

    public static replaceAll(target: string, search: string, replacement: string): string {
        return target.replace(new RegExp(search, 'g'), replacement);
    }

    public static camelcase(data): any {
        if (data instanceof Array) {
            for (let i = 0, l = data.length; i < l; i++) {
                const temp = data[i];
                for (const key in temp) {
                    const value = temp[key];
                    delete temp[key];
                    temp[camelCase(key)] = value;
                }
            }
        }

        return data;
    }
}