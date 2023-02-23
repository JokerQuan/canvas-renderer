class Square{

  constructor(id, basePoint, size, ctx, options = {}) {
    this.id = id;
    this.type = 'circle';
    this.basePoint = basePoint;
    this.size = size;
    this.ctx = ctx;
    this.color = options.color || 'black';
    this.style = options.style || 'stroke';
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
    const { basePoint, size } = this;
    return x >= basePoint.x && x <= basePoint.x + size && y >= basePoint.y && y <= basePoint.y + size;
  }

  render() {
    const { basePoint: { x, y }, size, ctx, color, borderColor } = this;
    if (this.style === 'stroke') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = color
      ctx.strokeRect(x, y, size, size);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
    }
  }
}