const Element = require("./Element.js");

module.exports = class DiagramElement extends Element {
  constructor({ pos, fillColor, strokeColor, lineWidth, radius }) {
    super({ pos, fillColor, strokeColor, lineWidth });

    this.radius = radius;
  }

  fill(ctx, data) {
    this.applySettings(ctx);

    let diagramCenter = [this.pos[0] + this.radius, this.pos[1] + this.radius];

    this._strokeArc(ctx, diagramCenter, radius, 0, Math.PI * 2)

    let startAngle = 0;

    for (let type in data) {
      if (type.startsWith("_")) {
        continue;
      }

      let typeValue = data[type];

      let cuttingAngle = 2 * Math.PI * typeValue / data._total;
      ctx.fillStyle = DoingTypes[DoingTypes.getByText(type)][2];
      this._fillArc(ctx, diagramCenter, this.radius, startAngle, startAngle + cuttingAngle);

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

      i++;
      startAngle += cuttingAngle;
    }
  }

  // Позиция относительна позиции диаграммы
  fillLegend(ctx, data, pos) {
    let startAngle = 0;

    let legendPos = [this.pos[0] + pos[0], this.pos[1] + pos[1]];

    let i = 0;
    for (let type in data) {
      if (type.startsWith("_")) {
        continue;
      }

      let typeValue = data[type];
      let cuttingAngle = 2 * Math.PI * typeValue / data._total;

      /**
       * Переделать под ООП
       */
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
  }

  _strokeArc(ctx, pos, radius, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(pos[0], pos[1]);
    ctx.arc(pos[0], pos[1], radius, startAngle, endAngle);
    ctx.stroke();
  }

  _fillArc(ctx, pos, radius, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(pos[0], pos[1]);
    ctx.arc(pos[0], pos[1], radius, startAngle, endAngle);
    ctx.fill();
  }
}