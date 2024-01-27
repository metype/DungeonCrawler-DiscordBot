const inquirer = require('inquirer');
import { Logger } from "./Logger";
import { Menthol } from "./MentholInterpreter";
const fs = require("fs");
const debugData = fs.readFileSync("games/Heist.mth").toString();
let MentholInstance = new Menthol(debugData, 0)
let storyID = 0;

async function playGame() {
    let optionsArray : string[] = [];
    MentholInstance.storyLines.find(element => element.id == storyID)?.options.forEach((option, idx) => {
        optionsArray.push((idx+1) + ") " + option.text);
    })
    if (MentholInstance.storyLines.find(element => element.id == storyID)?.isEnding) {
        console.log(MentholInstance.storyLines.find(element => element.id == storyID)?.text);
        process.exit(0);
    }
    let temp: undefined | number;
    if (MentholInstance.storyLines.find(element => element.id == storyID)?.options.length == 1 && MentholInstance.storyLines.find(element => element.id == storyID)?.options[0].single) {
        let choice = await inquirer.prompt({
            "name": "gamePrompt",
            "type": "list",
            "message": MentholInstance.storyLines.find(element => element.id == storyID)?.text,
            "choices": ["Continue"],
        })
        temp = MentholInstance.storyLines.find(element => element.id == storyID)?.options[0].goToID;
    } else {
        let choice = await inquirer.prompt({
            "name": "gamePrompt",
            "type": "list",
            "message": MentholInstance.storyLines.find(element => element.id == storyID)?.text,
            "choices": optionsArray,
        })
        let chosen = choice.gamePrompt.split(")")[0];
        temp = MentholInstance.storyLines.find(element => element.id == storyID)?.options[+chosen - 1].goToID;
    }
    if (temp == undefined) process.exit(1);
    storyID = temp;
    playGame();
}

playGame();