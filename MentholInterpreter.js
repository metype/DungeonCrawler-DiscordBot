"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menthol = void 0;
class Menthol {
    storyLines;
    variables;
    endings;
    constructor(fileContents, playMode) {
        this.storyLines = [];
        this.variables = [];
        this.endings = 0;
        this.preprocess(fileContents);
    }
    preprocess(code) {
        //Remove all comments from the string
        code = code.split('\n').filter(line => line.trim().indexOf('#') != 0).join('');
        //Fix the code to newline on semi-colon and not a newline character
        code = code.replace(/(?:[^"](?=(?:[^"]*?(?:["][^"]*?["][^"]*?)+$)|(?:[^"]*?$)))*|(^[^"]*["][^"]*$)/g, ($0, $1, $2) => ($0) ? $0.replace(/\s/g, '') : '').replace(/;/g, "\n").trim();
        let arr = code.split("\n");
        for (let i in arr) {
            let elementObj = { id: 0, text: "", isEnding: false, code: "", options: [] };
            let regMatch = arr[i].match(/\[(?:(?=(\\?))\1.)*?\]/);
            if (regMatch == null) {
                regMatch = arr[i].match(/\{(?:(?=(\\?))\1.)*?\}/);
                if (regMatch == null)
                    continue;
                elementObj.isEnding = true;
                this.endings++;
            }
            let storyElement = regMatch[0];
            elementObj.id = +storyElement.slice(1, storyElement.indexOf(':'));
            let regMatchOptions = arr[i].match(/\((?:(?=(\\?))\1.)*?\)/);
            if (regMatchOptions == null && elementObj.isEnding == false)
                throw (`Preprocessor parse error! -> No options specified for Element ${elementObj.id}`);
            if (isNaN(elementObj.id))
                throw (`Preprocessor parse error! -> Element ID "${storyElement.slice(1, storyElement.indexOf(':'))}" is not a number!`);
            if (regMatchOptions != null) {
                console.log(("{\"options\":[" + regMatchOptions[0].slice(1, regMatchOptions[0].length - 1) + "]}").replace(/([0-9]{1,}:)/g, ''));
                let options = JSON.parse(("{\"options\":[" + regMatchOptions[0].slice(1, regMatchOptions[0].length - 1) + "]}").replace(/([0-9]{1,}:)/g, '')).options;
                let IDs = (regMatchOptions[0].slice(1, regMatchOptions[0].length - 1)).split(',');
                if (options.length == 1 && IDs.length == 1) {
                    let option = { goToID: +IDs[0], text: '', single: true };
                    elementObj.options.push(option);
                }
                else {
                    IDs.forEach((str, idx, IDs) => {
                        let arr = str.split(":");
                        let newString = "";
                        for (let i = 0; i < arr.length - 1; i++) {
                            newString += arr[i];
                        }
                        IDs[idx] = newString;
                    });
                    for (let i in options) {
                        let option = { goToID: +IDs[+i], text: options[+i], single: false };
                        elementObj.options.push(option);
                    }
                }
            }
            let text = storyElement.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
            if (text == null)
                throw (`Preprocessor parse error! -> No assigned text for Element ${elementObj.id}!`);
            elementObj.text = text[0].slice(1, text[0].length - 1);
            elementObj.text = elementObj.text.replace("%i%/", `${this.endings}/`);
            this.storyLines.push(elementObj);
        }
        let element;
        for (element of this.storyLines) {
            element.text = element.text.replace("%t%", this.endings.toString());
        }
    }
}
exports.Menthol = Menthol;
