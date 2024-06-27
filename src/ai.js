const OpenAI = require("openai");

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
  apiKey,
});

const MODEL_PARAMS = {
  model: "gpt-4o",
  temperature: 0.7,
};

let DEBATE_MESSAGES = [];

function buildMessage(prompt, role = "user") {
  return { content: prompt, role };
}

async function request(messages) {
  console.log("** REQUEST **");
  console.log(messages);

  const response = await openai.chat.completions.create({
    ...MODEL_PARAMS,
    messages,
  });

  const message = response.choices[0].message;
  console.log("** RESPONSE **");
  console.log(message);

  return message.content;
}
async function ask(prompt) {
  prompt = `${prompt} in the voice of an angry, confused, and sleepy Joe Biden`;
  const answer = await request([buildMessage(prompt)]);

  return answer;
}

async function initiateDebate() {
  const prompt =
    "I would like to have a debate where you are the voice of Joe Biden and I am the voice of Donald Trump. We should try to disagree and poke fun at one another. You should prefix all your responses with BIDEN:. Is that ok?";
  DEBATE_MESSAGES = [buildMessage(prompt, "system")];

  const answer = await request(DEBATE_MESSAGES);

  DEBATE_MESSAGES.push(buildMessage(answer, "assistant"));
  return answer;
}

async function debate(prompt) {
  DEBATE_MESSAGES.push(buildMessage(prompt));
  const answer = await request(DEBATE_MESSAGES);

  DEBATE_MESSAGES.push(buildMessage(answer, "assistant"));
  return answer;
}

module.exports = {
  ask,
  initiateDebate,
  debate,
};
