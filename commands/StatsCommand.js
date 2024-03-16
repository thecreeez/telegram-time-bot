const Command = require("../classes/Command.js")
const ImageService = require('../classes/ImageService.js');

module.exports = class StatsCommand extends Command {
  static ids = ["stats", "стата", "с"];

  static async run(user, msg, args) {
    let statUser = user;

    if (args.length > 0) {
      statUser = UserService.getById(args[0]);
    }

    if (!statUser) {
      statUser = user;
    }

    ImageService.createStatsForUser(statUser, (user, path) => {
      this.getBot().sendPhoto(user.getId(), path);
    });
  }
}