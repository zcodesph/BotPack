module.exports.config = {
    name: "genimg",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Your Name",
    description: "Generate an image based on a prompt",
    usePrefix: false,
    commandCategory: "Utility",
    usages: "[Prompt]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");

    const senderInfo = await api.getUserInfo(event.senderID);
    const senderName = senderInfo[event.senderID].name;

    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("Please provide a prompt.", event.threadID, event.messageID);

    try {
        const response = await axios.get(`https://deku-rest-api.replit.app/dalle?prompt=${encodeURIComponent(prompt)}`, { responseType: 'arraybuffer' });
        const imageData = response.data;

        // Save the image to a file
        const imagePath = __dirname + "/cache/image.png";
        fs.writeFileSync(imagePath, Buffer.from(imageData, 'utf-8'));

        // Send the image as an attachment
        api.sendMessage({
            body: `Here is the generated image based on the prompt from @${senderName}:`,
            mentions: [{
                tag: `@${senderName}`,
                id: event.senderID,
            }],
            attachment: fs.createReadStream(imagePath),
        }, event.threadID, () => {
            // Delete the image file after sending
            fs.unlinkSync(imagePath);
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
