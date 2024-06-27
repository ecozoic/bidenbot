require("dotenv").config();

const { Client, Events, GatewayIntentBits } = require("discord.js");

const { ask, initiateDebate, debate } = require("./ai.js");

const token = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let isDebateActive = false;
const MAX_DEBATE_DEPTH = 2;
let currentDebateDepth = 0;

const COMMANDS = {
  ASK: "/biden",
  DEBATE: "/debate",
};

function parseCommand(content, command) {
  return content.substring(command.length + 1);
}

function isCommand(content, command) {
  return content.startsWith(command);
}

client.on(Events.MessageCreate, async (message) => {
  if (isCommand(message.content, COMMANDS.ASK)) {
    const prompt = parseCommand(message.content, COMMANDS.ASK);

    let answer = "";
    try {
      answer = await ask(prompt);
    } catch (err) {
      answer = err.message;
    }

    client.channels
      .fetch(message.channelId)
      .then((channel) => channel.send(answer));
  } else if (isCommand(message.content, COMMANDS.DEBATE)) {
    const prompt = parseCommand(message.content, COMMANDS.DEBATE);

    await initiateDebate();
    isDebateActive = true;
    currentDebateDepth = 0;

    // Biden goes first
    const response = await debate(prompt);
    currentDebateDepth++;

    client.channels
      .fetch(message.channelId)
      .then((channel) => channel.send(response.replace("BIDEN:", "").trim()));
  } else if (
    isDebateActive &&
    currentDebateDepth < MAX_DEBATE_DEPTH &&
    message.author.username === "Trumpbot"
  ) {
    const response = await debate(message.content);

    client.channels
      .fetch(message.channelId)
      .then((channel) => channel.send(response.replace("BIDEN:", "").trim()));

    if (++currentDebateDepth === MAX_DEBATE_DEPTH) {
      isDebateActive = false;
      currentDebateDepth = 0;
    }
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
