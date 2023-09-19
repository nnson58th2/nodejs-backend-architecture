'use strict';

const { Client, GatewayIntentBits } = require('discord.js');

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        });

        // Add channelID
        this.channelId = process.env.DISCORD_CHANNEL_ID;

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.login(process.env.DISCORD_TOKEN);
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error(`Couldn't find the channel...`, this.channelId);
            return;
        }

        channel.send(message).catch((e) => console.error(`Error send message to channel:: `, e));
    }

    sendToFormatCode(logData) {
        const { code, message = 'This is some additional information about the code.', title = 'Code example' } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                    color: parseInt('00ff00', 16), // Convert hexadecimal color code to integer
                },
            ],
        };

        this.sendToMessage(codeMessage);
    }
}

const loggerService = new LoggerService();

module.exports = loggerService;
