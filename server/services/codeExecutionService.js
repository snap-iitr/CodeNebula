const axios = require('axios');
const { PYTHON_API_URL } = require('../config');

async function runCode(languageCode, code, input) {
  const res = await axios.post(`${PYTHON_API_URL}/run`, { languageCode, code, input });
  return res.data.toString();
}

async function submitSolution(problemID, selectedLanguage, code, languageExtension) {
  const res = await axios.post(`${PYTHON_API_URL}/submit`, {
    problemID, selectedLanguage, code, languageExtension,
  });
  return res.data;
}

module.exports = { runCode, submitSolution };
