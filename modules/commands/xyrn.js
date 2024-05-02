const axios = require('axios');
const fs = require('fs').promises;

let fontEnabled = false;

function formatFont(text) {
  const fontMapping = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

module.exports.config = {
  name: "xyrn ultra",
  version: "4.7",
  hasPermission: 0,
  usePrefix: false,
  credits: "Hazeyy",
  description: "( Xyrn Ultra )",
  commandCategory: "chatbots",
  usages: "( Xyrn Ultra chatbot )",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event || !event.body || !(event.body.toLowerCase().startsWith("xx"))) return;

  const args = event.body.split(/\s+/);
  args.shift();

  if (args.length === 0) {
    api.sendMessage({ body: "🔮 𝙷𝚎𝚕𝚕𝚘, 𝙸 𝚊𝚖 Xyrn Ultra 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝚋𝚢 Google\n\n𝙷𝚘𝚠 𝚖𝚊𝚢 𝚒 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?" }, event.threadID);
    return;
  }

  const command = args[0].toLowerCase();
  if (command === "on") {
    fontEnabled = true;
    api.sendMessage({ body: "🔮 Xyrn Ultra ( 𝐀𝐈 )\n\n» 🟢 𝙵𝚘𝚗𝚝 𝙵𝚘𝚛𝚖𝚊𝚝𝚝𝚒𝚗𝚐 𝚒𝚜 𝚗𝚘𝚠 𝙴𝚗𝚊𝚋𝚕𝚎𝚍 «" }, event.threadID, event.messageID);
  } else if (command === "off") {
    fontEnabled = false;
    api.sendMessage({ body: "🔮 Xyrn Ultra ( 𝐀𝐈 )\n\n» 🔴 𝙵𝚘𝚗𝚝 𝙵𝚘𝚛𝚖𝚊𝚝𝚝𝚒𝚗𝚐 𝚒𝚜 𝚗𝚘𝚠 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 «" }, event.threadID, event.messageID);
  } else {
    const content = args.join(" ");

    try {
      // Get senderID from the event object
      const senderID = event.senderID;

      api.sendMessage({ body: "🗨️ | Xyrn AI is thinking..." }, event.threadID, event.messageID);

      // Include senderID in the URL
      const response = await axios.get(`https://deku-rest-api.replit.app/gpt4?prompt=${encodeURIComponent(content)}&uid=${senderID}`);

      // Log the response
      console.log("Response:", response.data);

      if (response && response.data && response.data.gpt4) {
        const formattedContent = formatFont(response.data.gpt4);
        api.sendMessage({ body: `\n${formattedContent}` }, event.threadID, event.messageID);
      } else {
        console.error('🚫 𝙴𝚛𝚛𝚘𝚛: 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 Xyrn 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚏𝚘𝚛𝚖𝚊𝚝');
        api.sendMessage({ body: '🚫 𝙴𝚛𝚛𝚘𝚛: 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝙼𝚎𝚝𝚊 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚏𝚘𝚛𝚖𝚊𝚝' }, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('🚫 𝙴𝚛𝚛𝚘𝚛:', error.message);
      api.sendMessage({ body: '🚫 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍' }, event.threadID, event.messageID);
    }
  }
};

