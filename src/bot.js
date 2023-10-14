require('dotenv').config();

const {Client, Events, GatewayIntentBits} = require('discord.js');

const { ask } = require('./ai.js');

const token = process.env.BOT_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on(Events.MessageCreate, async message => {
    if (message.content.startsWith('?')) {
        const prompt = message.content.substring(1);
        
        let answer = '';
        try {
            answer = await ask(prompt);
        } catch(err) {
            answer = err.message;
        }

        client.channels
            .fetch(message.channelId)
            .then(channel => channel.send(answer));
    }
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
