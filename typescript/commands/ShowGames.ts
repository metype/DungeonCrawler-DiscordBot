import { CommandInteraction } from "discord.js";
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('show-list')
		.setDescription('Shows the list of games available to play whenever!'),
	async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: "Loading games...", ephemeral: true });
        const games = fs.readdirSync('./games').filter((file: string) => file.endsWith('.mth'));
        let arrayOfGames: string[] = [];
        for (let i = 0; i < games.length; i++) {
            arrayOfGames.push(`${i+1}) ${games[i].split('.')[0]}`);
        }
        interaction.followUp({ content: arrayOfGames.join("\n"), ephemeral: true });
	},
};