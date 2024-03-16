module.exports = class Command {
  static ids = ["unnamed"];
  static bot = null;

  static async startRun(user, msg, args) {
    console.log(`Runned command ${this.ids[0]} from user: ${user.getName()}. Args: ${args}`);
    this.run(user, msg, args);
  }
  
  static async run(user, msg, args) {
    console.log(`RUN IS NOT EXIST IN COMMAND: ${this.ids[0]}`);
  }

  static getBot() {
    return this.handler.getBot();
  }
}