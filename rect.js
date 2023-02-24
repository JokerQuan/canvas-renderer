class Rect{

  constructor(id, basePoint, width, height, options = {}) {
    this.id = id;
    this.type = 'rect';
    this.basePoint = basePoint;
    this.width = width;
    this.height = height;
    this.color = options.color || 'black';
    this.style = options.style || 'stroke';
    this.drag = options.drag === true ? true : false;
    this.layer = options.layer || 0;
    this.isTransparent = options.isTransparent === true ? true : false;

  }
  
  bindCtx(ctx) {
    this.ctx = ctx;
  }

  setAttr(obj) {
    for (let key in obj){
      this[key] = obj[key];
    }
  }

  moveTo(x, y) {
    this.basePoint.x = x;
    this.basePoint.y = y;
  }

  containPoint(x, y) {
    const { basePoint, width, height } = this;
    return x >= basePoint.x && x <= basePoint.x + width && y >= basePoint.y && y <= basePoint.y + height;
  }

  render() {
    const { basePoint: { x, y }, width, height, ctx, color, style, isTransparent } = this;
    if (!isTransparent) {
      ctx.clearRect(x, y, width, height);
    }
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