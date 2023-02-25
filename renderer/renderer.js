class CanvasRenderer {
  _container;
  _ctx = null;
  _canvas = null;

  // 按图层保存元素
  _layers = [];
  _ctrlPoints = [];

  _options = {};

  /**
   * 对外接口：
   *  1、addCtrlPoint， 添加控制点，控制点不渲染，主要用于多个元素之间的联动
   *  2、addElement, 添加元素，支持自定义元素
   *  3、render，渲染全部元素
   * todo：
   *  4、update，优化方法，检测元素是否在可视区域内，如果不在则不渲染
   *  5、onCanvasDrag，画布拖动回调
   *  6、removeCtrl，移除控制点，需要考虑与控制点关联的元素，可能需要重新设计数据结构
   *  7、removeElement, 移除元素，同样需要考虑与控制点的关联关系
   *  8、图层相关的操作
   */
  constructor(containerSel, options = {}) {
    this._container = document.querySelector(containerSel);
    this._container.style.position = 'relative';
    this._canvas = document.createElement("canvas");
    this._container.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = this._container.clientWidth;
    this._canvas.height = this._container.clientHeight;

    this._options = options;
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

      // 没有目标元素，或者目标元素不支持拖拽，则是画布拖拽
      if (!targetEle || !targetEle.drag) {
        if (this._options.canvasDrag === 'none') return;
        let offsetX = moveEvent.pageX - downPageX;
        let offsetY = moveEvent.pageY - downPageY;
        downPageX = moveEvent.pageX;
        downPageY = moveEvent.pageY;
        if (this._options.canvasDrag === 'horizontal') {
          offsetY = 0;
        } else if (this._options.canvasDrag === 'vertical') {
          offsetX = 0;
        }
        let stopDrag = false;
        if (typeof this.onCanvasDrag === 'function') {
          stopDrag = this.onCanvasDrag(offsetX, offsetY);
        }
        if (!stopDrag) {
          this._moveAllPoints(offsetX, offsetY);
        }
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
      }

      downPageX = e.pageX;
      downPageY = e.pageY;
      document.addEventListener('mousemove', moveFn);

    });

    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', moveFn);
      
      if (!targetEle) return;
      if (isClick && typeof targetEle.onClick === 'function') {
        // todo 模拟事件冒泡
        targetEle.onClick();
        this.render(); // 点击事件可能修改了相关属性，需要重新render
      }
      targetEle = null;
      isClick = true;
    });
  }

  // 查找点在哪个元素内，都不在则返回 null
  _pointInWitchElement(x, y) {
    // 图层越高优先级越高
    let target = null;
    const len = this._layers.length;
    for (let i = len - 1; i >= 0; i--) {
      if (!this._layers[i]) continue;
      // 同一图层，元素越靠后（即后加入），优先级越高
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
      if (!p.fixed) {
        p.x += offsetX;
        p.y += offsetY;
      }
    });
    this.render();
  }

  // 基于控制点创建的元素，可以随画布拖拽移动
  addCtrlPoint(x, y, fixed = false) {
    const point = new Point(x, y, fixed);
    this._ctrlPoints.push(point);
    return point;
  }

  /**
   * 
   * @param {*} ele 自定义 canvas 元素
   * 自定义元素规则：
   *  1、必须实现 bindCtx、render 函数
   *  2、如果需要点击功能，必须实现 containPoint 函数
   *  3、如果需要拖拽功能，必须实现 containPoint 函数、moveTo 函数、basePoint 属性
   * @returns 
   */
  addElement(ele) {
    ele.bindCtx(this._ctx);
    const layer = ele.layer;
    this._layers[layer] = this._layers[layer] || [];
    this._layers[layer].push(ele);
    return ele;
  }

  getCanvasSize() {
    return {
      canvaWidth: this._canvas.width,
      canvaHeight: this._canvas.height
    }
  }

  reset() {
    this._layers = [];
    this._ctrlPoints = [];
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  render() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    this._layers.forEach(layer => {
      layer.forEach(ele => ele.render());
    });
  }
}