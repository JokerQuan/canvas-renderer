class Line{

  constructor(id, p1, p2, ctx, options = {}) {
    this.id = id;
    this.type = 'line';
    this.p1 = p1;
    this.p2 = p2;
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
    this.ctx.lineWidth = this.width;
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(this.p1.x, this.p1.y);
    this.ctx.lineTo(this.p2.x, this.p2.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}