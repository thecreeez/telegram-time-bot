const TelegramBot = require('node-telegram-bot-api');
const UserService = require("./classes/UserService.js");
const ScheduleService = require("./classes/ScheduleService.js");
const DoingTypes = require('./classes/DoingTypes.js');
const CommandHandler = require("./classes/CommandHandler.js");

require("dotenv").config();

const message = `Привет (или не привет, это стандартное сообщение), для того чтобы отметить время напиши следующим образом: 
[ВРЕМЯ] [ТИП] [НАЗВАНИЕ]

К примеру если я хочу отметить 3 часа работы я напишу: "3 работа РАБОТАЛ В ШАХТЕ"
Типы занятий:
`;

async function start() {
  await CommandHandler.init();
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
  CommandHandler.bot = bot;

  bot.on('text', async (msg) => {
    const chatId = msg.chat.id;

    logMessage(chatId, "user", msg.text);
    let user = UserService.getOrCreate(msg);

    let result = ScheduleService.parse(user, msg.text.toLowerCase());
    if (result) {
      UserService.save(user);
      sendMessage(chatId, `Время успешно отмечено. Спасибо! ${result}`);
      return;
    }

    result = await CommandHandler.handle(user, msg);
    if (result) {
      return;
    }

    let response = message + "";
    DoingTypes.getAll().forEach((type) => {
      response += `* ${type[1][1]}\n`;
    })

    sendMessage(chatId, response);
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