const Element = require("./Element.js");

module.exports = class TextElement extends Element {
  constructor({ pos, fillColor, strokeColor, textAlign = "left", textBaseline = "alphabetic", fontSize = 12, font = "arial", text = "empty text" }) {
    super({ pos, fillColor, strokeColor });

    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.fontSize = fontSize;
    this.font = font;
    this.text = text;
  }

  setText(text) {
    this.text = text;
  }

  applySettings(ctx) {
    super.applySettings(ctx);
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.font = `${this.fontSize}px ${this.font}`;
  }

  fill(ctx) {
    this.applySettings(ctx);
    ctx.fillText(this.text, this.pos[0], this.pos[1])
  }

  stroke(ctx) {
    this.applySettings(ctx);
    ctx.strokeText(this.text, this.pos[0], this.pos[1])
  }
}