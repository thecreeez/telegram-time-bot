const DoingTypes = require("./DoingTypes.js");

module.exports = class ScheduleService {
  static parse(user, message) {
    let args = message.split(" ");

    if (args.length < 3) {
      return false;
    }

    if (isNaN(args[0])) {
      return false;
    }

    if (args.indexOf("") !== -1) {
      return false;
    }

    if (!DoingTypes.getByText(args[1])) {
      return false;
    }

    let time = args[0];
    let doingType = DoingTypes[DoingTypes.getByText(args[1])][0];
    let doingName = args[2];

    for (let i = 3; i < args.length; i++) {
      doingName += ` ${args[i]}`;
    }

    this._addTime(user, Number(time), doingType, doingName);
    return `${time} ч. / ${doingType} / ${doingName}`;
  }

  static _addTime(user, time, doingType, doingName) {
    this.checkAndCreateTodayInUser(user);
    let todayId = this.getTodayId();

    user.schedule[todayId].doing.push({
      time,
      doingType,
      doingName,
    })
  }

  static setTodayVibe(user, vibe) {
    this.checkAndCreateTodayInUser(user);
    let todayId = this.getTodayId();

    user.schedule[todayId].vibe = vibe;
  }

  static checkAndCreateTodayInUser(user) {
    let todayId = this.getTodayId();

    if (!user.schedule[todayId]) {
      user.schedule[todayId] = {
        doing: [],
      };
    }

    if (!user.schedule[todayId].doing) {
      user.schedule[todayId].doing = [];
    }
  }

  static getTodayId() {
    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return `${day}.${month}.${year}`;
  }
}
