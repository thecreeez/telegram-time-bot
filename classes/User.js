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
      if (field.startsWith("__"))
        continue;

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
    return this.schedule[`${day}.${month}.${year}`];
  }

  getHoursByTypes({startDate = null, endDate = null} = {}) {
    let types = {
      _total: 0,
      _unaccounted: 0,
    };

    for (let date in this.schedule) {
      let [day, month, year] = date.split(".");
      let todayDate = new Date(year, month - 1, day);
      
      if (startDate !== null && todayDate.getTime() < startDate.getTime()) {
        continue;
      }

      if (endDate !== null && todayDate.getTime() > endDate.getTime()) {
        continue;
      }

      let accountedInDay = 0;
      this.schedule[date].doing.forEach((scheduleItem) => {
        if (!types[scheduleItem.doingType]) {
          types[scheduleItem.doingType] = 0;
        }

        types[scheduleItem.doingType] += scheduleItem.time;
        types._total += scheduleItem.time;
        accountedInDay += scheduleItem.time;
      })

      if (accountedInDay < 24) {
        types._unaccounted += 24 - accountedInDay;
      }
    }

    types._total = Math.floor(types._total * 10) / 10;
    types._unaccounted = Math.floor(types._unaccounted * 10) / 10;

    return types;
  }

  getVibes({ startDate = null, endDate = null } = {}) {
    let vibes = {
      _totalDays: 0,
    };

    for (let date in this.schedule) {
      let [day, month, year] = date.split(".");
      let todayDate = new Date(year, month - 1, day);

      if (startDate !== null && todayDate.getTime() < startDate.getTime()) {
        continue;
      }

      if (endDate !== null && todayDate.getTime() > endDate.getTime()) {
        continue;
      }

      vibes[date] = null;
      if (this.schedule[date].vibe) {
        vibes[date] = this.schedule[date].vibe;
      }
      vibes._totalDays++;
      console.log(date);
    }

    return vibes;
  }

  sendMessage(message) {
    this.__bot.sendMessage(this._id, message);
    console.log(`${this.getName()} recieved message: ${message}`);
  }

  sendPhoto(path) {
    this.__bot.sendPhoto(this._id, path);
  }
}