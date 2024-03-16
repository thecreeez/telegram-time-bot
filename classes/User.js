const DoingTypes = require("./DoingTypes");

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

  constructor(id = null, username = null) {
    this._id = id;
    this._username = username;

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

  getName() {
    return this._username;
  }

  getDataByDate(day, month, year) {
    return this.schedule[`${day},${month},${year}`];
  }

  getAllHoursByTypes() {
    let types = {
      _total: 0,
    };

    for (let date in this.schedule) {
      this.schedule[date].doing.forEach((scheduleItem) => {
        if (!types[scheduleItem.doingType]) {
          types[scheduleItem.doingType] = 0;
        }

        types[scheduleItem.doingType] += scheduleItem.time;
        types._total += scheduleItem.time;
      })
    }

    types._total = Math.floor(types._total * 10) / 10;

    return types;
  }

  getUnaccountedTime() {
    let unaccountedHours = 0;
    for (let date in this.schedule) {
      let hours = 24;
      this.schedule[date].doing.forEach((scheduleItem) => {
        hours -= scheduleItem.time;
      })

      unaccountedHours += hours;
    }

    return Math.floor(unaccountedHours * 10) / 10;
  }
}