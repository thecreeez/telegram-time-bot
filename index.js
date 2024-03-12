const TelegramBot = require('node-telegram-bot-api');
const UserService = require("./classes/UserService.js");
const ScheduleService = require("./classes/ScheduleService.js");
const DoingTypes = require('./classes/DoingTypes.js');

require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('text', (msg) => {
  const chatId = msg.chat.id;

  logMessage(chatId, "user", msg.text);
  let user = UserService.getOrCreate(chatId);

  let result = ScheduleService.parse(user, msg.text.toLowerCase());
  if (result) {
    UserService.save(user);
    sendMessage(chatId, `Время успешно отмечено. Спасибо! ${result}`);
    return;
  }

  let message = `Привет (или не привет, это стандартное сообщение), для того чтобы отметить время напиши следующим образом: 
[ВРЕМЯ] [ТИП] [НАЗВАНИЕ]

К примеру если я хочу отметить 3 часа работы я напишу: "3 работа РАБОТАЛ В ШАХТЕ"
Типы занятий:`;

  DoingTypes.getAll().forEach((type) => {
    message += `* ${type[1][1]}\n`;
  })

  sendMessage(chatId, message);
});

function sendMessage(chatId, message) {
  logMessage(chatId, "bot", message);
  bot.sendMessage(chatId, message);
}

function logMessage(chat, side, message) {
  console.log(`[${chat}][${side}]: ${message}`);
}