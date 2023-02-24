class Bezier{

  constructor(id, start, end, ctl1, ctl2, ctx, options = {}) {
    this.id = id;
    this.type = 'bezier';
    this.start = start;
    this.end = end;
    this.ctl1 = ctl1;
    this.ctl2 = ctl2;
    this.ctx = ctx;
    this.width = options.width || 1;
    this.color = options.color || 'black';
    this.layer = options.layer || 0;

  }

  setAttr(obj) {
    for (let key in obj){
      this[key] = obj[key];
    }
    this.render();
  }

  render() {
    const { start, end, ctl1, ctl2, width, color } = this;
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.bezierCurveTo(
      ctl1.x, ctl1.y, 
      ctl2.x, ctl2.y, 
      end.x, end.y
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }
}