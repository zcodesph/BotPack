module.exports.config = {
  name: "gv",
  role: 0,
  credits: "Deku", //Modiffied by churchill
  description: "can describe picture",
  version: "5.6.7",
  aliases: ["bard"],
  usage: "gv [picture-url]",
  commandCategory: "chatbots",
  usePrefix: false,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  let uid = event.senderID,
    url,
    prompt = args.join(" ");

  if (event.type == "message_reply") {
    if (event.messageReply.attachments[0]?.type == "photo") {
      url = encodeURIComponent(event.messageReply.attachments[0].url);
      api.sendTypingIndicator(event.threadID);
      try {
	console.log(`https://deku-rest-api.replit.app/gemini?prompt=${prompt}&url=${url}&uid=${uid}`);
	const response = (await axios.get(`https://deku-rest-api.replit.app/gemini?prompt=${prompt}&url=${url}&uid=${uid}`)).data;
        return api.sendMessage(response.gemini, event.threadID);
      } catch (error) {
        console.error(error);
        return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
      }
    } else {
      return api.sendMessage('Please reply to an image.', event.threadID);
    }
  } else if (prompt) {
    url = encodeURIComponent(args[args.length - 1]);
    api.sendTypingIndicator(event.threadID);
    try {
      const response = (await axios.get(`https://deku-rest-api.replit.app/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}&uid=${uid}`)).data;
      return api.sendMessage(response.gemini, event.threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
    }
  } else {
    return api.sendMessage(`Please enter a picture URL or reply to an image with "gemini answer this".`, event.threadID);
  }
};
