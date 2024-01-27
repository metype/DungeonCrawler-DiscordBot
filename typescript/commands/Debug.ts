import { SlashCommandBooleanOption } from "@discordjs/builders";
import { Collection, CommandInteraction, Message, StringMappedInteractionTypes } from "discord.js";
import { StickerType } from "discord.js/node_modules/discord-api-types";
const { SlashCommandBuilder } = require('@discordjs/builders');
import { Games } from '../Games';
import { GameSession } from "../GameSession";
var GameSessions = require('../GameSessions').default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Lets you test your game!')
    .addBooleanOption((option : SlashCommandBooleanOption) =>
        option.setName("verbose")
          .setDescription("Wether or not to tell you almost everything.")
          .setRequired(false)
      ),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: "Loading games...", ephemeral: true });
        let mCollector = interaction.channel?.createMessageCollector({ filter: (message: Message) => message.author.id == interaction.user.id, time: 300000 });
        let reply = true;
        mCollector?.on('collect', async (message: Message) => {
            if (message.attachments.size > 0) {
                reply = false;
                mCollector?.stop();
                let file = message?.attachments?.first()?.url;
                if (file == undefined) return;
                let data = await (new Games().getPage(file));
                new GameSession({
                    data: data,
                    player: interaction.user,
                }).game(0);
            }
        })

        mCollector?.on('end', () => {
            if (!reply) return;
            interaction.followUp({ content: 'No file was uploaded to debug!', ephemeral: true });
        })
    },
};