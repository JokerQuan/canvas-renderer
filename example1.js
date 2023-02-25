const example1 = () => {
  const renderer = new CanvasRenderer("#container1");

  const start = renderer.addCtrlPoint(10, 390);
  const end = renderer.addCtrlPoint(590, 10);
  const ctl1 = renderer.addCtrlPoint(150, 100);
  const ctl2 = renderer.addCtrlPoint(450, 300);

  const startCircle = new Circle('start', start, 8, {
    drag: true,
    layer: 1
  });
  // 注册点击事件
  startCircle.onClick = () => {
    startCircle.setAttr({
      color: startCircle.color === 'white' ? 'black' : 'white'
    });
  };
  renderer.addElement(startCircle);

  renderer.addElement(new Circle('end', end, 8, {
    drag: true,
    layer: 1
  }));
  
  renderer.addElement(new Circle('ctl1', ctl1, 8, {
    color: 'red',
    layer: 1,
    drag: true
  }));

  renderer.addElement(new Circle('ctl2', ctl2, 8, {
    color: 'blue',
    layer: 1,
    drag: true
  }));

  // 辅助线
  renderer.addElement(new Line('line1', start, ctl1));
  renderer.addElement(new Line('line2', end, ctl2));

  // 起点终点直线
  renderer.addElement(new Line('line3', start, end, {
    width: 6,
    color: 'rgba(200, 200, 200, .6)'
  }));

  // 贝塞尔曲线
  renderer.addElement(new Bezier('bezier-demo', start, end, ctl1, ctl2, {
    width: 6,
    color: 'black'
  }));

  const sp = renderer.addCtrlPoint(0, 0);
  // 矩形
  const s = renderer.addElement(new Rect('s', sp, 30, 50, { drag: true }));
  s.setAttr({style: 'fill'});

  // 不随画布移动的元素
  const nomove = renderer.addCtrlPoint(500, 250, true);
  renderer.addElement(new Rect('no-move', nomove, 30, 50, { 
    drag: true,
    layer: 10
  }));


  // 蜡烛图
  const open = renderer.addCtrlPoint(50, 300);
  const close = renderer.addCtrlPoint(50, 200);
  const high = renderer.addCtrlPoint(50, 150);
  const low = renderer.addCtrlPoint(50, 350);
  const left_top = renderer.addCtrlPoint(25, 200);

  renderer.addElement(new Candle('0224', left_top, open, close, high, low, 50, {
    drag: true
  }))

  renderer.render();
}