'use strict';

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const TOKEN = `MTE1MzcwMDU2NzA1MTQwNzUwMA.GEp7nK.LDHWlfyWWozGQPjTITEJuNPuq2j1GDIUUrsNGw`;
// 1153701865297559602  Server ID

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN);

client.on('messageCreate', (msg) => {
    if (msg.author.bot) return;

    if (msg.content === 'hello') {
        msg.reply(`Hello! How can I help you today!`);
    }
});
