class Polygon extends Shape{

  /**
   * 
   * @param {*} options {
   *   points: []
   * }
   */
  constructor(options) {
    super(options);
    this.type = 'rect';
    this._init();
  }

  _init() {
    // 计算图形所占矩形区域的宽高、中点，用于后续缩放、旋转操作
    let maxX = -Infinity, 
        maxY = -Infinity,
        minX = Infinity,
        minY = Infinity;

    this.points.forEach(p => {
      if (p.x < minX) {
        minX = p.x;
      } else if (p.x > maxX) {
        maxX = p.x;
      }

      if (p.y < minY) {
        minY = p.y;
      } else if (p.y > maxY) {
        maxY = p.y;
      }
    });

    this.x = maxX - (maxX - minX) / 2;
    this.y = maxY - (maxY - minY) / 2;
    this.width = maxX - minX;
    this.height = maxY - minY;
  }

  onDrag(x, y) {
    const offsetX = x - this.x;
    const offsetY = y - this.y;
    this.x = x;
    this.y = y;
    this.points.forEach(p => {
      p.x += offsetX;
      p.y += offsetY;
    });
  }

  containPoint(px, py) {
    const { ctx, points } = this;
    this._setPath(ctx, points);
    return ctx.isPointInPath(px, py);
  }

  render() {
    let { ctx, points, x, y, width, height, background, style, lineWidth = 1, backgroundImage } = this;

    // 设置渐变
    if (typeof background !== 'string') {
      const colors = background.direction === 'left' ? background.colors.toReversed() : background.colors;
      background = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
      const step = 1 / (colors.length - 1);
      for(let i = 0; i < colors.length; i++) {
        background.addColorStop(step * i, colors[i]);
      }
    }

    this._setPath(ctx, points);

    if (style === 'stroke') {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = background
      ctx.stroke();
    } else {
      ctx.fillStyle = background;
      ctx.fill();
    }
    if (backgroundImage) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(backgroundImage, x - width / 2, y - height / 2, width, height);
      ctx.restore();
    }
  }
}