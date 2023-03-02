class Shape extends Node {
  constructor(options) {
    super(options);
  }

  _setPath(ctx, points) {
    ctx.beginPath();
    points.forEach((p, index) => {
      if (index === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y)
      }
    });
    ctx.closePath(); 
  }
}