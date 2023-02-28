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
    let { x, y, width, height, background, style, lineWidth = 1 } = this;
    if (typeof background !== 'string') {
      const colors = background.direction === 'left' ? background.colors.toReversed() : background.colors;
      background = ctx.createLinearGradient(x, y, x + width, y);
      const step = 1 / (colors.length - 1);
      for(let i = 0; i < colors.length; i++) {
        background.addColorStop(step * i, colors[i]);
      }
    }
    if (style === 'stroke') {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = background
      ctx.strokeRect(x, y, width, height);
    } else {
      ctx.fillStyle = background;
      ctx.fillRect(x, y, width, height);
    }
  }
}