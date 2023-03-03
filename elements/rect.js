class Rect extends Polygon{

  constructor(options) {
    options.type = 'rect'
    super(options);
    // node 构造函数会调用setAttrs，所以这里不用再手动初始化矩形节点
    // this.setAttrs(options)
  }

  _getPoints(x, y, width, height) {
    const points = [{
      x: x - width / 2,
      y: y - height / 2
    }, {
      x: x + width / 2,
      y: y - height / 2
    }, {
      x: x + width / 2,
      y: y + height / 2
    }, {
      x: x - width / 2,
      y: y + height / 2
    }];
    return points;
  }

  setAttrs(attrs) {
    let { x, y, width, height } = attrs;
    // 如果改变矩形位置、大小，需要根据已有数据重新计算顶点坐标
    if (x !== undefined || y !== undefined || width !== undefined || height !== undefined) {
      if (x === undefined) x = this.x;
      if (y === undefined) y = this.y;
      if (width === undefined) width = this.width;
      if (height === undefined) height = this.height;
      attrs.points = this._getPoints(x, y, width, height);
    }
    super.setAttrs.call(this, attrs);
  }
}