const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'lyrics',
  description: 'Fetch song lyrics',
  usage: 'lyrics <song name>',
  author: 'Coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const songQuery = args.join(' ') || 'Never Gonna Give You Up';
    const apiUrl = `https://joshweb.click/search/lyrics?q=${encodeURIComponent(songQuery)}`;

    try {
      const { data: { result: lyricsData } } = await axios.get(apiUrl);

      if (!lyricsData || !lyricsData.lyrics) {
        return await sendError(senderId, 'Error: Lyrics not found.');
      }

      const { title, artist, lyrics, image } = lyricsData;
      const lyricsMessage = `🎧 | 𝐓𝐢𝐭𝐥𝐞: ${title}\n🎙️ | 𝐀𝐫𝐭𝐢𝐬𝐭: ${artist}\n\n${lyrics}`;

      await sendMessage(senderId, { text: lyricsMessage }, pageAccessToken);

      if (image) {
        await sendMessage(senderId, {
          attachment: { type: 'image', payload: { url: image } }
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      await sendError(senderId, 'Error: Unable to fetch lyrics.');
    }
  },
};

const sendError = async (senderId, errorMessage) => {
  await sendMessage(senderId, { text: errorMessage }, token);
};
