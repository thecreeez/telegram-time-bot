const Element = require("./Element.js");

module.exports = class RectangleElement extends Element {
  constructor({ pos, fillColor, strokeColor, size, lineWidth }) {
    super({ pos, fillColor, strokeColor, lineWidth });

    this.size = size;
  }

  fill(ctx) {
    this.applySettings(ctx);
    ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
  }

  stroke(ctx) {
    this.applySettings(ctx);
    ctx.strokeRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
  }
}