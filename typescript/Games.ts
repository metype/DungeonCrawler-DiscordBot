const request = require('request');

export class Games {
    names: string;
    constructor() {
        this.names = "";
    }

    getPage(url: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            request(url, (error: Error, response: any, body: any) => {
                if (error) reject(error);
                if (response.statusCode != 200) {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                resolve(body);
            });
    });
}
}