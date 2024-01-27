import { SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { GameSession } from "../GameSession";
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-game')
		.setDescription('Lets you play a game!')
    .addStringOption((option: SlashCommandStringOption) =>
        option.setName("id")
          .setDescription("The ID of the game.")
          .setRequired(true)
      ),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: "Loading game...", ephemeral: true });
        const games = fs.readdirSync('./games').filter((file: string) => file.endsWith('.mth'));
        let ID = interaction.options.getString('id')
        if (ID == null) return;
        for (let i = 0; i < games.length; i++) {
            if (i + 1 == +ID || games[i].split('.')[0] == ID) {
                new GameSession({
                    file: `./games/${games[i]}`,
                    player: interaction.user,
                }).game(0);
            }
        }
	},
};