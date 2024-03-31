const Command = require("../classes/Command.js")
const UserService = require('../classes/UserService.js');
const RandomCatAPI = require('../classes/RandomCatAPI.js');

module.exports = class CatPictureCommand extends Command {
  static ids = ["всемкотят", "к"];

  static async run(user, msg, args) {
    let randomCatLink = await RandomCatAPI.getLink();
    
    if (randomCatLink === null) {
      user.sendMessage(`Не удалось отправить котят, чето барахлит, попробуй еще!`)
      return;
    }

    UserService.getAll().forEach(user => {
      this.getBot().sendPhoto(user.getId(), randomCatLink);
    })
  }
}