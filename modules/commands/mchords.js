const axios = require('axios');

module.exports.config = {
  name: "music chords",
  version: "1.0",
  hasPermission: 0,
  usePrefix: true,
  prefix: "chords",
  credits: "Hazeyy",
  description: "Get the chords of a song",
  commandCategory: "music",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event || !event.body || !(event.body.toLowerCase().startsWith("?chords"))) return;

  const content = event.body.trim().slice(7); // Remove "chords" from the message

  try {
    // Make a request to the music chords API
    const response = await axios.get(`https://deku-rest-api.replit.app/search/chords?q=${encodeURIComponent(content)}`);

    if (response && response.data && response.data.chord) {
      const { title, artist, chords } = response.data.chord;
      // Send the chords as a message
      api.sendMessage({ body: `Chords for "${title}" by ${artist}:\n${chords}` }, event.threadID);
    } else {
      api.sendMessage({ body: `Sorry, I couldn't find chords for "${content}"` }, event.threadID);
    }
  } catch (error) {
    console.error('Error fetching chords:', error);
    api.sendMessage({ body: 'An error occurred while fetching chords. Please try again later.' }, event.threadID);
  }
};

