class Line extends Shape{

  constructor(options) {
    super(options);
    this.type = 'line';
  }

  setAttr(obj) {
    for (let key in obj){
      this[key] = obj[key];
    }
  }

  render(ctx) {
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.closePath();
  }
}