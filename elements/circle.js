class Circle extends Shape{

  constructor(options) {
    super(options);
    this.type = 'circle';

  }

  containPoint(px, py) {
    const { x, y, radius } = this;
    return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y)) <= radius;
  }

  render(ctx) {
    const { x, y, radius, color, borderColor } = this;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill()
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.closePath();
  }
}