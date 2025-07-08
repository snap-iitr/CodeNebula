const { Groq } = require('groq-sdk');
const { GROQ_API_KEY } = require('./index');
module.exports = new Groq({ apiKey: GROQ_API_KEY });
