const Command = require("../classes/Command.js");
const CommandHandler = require("../classes/CommandHandler.js");

module.exports = class CatPictureCommand extends Command {
  static ids = ["помощь", "help"];

  static async run(user, msg, args) {
    let message = `---- Помощь ----\n`;
    for (let commandName in CommandHandler.commandClasses) {
      let commandClass = CommandHandler.commandClasses[commandName];

      if (commandClass.public)
        message += `${commandClass.ids[0] === Command.DEFAULT ? "Команда по умолчанию" : commandClass.ids[0]} - ${commandClass.getDescription()}\n`
    }

    user.sendMessage(message);
  }

  static getDescription() {
    return `Позволяет вывести описания команд.`;
  }
}