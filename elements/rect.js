class Rect extends Shape{

  constructor(options) {
    super(options);
    this.type = 'rect';
  }

  containPoint(px, py) {
    const { x, y, width, height } = this;
    return px >= x && px <= x + width && py >= y && py <= y + height;
  }

  render(ctx) {
    const { x, y, width, height, color, style } = this;
    if (style === 'stroke') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = color
      ctx.strokeRect(x, y, width, height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }
  }
}