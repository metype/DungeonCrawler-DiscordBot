"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Games = void 0;
const request = require('request');
class Games {
    names;
    constructor() {
        this.names = "";
    }
    getPage(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error)
                    reject(error);
                if (response.statusCode != 200) {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                resolve(body);
            });
        });
    }
}
exports.Games = Games;
