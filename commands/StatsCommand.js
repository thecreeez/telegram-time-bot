const Command = require("../classes/Command.js")
const ImageService = require('../classes/ImageService.js');
const UserService = require("../classes/UserService.js");

module.exports = class StatsCommand extends Command {
  static ids = ["stats", "стата", "с"];
  static public = true;

  static async run(user, msg, args) {
    let statUser = user;
    let type = "default";

    let flags = this.getFlags(args);

    if (flags["user"] != undefined && args.length > flags["user"] + 1) {
      statUser = UserService.getById(args[flags["user"] + 1]);
    }

    if (!statUser) {
      statUser = user;
    }

    if (flags["type"] != undefined && args.length > flags["type"] + 1) {
      type = args[flags["type"] + 1];
    }

    ImageService.createStatsForUser(statUser, type, (statUser, path) => {
      user.sendPhoto(path);
    });
  }

  static getDescription() {
    return `Позволяет вывести статистику (через диаграмы)`;
  }
}