module.exports = class Command {
  static DEFAULT = "DEFAULT_COMMAND";

  static ids = ["unnamed"];
  static args = null;
  static bot = null;
  static public = false;

  static async startRun(user, msg, args) {
    console.log(`Runned command ${this.ids[0]} from user: ${user.getName()}. Args: ${args}`);
    this.run(user, msg, args);
  }
  
  static async run(user, msg, args) {
    console.log(`RUN IS NOT EXIST IN COMMAND: ${this.ids[0]}`);
  }

  static initArgs() {
    this.args = [];
  }

  static getBot() {
    return this.handler.getBot();
  }

  static getDescription() {
    return ` Описание отсутствует.`;
  }

  static getFlags(args) {
    let flags = {};

    args.forEach((argument, index) => {
      if (argument.startsWith("+")) {
        flags[argument.replaceAll("+", "")] = index;
      }
    })

    return flags;
  }
}