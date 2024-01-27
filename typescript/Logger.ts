export class Logger {
    static log(...args: any[]) {
        const date = new Date();
        for (let i in args) {
            let prefix = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [INFO]`;
            process.stdout.write(prefix);
            this.prototype.destructure(args[i], 0, " ".repeat(prefix.length), '', 0);
        }
    }
    static info = Logger.log
    static debug(...args: any[]) {
        const date = new Date();

        for (let i in args) {
            let prefix = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [DEBUG]`;
            process.stdout.write(prefix);
            this.prototype.destructure(args[i], 0, " ".repeat(prefix.length), '', 0);
        }
    }
    static error(error: Error) {
        if (error.stack == undefined) return;
        const date = new Date();
        console.error(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [ERROR] ${error.name} : ${error.message}`);
        for (let i = 1; i < error.stack.split("\n").length; i++)
            console.error(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [ERROR]     ${error.stack.split("\n")[i]}`);
    }
    static warn(...args: any[]) {
        const date = new Date();
        for (let i in args) {
            let prefix = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [WARNING]`;
            process.stdout.write(prefix);
            this.prototype.destructure(args[i], 0, " ".repeat(prefix.length), '', 0);
        }
    }
    destructure(obj : object, indentation : number, precedent : String, objpref : String, it : Number) {
        console.log(JSON.stringify(obj, null, 2))
        // if (typeof obj != 'object') {
        //     console.log(' ' + obj);
        //     return;
        // }
        // ++indentation;
        // console.log((it==0)?' ':precedent + ` ${"    ".repeat(indentation - 1)}${((objpref.length > 0) ? objpref + ': ' : '')}${(Array.isArray(obj) ? '[' : '{')}`);
        // let k: keyof typeof obj;  // Type is "one" | "two" | "three"
        // for (const [key, value] of Object.entries(obj)) {
        //     if (typeof value != 'object') {
        //         console.log((it==0)?' ':precedent + ` ${"    ".repeat(indentation)}${Array.isArray(obj) ? '' : key + ': '}${value}${Array.isArray(obj) ? ',' : ''}`);
        //         continue;
        //     }
        //     this.destructure(value, indentation, precedent, key, 1);
        // }
        // console.log((it==0)?' ':precedent + ` ${"    ".repeat(indentation - 1)}${(Array.isArray(obj) ? ']' : '}')}`);
    }
}