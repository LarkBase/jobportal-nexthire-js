const {OpenAI} = require("openai")
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Reads from .env file
});

module.exports = openai;
