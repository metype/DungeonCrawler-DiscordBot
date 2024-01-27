"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require('@discordjs/builders');
const Games_1 = require("../Games");
const GameSession_1 = require("../GameSession");
var GameSessions = require('../GameSessions').default;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Lets you test your game!')
        .addBooleanOption((option) => option.setName("verbose")
        .setDescription("Wether or not to tell you almost everything.")
        .setRequired(false)),
    async execute(interaction) {
        await interaction.reply({ content: "Loading games...", ephemeral: true });
        let mCollector = interaction.channel?.createMessageCollector({ filter: (message) => message.author.id == interaction.user.id, time: 300000 });
        let reply = true;
        mCollector?.on('collect', async (message) => {
            if (message.attachments.size > 0) {
                reply = false;
                mCollector?.stop();
                let file = message?.attachments?.first()?.url;
                if (file == undefined)
                    return;
                let data = await (new Games_1.Games().getPage(file));
                new GameSession_1.GameSession({
                    data: data,
                    player: interaction.user,
                }).game(0);
            }
        });
        mCollector?.on('end', () => {
            if (!reply)
                return;
            interaction.followUp({ content: 'No file was uploaded to debug!', ephemeral: true });
        });
    },
};
