class Circle{

  constructor(id, basePoint, r, ctx, options = {}) {
    this.id = id;
    this.type = 'circle';
    this.basePoint = basePoint;
    this.r = r;
    this.ctx = ctx;
    this.color = options.color || 'white';
    this.borderColor = options.borderColor || 'black';
    this.drag = options.drag === true ? true : false;
    this.layer = options.layer || 0;

    this.render();
  }

  setAttr(obj) {
    for (let key in obj){
      this[key] = obj[key];
    }
    this.render();
  }

  moveTo(x, y) {
    this.basePoint.x = x;
    this.basePoint.y = y;
  }

  containPoint(x, y) {
    const { basePoint, r } = this;
    return Math.sqrt((x - basePoint.x) * (x - basePoint.x) + (y - basePoint.y) * (y - basePoint.y)) <= r;
  }

  render() {
    const { basePoint, r, ctx, color, borderColor } = this;
    ctx.beginPath();
    ctx.arc(basePoint.x, basePoint.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill()
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.closePath();
  }
}