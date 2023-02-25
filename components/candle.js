class Candle{
  /**
   * 使用太复杂，可以优化
   */
  constructor(id, basePoint, open, close, high, low, width, options = {}) {
    this.id = id;
    this.type = 'candle';
    this.basePoint = basePoint;
    this.open = open;
    this.close = close;
    this.high = high;
    this.low = low;
    this.width = width;
    this.drag = options.drag === true ? true : false;
    this.lineWidth = options.lineWidth || 1;
    this.color = options.color || open.y < close.y ? 'rgb(10,171,98)' : 'rgb(255,51,51)';
    this.layer = options.layer || 0;


    this.high_low_line = new Line(`${id}-line`, high, low, {
      color: this.color,
      layer: this.layer,
      width: this.lineWidth
    });
    

    this.open_close_rect = new Rect(
      `${id}-rect`, 
      basePoint, 
      width, 
      Math.abs(close.y - open.y), 
      {
        color: this.color,
        style: open.y < close.y ? 'fill' : 'stroke',
        layer: this.layer,
      }
    );
  }
  
  bindCtx(ctx) {
    this.ctx = ctx;
    this.high_low_line.bindCtx(ctx);
    this.open_close_rect.bindCtx(ctx);
  }

  setAttr(obj) {
    for (let key in obj){
      this[key] = obj[key];
    }
    this.render();
  }

  moveTo(x, y) {
    const offsetX = x - this.basePoint.x;
    const offsetY = y - this.basePoint.y;
    this.open.x += offsetX;
    this.open.y += offsetY;
    this.close.x += offsetX;
    this.close.y += offsetY;
    this.high.x += offsetX;
    this.high.y += offsetY;
    this.low.x += offsetX;
    this.low.y += offsetY;
    this.basePoint.x = x;
    this.basePoint.y = y;
  }

  containPoint(x, y) {
    return this.open_close_rect.containPoint(x, y);
  }

  render() {
    this.high_low_line.render();
    this.open_close_rect.render();
  }
}