const OpenAI = require('openai');

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
    apiKey,
});

let DEBATE_MESSAGES = [];

function buildMessage(prompt, role = 'user') {
    return { content: prompt, role };
}

function parseResponse(response) {
    return response.choices[0].message.content;
}

async function ask(prompt) {
    prompt = `${prompt} in the voice of an angry, confused, and sleepy Joe Biden`;
    console.log(prompt);
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [buildMessage(prompt)],
        temperature: 0.7,
    });

    const answer = parseResponse(response);
    console.log(answer);
    return answer;
}

async function initiateDebate() {
    const prompt = 'I would like to have a debate where you are the voice of Joe Biden and I am the voice of Donald Trump. You should prefix all your responses with BIDEN:. Is that ok?';
    console.log(prompt);
    DEBATE_MESSAGES = [buildMessage(prompt, 'system')];

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: DEBATE_MESSAGES,
        temperature: 0.7,
    });

    const answer = parseResponse(response);
    console.log(answer);
    DEBATE_MESSAGES.push(buildMessage(answer, 'assistant'));
    console.log(DEBATE_MESSAGES);
    return answer;
}

async function debate(prompt) {
    DEBATE_MESSAGES.push(buildMessage(prompt));
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: DEBATE_MESSAGES,
        temperature: 0.7,
    });

    const answer = parseResponse(response);
    console.log(answer);
    DEBATE_MESSAGES.push(buildMessage(answer, 'assistant'));
    console.log(DEBATE_MESSAGES);
    return answer;
}

module.exports = {
    ask,
    initiateDebate,
    debate,
};