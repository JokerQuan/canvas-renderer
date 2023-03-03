class Polygon extends Shape{

  /**
   * 
   * @param {*} options {
   *   points: []
   * }
   */
  constructor(options) {
    super(options);
    this.type = options.type || 'polygon';
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

  /**
   * 用于绘图的path，基于canvas原点绘图
   */
  _setPath(ctx, points, x = 0, y = 0) {
    ctx.beginPath();
    points.forEach((p, index) => {
      if (index === 0) {
        ctx.moveTo(p.x - x, p.y - y);
      } else {
        ctx.lineTo(p.x - x, p.y - y)
      }
    });
    ctx.closePath(); 
  }

  /**
   * pathPoints： canvas 旋转后，多边形顶点也需要旋转，用于点击、拖拽的命中判断
   */
  _setPathPoints() {
    const { points, rotate = 0, x, y } = this;
    this.pathPoints = points.map(p => {
      return Utils.rotatePoint(p.x, p.y, x, y, rotate);
    });
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
    this.pathPoints.forEach(p => {
      p.x += offsetX;
      p.y += offsetY;
    });
  }

  containPoint(px, py) {
    const { ctx, pathPoints } = this;
    this._setPath(ctx, pathPoints);
    // debug 
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = 'black';
    // ctx.stroke();
    return ctx.isPointInPath(px, py);
  }

  render() {
    let { ctx, points, x, y, width, height, background = 'white', opacity, rotate = 0, style, lineWidth = 1, backgroundImage } = this;

    ctx.globalAlpha = opacity;

    this._rotate(ctx, rotate, x, y);
    this._setPathPoints();
    this._setPath(ctx, points, x, y);

    // 设置渐变
    if (typeof background !== 'string') {
      const colors = background.direction === 'left' ? background.colors.toReversed() : background.colors;
      background = ctx.createLinearGradient( - width / 2, y,  + width / 2, y);
      const step = 1 / (colors.length - 1);
      for(let i = 0; i < colors.length; i++) {
        background.addColorStop(step * i, colors[i]);
      }
    }


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
      ctx.drawImage(backgroundImage,  - width / 2,  - height / 2, width, height);
      ctx.restore();
    }
    
    ctx.restore();
    
    ctx.globalAlpha = 1;
  }
}