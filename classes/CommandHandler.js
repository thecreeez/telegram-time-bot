const fs = require("fs");

module.exports = class CommandHandler {
  static PATH_TO_COMMANDS = "./commands/"
  static bot = null;

  static commands = {};
  static commandClasses = {};

  static async init() {
    if (!fs.existsSync(CommandHandler.PATH_TO_COMMANDS)) {
      fs.mkdirSync(CommandHandler.PATH_TO_COMMANDS);
    }

    let files = fs.readdirSync(CommandHandler.PATH_TO_COMMANDS);

    for (let file of files) {
      let fileArgs = file.split(".");

      if (fileArgs[fileArgs.length - 1] == "js") {
        await import("." + CommandHandler.PATH_TO_COMMANDS + file).then(m => {
          m.default.handler = this;
          this.commandClasses[fileArgs[0]] = m.default;

          m.default.ids.forEach((id) => {
            if (this.commands[id]) {
              console.error(`Command with id: ${id} already exist. (${fileArgs[0]})`);
            }

            this.commands[id] = m.default;
          })
        })
      }
    }
  }

  static async handle(user, msg) {
    let args = msg.text.split(" ")
    let command = args.shift();

    if (!this.commands[command]) {
      return false;
    }

    await this.commands[command].startRun(user, msg, args);
    return true;
  }

  static getBot() {
    return this.bot;
  }
}