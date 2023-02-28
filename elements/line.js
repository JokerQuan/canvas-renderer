class Line extends Shape{

  constructor(options) {
    super(options);
    this.type = 'line';
  }

  render() {
    const { ctx } = this;
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.closePath();
  }
}