const { createCanvas, loadImage } = require('canvas');
const fs = require("fs");
const DoingTypes = require('./DoingTypes');
const ScheduleService = require('./ScheduleService');

module.exports = class ImageService {
  static SIZE = [300 * 2 + 30, 300 * 2 + 15 + 300]

  static createStatsForUser(user, type, onCreated = null) {
    const canvas = createCanvas(ImageService.SIZE[0], ImageService.SIZE[1]);

    if (!ImageService[`${type}_fill`]) {
      type = "default";
    }

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = `rgb(59,58,58)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ImageService[`${type}_fill`](user, canvas);

    if (!fs.existsSync('images')) {
      fs.mkdirSync("images");
    }

    let path = `images/${user.getId()}.png`;

    const out = fs.createWriteStream(path);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
      if (onCreated) {
        onCreated(user, path);
      }
    })

    return path;
  }

  static default_fill(user, canvas) {
    const ctx = canvas.getContext('2d');
    this._drawHeader(user, ctx);
    this._drawDiagram({
      pos: [15, 35],
      radius: 300,
      data: user.getHoursByTypes(),
      ctx
    })
  }

  static weekly_fill(user, canvas) {
    const ctx = canvas.getContext('2d');
    this._drawHeader(user, ctx, "недельная");
    let [day, month, year] = ScheduleService.getTodayId().split(".");
    let todayDate = new Date(year, month - 1, day);
    let lastWeekDate = new Date(year, month - 1, day - 7);

    this._drawDiagram({
      pos: [15, 35],
      radius: 300,
      data: user.getHoursByTypes({
        startDate: lastWeekDate,
        endDate: todayDate
      }),
      ctx
    });

    /**
     * TO-DO: интересные факты (на сколько процентов изменилось по сравнению с прошлой неделей)
     */
  }

  static mood_fill(user, canvas, daysInPast = 7) {
    let [day, month, year] = ScheduleService.getTodayId().split(".");
    let todayDate = new Date(year, month - 1, day);
    let lastWeekDate = new Date(year, month - 1, day - daysInPast);

    const ctx = canvas.getContext('2d');
    this._drawHeader(user, ctx, "настроение");
    this._drawGraphic({
      pos: [30,30],
      pointWidth: 5,
      pointConnected: true,
      ctx,
      data: user.getVibes({
        startDate: lastWeekDate,
        endDate: todayDate
      })
    });
  }

  static _drawHeader(user, ctx, description = "") {
    ctx.font = `25px arial`;
    ctx.fillStyle = `white`;
    let text = `${user.getName()}`;

    if (description !== "") {
      text += ` - ${description}`;
    }

    ctx.fillText(text, 15, 30);
  }

  static _drawGraphic({ pos, pointWidth, pointConnected, data, ctx }) {
    let totalSize = this.SIZE[0] - pos[0] * 2;
    let spaceBetween = totalSize / (data._totalDays - 1);

    let i = 0;
    let prevPosition = null;
    for (let date in data) {
      if (date.startsWith("_")) {
        continue;
      }

      let mood = data[date];

      if (mood === null) {
        mood = 5;
      }

      let pointPosition = [pos[0] + i++ * spaceBetween, pos[1] - mood * 30 + 350];

      ctx.fillStyle = `white`;
      ctx.fillText(mood, pointPosition[0] - ctx.measureText(mood).width / 2, pointPosition[1] - 10);

      let [day, month, year] = date.split(".");
      let todayDate = new Date(year, month - 1, day);

      let weekLetters = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
      ctx.fillText(weekLetters[todayDate.getDay()], pointPosition[0] - ctx.measureText(weekLetters[todayDate.getDay()]).width / 2, pos[1] + 360);

      let dateWithoutYear = date.split(".")[0] + "." + date.split(".")[1];
      ctx.fillText(dateWithoutYear, pointPosition[0] - ctx.measureText(dateWithoutYear).width / 2, pos[1] + 360 + 30);

      ctx.fillStyle = `red`;
      ctx.beginPath();
      ctx.arc(pointPosition[0], pointPosition[1], pointWidth, 0, Math.PI * 2);
      ctx.fill();

      if (pointConnected && prevPosition !== null) {
        ctx.strokeStyle = `red`;
        ctx.beginPath();
        ctx.moveTo(prevPosition[0], prevPosition[1]);
        ctx.lineTo(pointPosition[0], pointPosition[1]);
        ctx.stroke();
      }

      prevPosition = pointPosition;
    }
  }

  static _drawDiagram({ pos, radius, data, ctx }) {
    pos[0] += radius;
    pos[1] += radius;
    let legendPos = [pos[0] - radius, pos[1] + radius + 25];

    ctx.strokeStyle = `white`;
    this._strokeArc(ctx, pos, radius, 0, Math.PI * 2);

    let startAngle = 0;

    for (let type in data) {
      if (type.startsWith("_")) {
        continue;
      }

      let typeValue = data[type];

      let cuttingAngle = 2 * Math.PI * typeValue / data._total;
      ctx.fillStyle = DoingTypes[DoingTypes.getByText(type)][2];
      this._fillArc(ctx, pos, radius, startAngle, startAngle + cuttingAngle);

      startAngle += cuttingAngle;
    }

    startAngle = 0;

    let i = 0;
    for (let type in data) {
      if (type.startsWith("_")) {
        continue;
      }

      let typeValue = data[type];
      let cuttingAngle = 2 * Math.PI * typeValue / data._total;

      let text = `${type}, ${Math.floor(typeValue / data._total * 1000) / 10}%`;

      if (typeValue / data._total >= 0.15) {
        ctx.textAlign = `center`;
        ctx.textBaseline = `middle`;
        ctx.font = `30px arial`;
        ctx.fillStyle = `white`;
        ctx.fillText(text, pos[0] + radius / 1.5 * Math.cos(startAngle + cuttingAngle / 2), pos[1] + radius / 1.5 * Math.sin(startAngle + cuttingAngle / 2));
      }

      ctx.fillStyle = DoingTypes[DoingTypes.getByText(type)][2];
      ctx.fillRect(legendPos[0], legendPos[1] + i * 25, 20, 20);

      ctx.font = `20px arial`;
      ctx.textAlign = `left`;
      ctx.textBaseline = `bottom`;
      ctx.fillStyle = `white`;
      ctx.fillText(`${DoingTypes[DoingTypes.getByText(type)][1]} - ${Math.floor(typeValue / data._total * 1000) / 10}% (${typeValue}ч.)`, legendPos[0] + 25, legendPos[1] + i * 25 + 20);

      i++;
      startAngle += cuttingAngle;
    }

    ctx.fillText(`Всего: ${data._total}ч. / Не учтено: ${data._unaccounted}ч.`, legendPos[0], legendPos[1] + i * 25 + 20);
  }

  static _drawLine(ctx, startPos, endPos) {
    ctx.beginPath();
    ctx.moveTo(startPos[0], startPos[1]);
    ctx.lineTo(endPos[0], endPos[1]);
    ctx.stroke();
  }

  static _strokeArc(ctx, pos, radius, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(pos[0], pos[1]);
    ctx.arc(pos[0], pos[1], radius, startAngle, endAngle);
    ctx.stroke();
  }

  static _fillArc(ctx, pos, radius, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(pos[0], pos[1]);
    ctx.arc(pos[0], pos[1], radius, startAngle, endAngle);
    ctx.fill();
  }
}