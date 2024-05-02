// const { fs } = require("lib");
const path = require("path");

module.exports.config = {
  name: "swap",
  version: "7.2",
  hasPermssion: 0,
  credits: "Hazeyy",
  description: "( 𝙵𝚊𝚌𝚎 𝚂𝚠𝚊𝚙 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝚂𝚠𝚊𝚙𝚙𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎𝚜/𝙵𝚊𝚌𝚎𝚜 )",
  cooldowns: 2,
  usePrefix: true
};

module.exports.handleEvent = async function ({ api, event, lib }) {
  if (!(event.body.toLowerCase().startsWith("swap"))) return;

  const args = event.body.split(/\s+/);
  args.shift();

  const reply = (message) => api.sendMessage(message, event.threadID, event.messageID);

  if (event.type === "message_reply") {
    const attachments = event.messageReply.attachments.filter(attachment => attachment.type === "photo");

    if (attachments.length >= 2) {
      const [url1, url2] = attachments.map(attachment => attachment.url);
      const processedImageURL = await axios.get(`https://haze-faceswap.replit.app/swap?swap_image=${encodeURIComponent(url1)}&target_image=${encodeURIComponent(url2)}`)
        .then(response => response.data.hazeswap);
      const processedImageStream = await lib.axios.get(processedImageURL, { responseType: "stream" });
      const filePath = path.resolve(__dirname, "cache", "swapped_image.jpg");

      processedImageStream.data.pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          api.sendMessage({
            body: "🔮 𝙸𝚖𝚊𝚐𝚎 𝚂𝚠𝚊𝚙 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢",
            attachment: fs.createReadStream(filePath)
          }, event.threadID, (err, messageInfo) => {
            if (err) {
              reply("🤖 𝙴𝚛𝚛𝚘𝚛 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚖𝚎𝚜𝚜𝚊𝚐𝚎: " + err);
            } else {
              fs.unlinkSync(filePath);
            }
          });
        })
        .on("error", error => reply(`🤖 𝙿𝚛𝚘𝚌𝚎𝚜𝚜𝚎𝚜𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎𝚜: ${error}`));
    } else {
      reply("🔮 𝙵𝚊𝚌𝚎 𝚂𝚠𝚊𝚙\n\n𝚄𝚜𝚊𝚐𝚎: 𝚜𝚠𝚊𝚙 [ 𝚛𝚎𝚙𝚕𝚢 1 𝚊𝚗𝚍 2 𝚒𝚖𝚊𝚐𝚎 ]");
    }
  }
};

module.exports.run = async function({ api, event }) {};
