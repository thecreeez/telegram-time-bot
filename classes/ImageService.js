const { createCanvas, loadImage } = require('canvas');
const fs = require("fs");
const DoingTypes = require('./DoingTypes');

module.exports = class ImageService {
  static SIZE = [200 * 2 + 30, 700]

  static createStatsForUser(user, onCreated = null) {
    const canvas = createCanvas(ImageService.SIZE[0], ImageService.SIZE[1]);
    ImageService._fillImageWithData(user, canvas);

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
        setTimeout(() => fs.unlinkSync(path), 500);
      }
    })

    return path;
  }
  
  static _fillImageWithData(user, canvas) {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = `rgb(59,58,58)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this._drawHeader(user, ctx);
    this._drawLifeBalanceDiagram(user, ctx);
  }

  static _drawHeader(user, ctx) {
    ctx.font = `25px arial`;
    ctx.fillStyle = `white`;
    ctx.fillText(user.getName(), 15, 30);
  }

  static _drawLifeBalanceDiagram(user, ctx) {
    let radius = 200;
    let pos = [15 + radius, 35 + radius];
    let legendPos = [pos[0] - radius, pos[1] + radius + 25];

    ctx.strokeStyle = `white`;
    this._strokeArc(ctx, pos, radius, 0, Math.PI * 2);

    let lifeBalanceData = user.getAllHoursByTypes();
    let startAngle = 0;
    
    for (let type in lifeBalanceData) {
      if (type.startsWith("_")) {
        continue;
      }

      let typeValue = lifeBalanceData[type];

      let cuttingAngle = 2 * Math.PI * typeValue / lifeBalanceData._total;
      ctx.fillStyle = DoingTypes[DoingTypes.getByText(type)][2];
      this._fillArc(ctx, pos, radius, startAngle, startAngle + cuttingAngle);

      startAngle += cuttingAngle;
    }

    startAngle = 0;

    let i = 0;
    for (let type in lifeBalanceData) {
      if (type.startsWith("_")) {
        continue;
      }

      let typeValue = lifeBalanceData[type];
      let cuttingAngle = 2 * Math.PI * typeValue / lifeBalanceData._total;

      let text = `${type}, ${Math.floor(typeValue / lifeBalanceData._total * 1000) / 10}%`;

      if (typeValue / lifeBalanceData._total >= 0.15) {
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
      ctx.fillText(`${DoingTypes[DoingTypes.getByText(type)][1]} - ${Math.floor(typeValue / lifeBalanceData._total * 1000) / 10}% (${typeValue}ч.)`, legendPos[0] + 25, legendPos[1] + i * 25 + 20);

      i++;
      startAngle += cuttingAngle;
    }

    ctx.fillText(`Всего: ${lifeBalanceData._total}ч. / Не учтено: ${user.getUnaccountedTime()}ч.`, legendPos[0], legendPos[1] + i * 25 + 20);
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