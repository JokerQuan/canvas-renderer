class Shape extends Node {
  constructor(options) {
    super(options);
    this.opacity = options.opacity ? options.opacity : 1.0;
    // 旋转角度
    this.rotate = typeof options.rotate === 'number' ? options.rotate : 0;
  }

  _rotate(ctx, angle, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
  }
}