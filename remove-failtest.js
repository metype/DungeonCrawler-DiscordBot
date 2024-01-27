"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const Logger_1 = require("./Logger");
const path = require("path");
const { clientId, token } = require(path.resolve(__dirname, "./config.json"));
const rest = new rest_1.REST({ version: '9' }).setToken(token);
rest.get(v9_1.Routes.applicationCommands(clientId))
    .then((data) => {
    const promises = [];
    Logger_1.Logger.log(data);
    for (const command of data) {
        const deleteUrl = `${v9_1.Routes.applicationCommands(clientId)}/${command.id}`;
        if (command.name == 'fail-test')
            promises.push(rest.delete(deleteUrl));
    }
    return Promise.all(promises);
});
