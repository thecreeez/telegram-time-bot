module.exports = class Element {
  /**
   * ОБЯЗАТЕЛЬНО 4 ЧИСЛА В ЦВЕТАХ
   */
  constructor({ pos, fillColor, strokeColor, lineWidth }) {
    this.pos = pos;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.lineWidth = lineWidth;
  }

  applySettings(ctx) {
    this.applyFillColor(ctx);
    this.applyStrokeColor(ctx);
    this.applyLineWidth(ctx);
  }

  applyFillColor(ctx) {
    ctx.fillStyle = `rgba(${this.fillColor.join(",")})`;
  }

  applyStrokeColor(ctx) {
    ctx.strokeStyle = `rgba(${this.strokeColor.join(",")})`;
  }

  applyLineWidth(ctx) {
    ctx.lineWidth = this.lineWidth;
  }
}