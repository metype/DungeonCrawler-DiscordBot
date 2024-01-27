import { Guild, Interaction } from "discord.js";
import { GameSession } from "./GameSession";
import { Logger } from './Logger'

import fs = require('node:fs');
import { Client, Collection, Intents } from 'discord.js';
var path = require('path');
const { token } = require(path.resolve(__dirname, "./config.json"));

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
	partials: ['USER', 'REACTION', 'CHANNEL', 'MESSAGE',],
});

const delay = (ms : number) => new Promise(res => setTimeout(res, ms));

let commands = new Collection<string, any>();

const commandFiles = fs.readdirSync('./commands').filter((file : String) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	commands.set(command.data.name, command);
}

function randomIntFromInterval(min : number, max : number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

client.once('ready', async () => {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
});

client.on("guildCreate", async (guild: Guild) => {
	const id = client.user?.id;
	if (id == undefined) return;
	const guildMember = guild.members.cache.get(id);
	if(guildMember == undefined) return;
	if (guild.systemChannel == undefined || !guild.systemChannel.permissionsFor(guildMember).has('SEND_MESSAGES')) {
		(await guild.fetchOwner()).send("Thanks for inviting me to your server!\nHope you enjoy playing!");
	} else { 
		guild.systemChannel?.send("Thanks for inviting me to your server!\nHope you enjoy playing!");
	} 

	await delay(5000);

	const fs = require('node:fs');
	const { REST } = require('@discordjs/rest');
	const { Routes } = require('discord-api-types/v9');
	var path = require('path');
	const { clientId, token } = require(path.resolve(__dirname, "./config.json"));

	const commands = [];

	const commandFiles = fs.readdirSync('./commands').filter((file: String) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: '9' }).setToken(token);

	rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands })
		.then(() => console.log(`Successfully registered application commands for ${guild.name}.`))
		.catch(console.error);
})

client.on('interactionCreate', async (interaction : Interaction) => {
  if (!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error : any) {
		console.error(error);
		await interaction.reply({ content: `An error was encountered while running this command\n${error.message}`, ephemeral: true });
	}
});

client.login(token);