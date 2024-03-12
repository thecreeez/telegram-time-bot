module.exports = class User {
  static fromJSON(json) {
    json = JSON.parse(json);

    if (!json._id) {
      return false;
    }

    let user = new this(json._id);
    
    for (let field in json) {
      user[field] = json[field];
    }

    return user;
  }

  constructor(id = null) {
    this._id = id;

    this.schedule = {}
  }

  toJSON() {
    let json = {};

    for (let field in this) {
      json[field] = this[field];
    }

    return JSON.stringify(json, null, 2);
  }

  getId() {
    return this._id;
  }
}