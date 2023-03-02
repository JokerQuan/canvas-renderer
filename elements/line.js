class Line extends Shape{

  constructor(options) {
    super(options);
    this.type = 'line';
  }

  render() {
    const { ctx, lineWidth = 1, opacity, color = 'black' } = this;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }
}