class Stage {
  _container;
  _ctx = null;
  _canvas = null;

  // 按图层保存元素
  _layers = [];
  _elements = [];

  _options = {};

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
    this._bindHover();
  }

  _bindEvent() {
    // 鼠标按下时，相对元素基准点x, y的偏移量
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
        
        if (typeof this.onCanvasDrag === 'function') {
          this.onCanvasDrag(offsetX, offsetY);
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
  
        targetEle.onDrag(canvasX, canvasY)
      }

      // 更新
      this.render();
    };

    this._canvas.addEventListener('mousedown', (e) => {
      targetEle = this._pointInWitchElement(e.offsetX, e.offsetY);

      if (targetEle) {
        downPointOffsetX = e.offsetX - targetEle.x;
        downPointOffsetY = e.offsetY - targetEle.y;
      }

      downPageX = e.pageX;
      downPageY = e.pageY;
      document.addEventListener('mousemove', moveFn);

    });

    document.addEventListener('mouseup', (upEvent) => {
      document.removeEventListener('mousemove', moveFn);
      
      if (!targetEle) return;
      if (isClick && typeof targetEle.onClick === 'function') {
        // 鼠标按下和鼠标抬起时都在目标元素内才触发点击
        if (targetEle.containPoint(upEvent.offsetX, upEvent.offsetY)) {
          // todo 模拟事件冒泡
          targetEle.onClick();
          this.render(); // 点击事件可能修改了相关属性，需要重新render
        }
      }
      targetEle = null;
      isClick = true;
    });
  }

  _bindHover() {
    let targetEle = null;
    let hoveredEle = null;
    let isHover = false;
    this._canvas.addEventListener('mousemove', (e) => {
      targetEle = this._pointInWitchElement(e.offsetX, e.offsetY);
      if (targetEle && !isHover) {
        hoveredEle = targetEle;
        isHover = true;
        hoveredEle.onHover();
      }
      if (hoveredEle && isHover) {
        // 重叠元素切换 hover 目标
        if (targetEle && hoveredEle !== targetEle) {
          hoveredEle.onHoverOut();
          hoveredEle = targetEle;
          hoveredEle.onHover();
        }
        if (!hoveredEle.containPoint(e.offsetX, e.offsetY)) {
          hoveredEle.onHoverOut();
          isHover = false;
          hoveredEle = null;
        }
      }
    });
  }

  // 查找点在哪个元素内，都不在则返回 null
  // _pointInWitchElement(x, y) {
  //   // 图层越高优先级越高
  //   let target = null;
  //   const len = this._layers.length;
  //   for (let i = len - 1; i >= 0; i--) {
  //     if (!this._layers[i]) continue;
  //     // 同一图层，元素越靠后（即后加入），优先级越高
  //     const reversedEle = this._layers[i].toReversed();
  //     target = reversedEle.find(ele => {
  //       if (typeof ele.containPoint !== 'function') return false;
  //       return ele.containPoint(x, y);
  //     });
  //     if (target) break;
  //   }
  //   return target;
  // }

  _pointInWitchElement(x, y) {
    let target = this._elements.toReversed().find(ele => {
      if (typeof ele.containPoint !== 'function') return false;
      return ele.containPoint(x, y);
    });
    return target;
  }

  appendElement(ele) {
    ele.bindCtx(this._ctx);
    this._elements.push(ele);
    // const layer = ele.layer;
    // this._layers[layer] = this._layers[layer] || [];
    // this._layers[layer].push(ele);
    // return ele;
  }

  getCanvasSize() {
    return {
      canvaWidth: this._canvas.width,
      canvaHeight: this._canvas.height
    }
  }

  reset() {
    this._layers = [];
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  render() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    // this._layers.forEach(layer => {
    //   layer.forEach(ele => ele.render(this._ctx));
    // });

    this._elements.forEach(ele => ele.render());
  }
}