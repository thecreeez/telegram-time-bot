const fs = require("fs");
const User = require("./User");

module.exports = class UserService {
  static getOrCreate(id) {
    if (this.isUserExist(id)) {
      let userJson = fs.readFileSync(`./data/${id}.json`);

      return User.fromJSON(userJson);
    }

    let user = new User(id);

    return this.save(user);
  }

  static isUserExist(id) {
    return fs.existsSync(`./data/${id}.json`);
  }

  static save(user) {
    fs.writeFileSync(`./data/${user.getId()}.json`, user.toJSON());

    return user;
  }
}