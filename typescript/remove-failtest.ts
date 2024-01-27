import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Logger } from './Logger'

import path = require('path');

const { clientId, token } = require(path.resolve(__dirname, "./config.json"));
    
const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.applicationCommands(clientId))
    .then((data : any) => {
        const promises = [];
        Logger.log(data);
        for (const command of data) {
            const deleteUrl: `/${string}` = `${Routes.applicationCommands(clientId)}/${command.id}`;
            if(command.name == 'fail-test')
                promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });