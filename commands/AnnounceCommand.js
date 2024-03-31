const Command = require("../classes/Command.js")
const UserService = require('../classes/UserService.js');

module.exports = class AnnounceCommand extends Command {
  static ids = ["уведомление"];

  static async run(user, msg, args) {
    UserService.getAll().forEach(userCandidate => {
      let message = args.join(" ");
      message = message.replaceAll("%username%", userCandidate.getName());
      this.getBot().sendMessage(userCandidate.getId(), message);
    })
  }
}