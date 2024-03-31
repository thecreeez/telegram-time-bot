const Command = require("../classes/Command.js")
const ImageService = require('../classes/ImageService.js');
const ScheduleService = require("../classes/ScheduleService.js");
const UserService = require("../classes/UserService.js");

module.exports = class StatsCommand extends Command {
  static ids = ["настроение", "вайб"];
  static public = true;

  static async run(user, msg, args) {
    if (args.length < 1) {
      user.sendMessage(`Слишком мало аргументов`)
      return;
    }

    if (isNaN(args[0])) {
      user.sendMessage(`Первый аргумент должен быть числом`)
      return;
    }

    if (args[0] == "") {
      user.sendMessage(`Первый аргумент не может быть пустым`)
      return;
    }

    if (args[0] > 10) {
      args[0] = 10;
    }

    if (args[0] < 0) {
      args[0] = 0;
    }

    let description = false;

    ScheduleService.checkAndCreateTodayInUser(user);
    ScheduleService.setTodayVibe(user, Number(args[0]));
    UserService.save(user);
    user.sendMessage(`Настроение записано! ${args[0]}/10 (${ScheduleService.getTodayId()})`);
  }

  static getDescription() {
    let description = ``;
    description += `Позволяет ввести настроение на сегодня (Изменить значение можно в течении дня)\n`;
    description += "/ Ввод происходит по 10-бальной шкале\n";
    description += "/ Например: настроение 10\n";
    description += "/ Вывод: Сегодня ты супер заряженный и настроение 10/10";

    return description;
  }
}