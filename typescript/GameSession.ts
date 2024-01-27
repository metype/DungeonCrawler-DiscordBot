import { Client, GuildMember, MessageEmbed, User } from "discord.js";
import { Menthol } from "./MentholInterpreter";

interface GameSessionOptions {
    player: User | GuildMember;
    file?: string;
    data?: string;
}

export class GameSession {
    menthol: Menthol;
    player: User | GuildMember;

    constructor(options: GameSessionOptions) {
        if (options.file) {
            const fs = require("fs");
            const data = fs.readFileSync(options.file).toString();
            this.menthol = new Menthol(data, 0);
        } else if (options.data) {
            this.menthol = new Menthol(options.data, 0);
        } else throw(new TypeError("Neither data, not a filepath was passed into a gamesession, this is an invalid state.")) 
        this.player = options.player;
    }

    intToString = (int : number) => {
        switch (int) {
            case 1:
                return '1⃣'
            case 2:
                return '2⃣'
            case 3:
                return '3⃣'
            case 4:
                return '4⃣'
            case 5:
                return '5⃣'
            case 6:
                return '6⃣'
            case 7:
                return '7⃣'
            case 8:
                return '8⃣'
            case 9:
                return '9⃣'
        }
    }

    async game(storyID: number) {
        let embed: MessageEmbed;
        if ((this.menthol.storyLines.find(element => element.id == storyID)?.options.length == 1 && this.menthol.storyLines.find(element => element.id == storyID)?.options[0].single)) {
            let text = this.menthol.storyLines.find(element => element.id == storyID)?.text;
            if (text == undefined) return;
            embed = new MessageEmbed()
                .addField('Story', text, false)
                .setFooter('React to the arrow to continue.');
        } else if (this.menthol.storyLines.find(element => element.id == storyID)?.isEnding) {
            let text = this.menthol.storyLines.find(element => element.id == storyID)?.text;
            if (text == undefined) return;
            embed = new MessageEmbed()
                .setTitle("Ending")
                .setDescription(text)
                .setFooter('This is an ending.');
        } else {
            let optionsArray : string[] = [];
            this.menthol.storyLines.find(element => element.id == storyID)?.options.forEach((option, idx) => {
                optionsArray.push((idx+1) + ") " + option.text);
            })
            let text = this.menthol.storyLines.find(element => element.id == storyID)?.text;
            if (text == undefined) return;
            embed = new MessageEmbed()
                .addField('Story', text, false)
                .addField('Options', optionsArray.join("\n"), false)
                .setFooter('Click the reaction corrosponding to your choice.');
        }
        const msg = (await this.player.send({ embeds: [embed] }));
        if (!(this.menthol.storyLines.find(element => element.id == storyID)?.options.length == 1 && this.menthol.storyLines.find(element => element.id == storyID)?.options[0].single) && !this.menthol.storyLines.find(element => element.id == storyID)?.isEnding) {
            let optionsLength = this.menthol.storyLines.find(element => element.id == storyID)?.options.length;
            if (optionsLength == undefined) return;
            for (let i = 0; i < ((optionsLength > 9) ? 9 : optionsLength); i++) await msg.react(`${this.intToString((i * 1) + 1)}`);
            await msg.awaitReactions({ max: 1, time: 300000, filter: (reaction, user) => !user.bot }).then((collected) => {
                if (optionsLength == undefined) return;
                for (let i = 0; i < ((optionsLength > 9) ? 9 : optionsLength); i++)
                        if (collected.first()?.emoji.name == this.intToString(+i+1)) {
                            let temp = this.menthol.storyLines.find(element => element.id == storyID)?.options[i].goToID;
                            if (temp == undefined) return;
                            this.game(temp);
                        }
            }).catch((error:any) => {
                console.log(error);
                    this.player.send('You did not choose in under 5 minutes, thanks for playing, your playsession has been terminated.');
                });

        } else if ((this.menthol.storyLines.find(element => element.id == storyID)?.options.length == 1 && this.menthol.storyLines.find(element => element.id == storyID)?.options[0].single)) {
            await msg.react(`➡`)
            await msg.awaitReactions({ max: 1, time: 300000, filter: (reaction, user) => !user.bot }).then(collected => {
                    let temp = collected.first();
                    if (temp == undefined) return;
                    if (temp.emoji.name = `➡`) {
                        let temp = this.menthol.storyLines.find(element => element.id == storyID)?.options[0].goToID;
                        if (temp == undefined) return;
                        this.game(temp);
                    }
                }).catch((error:any) => {
                    console.log(error);
                        this.player.send('You did not choose in under 5 minutes, thanks for playing, your playsession has been terminated.');
                    });
        } else if (this.menthol.storyLines.find(element => element.id == storyID)?.isEnding) return;
    }

}