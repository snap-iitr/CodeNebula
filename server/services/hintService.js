const groq = require('../config/groq');

async function getHint(questionHtml, userInput) {
  const resp = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: `You are an assistant for a competitive coding game.
            Your job is to provide only:
            - explanations
            - hints
            - clarifications

            You must NOT:
            - give code
            - give the correct answer
            - suggest output values

            Provide output only in text form in one paragraph (don't make points) using only alphanumeric charaters` },
      { role: 'user', content: `Question:\n${questionHtml}\nUser input:\n${userInput}` }
    ],
    model: 'mistral-saba-24b',
    temperature: 0.6,
    max_completion_tokens: 128,
  });
  return resp.choices[0].message.content.trim();
}

module.exports = { getHint };
