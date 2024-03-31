const Command = require("../classes/Command.js");
const DoingTypes = require("../classes/DoingTypes.js");
const UserService = require("../classes/UserService.js");
const ScheduleService = require("../classes/ScheduleService.js");

module.exports = class DefaultCommand extends Command {
  static ids = [Command.DEFAULT];
  static public = true;

  static async run(user, msg, args) {
    let result = ScheduleService.parse(user, msg.text.toLowerCase());
    if (result) {
      UserService.save(user);
      user.sendMessage(`Время успешно отмечено. Спасибо! ${result}`);
      return;
    }

    user.sendMessage("Команда не распознана, введи: help/помощь для ПОМОЩИ)")
  }

  static getDescription() {
    let description = ``;
    description += `Позволяет ввести время в счетчик\n`;
    description += " / Ввод времени: [Кол-во часов] [Тип действия] [Описание]\n";
    description += " / Например: 5 отдых прилег зачилить\n";
    description += " / Типы действий:\n";

    DoingTypes.getAll().forEach((doingType) => {
      description += ` / * ${doingType[1][1]}\n`;
    });

    return description;
  }
}