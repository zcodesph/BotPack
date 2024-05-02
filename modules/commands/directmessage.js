module.exports.config = {
  name: "directmessage",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Deku",
  description: "Send a direct message to someone",
  commandCategory: "Miscellaneous",
  usages: "[fb url or uid | message]",
  cooldowns: 0,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {

  async function sendMessage(message) {
    api.sendMessage(message, event.threadID, event.messageID);
  }

  const parsedArgs = args.join(" ").split("|").map(item => item.trim());
  const recipient = parsedArgs[0];
  const messageContent = parsedArgs[1];

  if (!args[0] || !recipient) return sendMessage("Missing Facebook URL or UID");
  if (!messageContent) return sendMessage("Missing message");
  
  try {
    let recipientID;
    if (recipient.startsWith("https://facebook.com")) {
      const response = await api.getUID(recipient);
      recipientID = response;
    } else {
      recipientID = recipient;
    }

    api.sendMessage(`${messageContent}`, recipientID, () => sendMessage("Message has been sent successfully!"));
  } catch (error) {
    sendMessage("Failed to send the message. Please try again later.");
  }
};
