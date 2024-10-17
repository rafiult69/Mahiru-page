const { callGeminiAPI } = require('../utils/callGeminiAPI');
module.exports = {
  name: 'gemini',
  description: 'gemini [question]',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      sendMessage(senderId, { text: '💬 | 🫱🏻‍🫲🏽...' }, pageAccessToken);
      const response = await callGeminiAPI(prompt);

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (response.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(response, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: response }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: '.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
