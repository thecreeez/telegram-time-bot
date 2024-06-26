const TelegramBot = require('node-telegram-bot-api');
const UserService = require("./classes/UserService.js");
const CommandHandler = require("./classes/CommandHandler.js");

require("dotenv").config();

async function start() {
  await CommandHandler.init();
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
  CommandHandler.bot = bot;

  bot.on('text', async (msg) => {
    const chatId = msg.chat.id;

    logMessage(chatId, "user", msg.text);
    let user = UserService.getOrCreate(msg);
    user.__bot = bot;

    await CommandHandler.handle(user, msg);
  });

  function sendMessage(chatId, message) {
    logMessage(chatId, "bot", message);
    bot.sendMessage(chatId, message);
  }

  function logMessage(chat, side, message) {
    console.log(`[${chat}][${side}]: ${message}`);
  }
}

start()
