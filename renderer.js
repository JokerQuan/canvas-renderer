class CanvasRenderer {
  _container;
  _ctx = null;
  _canvas = null;

  // 按图层保存元素
  _layers = [];
  _ctrlPoints = [];

  constructor(containerSel) {
    this._container = document.querySelector(containerSel);
    this._container.style.position = 'relative';
    this._canvas = document.createElement("canvas");
    this._container.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = this._container.clientWidth;
    this._canvas.height = this._container.clientHeight;

    this._init();
    this.render();
  }

  _init() {
    this._bindEvent();
  }

  _bindEvent() {
    // 鼠标按下时，相对元素基准点的偏移量
    // 比如圆形的基准点就是圆心，矩形的基准点可以是左上角
    // 规定：实现自定义元素需要拖拽时，必须指定一个绘制相关的基准点 basePoint
    let downPointOffsetX = 0;
    let downPointOffsetY = 0;

    let downPageX = 0;
    let downPageY = 0;

    // 区分拖拽和点击
    let isClick = true;

    let targetEle = null;
    const moveFn = (moveEvent) => {

      // 没有目标元素，则是画布拖拽
      if (!targetEle) {
        const offsetX = moveEvent.pageX - downPageX;
        const offsetY = moveEvent.pageY - downPageY;
        downPageX = moveEvent.pageX;
        downPageY = moveEvent.pageY;
        this._moveAllPoints(offsetX, offsetY);
      } else {
        isClick = false;
        let canvasX = moveEvent.pageX - this._container.offsetLeft - downPointOffsetX;
        let canvasY = moveEvent.pageY - this._container.offsetTop - downPointOffsetY;
  
        // 处理边界 todo：基准点检测--->图形边缘检测
        if (canvasX < 0) canvasX = 0;
        if (canvasX > this._canvas.width) canvasX = this._canvas.width;
        if (canvasY < 0) canvasY = 0;
        if (canvasY > this._canvas.height) canvasY = this._canvas.height;
  
        targetEle.moveTo(canvasX, canvasY);
      }

      // 更新
      this.render();
    };

    this._canvas.addEventListener('mousedown', (e) => {
      targetEle = this._pointInWitchElement(e.offsetX, e.offsetY);

      if (targetEle) {
        downPointOffsetX = e.offsetX - targetEle.basePoint.x;
        downPointOffsetY = e.offsetY - targetEle.basePoint.y;
        if (targetEle.drag) {
          document.addEventListener('mousemove', moveFn);
        }
      } else {
        downPageX = e.pageX;
        downPageY = e.pageY;
        document.addEventListener('mousemove', moveFn);
      }

    });

    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', moveFn);
      
      if (!targetEle) return;
      if (isClick && typeof targetEle.onClick === 'function') {
        // todo 模拟事件冒泡
        targetEle.onClick();
        this.render(); // 点击事件可能修改了相关属性，需要重新render
      }
      isClick = true;
    });
  }

  // 查找点在哪个元素内，都不在则返回 null
  _pointInWitchElement(x, y) {
    // 图层越高优先级越高
    // 同一图层，元素越靠后（即后加入），优先级越高
    let target = null;
    const len = this._layers.length;
    for (let i = len - 1; i >= 0; i--) {
      if (!this._layers[i]) continue;
      const reversedEle = this._layers[i].toReversed();
      target = reversedEle.find(ele => {
        if (typeof ele.containPoint !== 'function') return false;
        return ele.containPoint(x, y);
      });
      if (target) break;
    }
    return target;
  }

  _moveAllPoints(offsetX, offsetY) {
    this._ctrlPoints.forEach(p => {
      p.x += offsetX;
      p.y += offsetY;
    });
    this.render();
  }

  addCtrlPoint(x, y) {
    const point = new Point(x, y);
    this._ctrlPoints.push(point);
    return point;
  }

  addLine(id, p1, p2, options = {}) {
    const layer = options.layer || 0;
    this._layers[layer] = this._layers[layer] || [];
    const line = new Line(id, p1, p2, this._ctx, options);
    this._layers[layer].push(line);
    return line;
  }

  addBezierCurve(id, start, end, ctl1, ctl2, options = {}) {
    const layer = options.layer || 0;
    this._layers[layer] = this._layers[layer] || [];
    const bezier = new Bezier(id, start, end, ctl1, ctl2, this._ctx, options);
    this._layers[layer].push(bezier);
    return bezier;
  }

  addCircle(id, p, r, options) {
    const circle = new Circle(id, p, r, this._ctx, options);
    const layer = options.layer || 0;
    this._layers[layer] = this._layers[layer] || [];
    this._layers[layer].push(circle);
    return circle;
  }

  addSquare(id, p, sise, options = {}) {
    const square = new Square(id, p, sise, this._ctx, options);
    const layer = options.layer || 0;
    this._layers[layer] = this._layers[layer] || [];
    this._layers[layer].push(square);
    return square;
  }

  render() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    this._layers.forEach(layer => {
      layer.forEach(ele => ele.render());
    });
  }
}