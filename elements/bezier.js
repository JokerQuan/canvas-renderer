class Bezier extends Shape{

  constructor(options) {
    super(options);
    this.type = 'bezier';
  }

  render(ctx) {
    const { x, y, ex, ey, c1x, c1y, c2x, c2y, lineWidth, color } = this;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      c1x, c1y, 
      c2x, c2y, 
      ex, ey
    );
    ctx.stroke();
    ctx.closePath();
  }
}