const fs = require("fs");
const User = require("./User");

module.exports = class UserService {
  static getOrCreate(msg) {
    let id = msg.chat.id;
    let username = msg.chat.username;
    
    if (this.isUserExist(id)) {
      let userJson = fs.readFileSync(`./data/${id}.json`);

      return User.fromJSON(userJson);
    }

    let user = new User(id, username);

    return this.save(user);
  }

  static getById(id) {
    if (this.isUserExist(id)) {
      let userJson = fs.readFileSync(`./data/${id}.json`);

      return User.fromJSON(userJson);
    }

    return false;
  }

  static isUserExist(id) {
    if (!fs.existsSync(`./data`)) {
      fs.mkdirSync("./data");
    }

    return fs.existsSync(`./data/${id}.json`);
  }

  static save(user) {
    fs.writeFileSync(`./data/${user.getId()}.json`, user.toJSON());

    return user;
  }

  static getAll() {
    let users = [];
    fs.readdirSync("./data").forEach(
      id => users.push(this.getById(id.split(".")[0]))
    );

    return users;
  }
}