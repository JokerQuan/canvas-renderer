const example1 = () => {
  const stage = new Stage("#container1");

  // 辅助线
  const line1 = new Line({x1: 10, y1: 390, x2: 150, y2: 100, lineWidth: 1, color: 'black'});
  const line2 = new Line({x1: 590, y1: 10, x2: 450, y2: 300, lineWidth: 1, color: 'black'});
  stage.appendElement(line1);
  stage.appendElement(line2);

  // 起点终点直线
  const line3 = new Line({x1: 10, y1: 390, x2: 590, y2: 10, lineWidth: 6, color: 'rgba(200, 200, 200, .6)'});
  stage.appendElement(line3);

  // 贝塞尔曲线
  const bezier = new Bezier({
    x: 10, y: 390, 
    ex: 590, ey: 10, 
    c1x: 150, c1y: 100,
    c2x: 450, c2y: 300,
    lineWidth: 6, 
    color: 'black'
  });
  stage.appendElement(bezier);

  const startCircle = new Circle({x: 10, y: 390, radius: 8, color: 'white', drag: true});
  const endCircle = new Circle({x: 590, y: 10, radius: 8, color: 'white', drag: true});
  const ctl1Circle = new Circle({x: 150, y: 100, radius: 8, color: 'red', drag: true});
  const ctl2Circle = new Circle({x: 450, y: 300, radius: 8, color: 'blue', drag: true});
  stage.appendElement(startCircle);
  stage.appendElement(endCircle);
  stage.appendElement(ctl1Circle);
  stage.appendElement(ctl2Circle);

  startCircle.onDrag = (x, y) => {
    startCircle.setAttrs({x, y});
    line1.setAttrs({x1: x, y1: y});
    line3.setAttrs({x1: x, y1: y});
    bezier.setAttrs({x, y});
  }

  const get0_255 = () => {
    return Math.floor(Math.random() * 256);
  }

  ctl1Circle.onClick = () => {
    ctl1Circle.setAttrs({
      color: `rgb(${get0_255()}, ${get0_255()}, ${get0_255()})`
    })
  }

  // 矩形
  const rect = new Rect({x: 10, y: 10, width: 50, height: 60, drag: true, background: 'skyblue'});
  rect.onClick = () => {
    rect.setAttrs({background: rect.background === 'skyblue' ? '#7367F0' : 'skyblue'})
  }
  rect.onDrag = (x, y) => {
    rect.setAttrs({x, y});
  }
  stage.appendElement(rect);

  // 渐变测试
  const linear = {
    direction: 'left',
    colors: ['red', 'orange', 'blue', 'green']
  };
  const rect1 = new Rect({x: 500, y: 400, width: 150, height: 150, drag: true, background: linear});
  stage.appendElement(rect1);

  // 蜡烛图
  // const open = stage.addCtrlPoint(50, 300);
  // const close = stage.addCtrlPoint(50, 200);
  // const high = stage.addCtrlPoint(50, 150);
  // const low = stage.addCtrlPoint(50, 350);
  // const left_top = stage.addCtrlPoint(25, 200);

  // stage.appendElement(new Candle('0224', left_top, open, close, high, low, 50, {
  //   drag: true
  // }))

  stage.render();
}