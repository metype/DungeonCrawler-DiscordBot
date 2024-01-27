"use strict";
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('fail-test')
        .setDescription('Throws an error to test exception handler.'),
    async execute() {
        throw (new ReferenceError("This is a reference error."));
    },
};
