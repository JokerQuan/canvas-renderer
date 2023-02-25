const example2 = () => {
  const renderer = new CanvasRenderer("#container2", {
    canvasDrag: 'horizontal'
  });

  function addBezier(x, y, ex, ey, c1x, c1y, c2x, c2y) {
    const start = renderer.addCtrlPoint(x, y);
    const end = renderer.addCtrlPoint(ex, ey);
    const ctl1 = renderer.addCtrlPoint(c1x, c1y);
    const ctl2 = renderer.addCtrlPoint(c2x, c2y);

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
  }

  const data = [{
    x: 200,
    y: 450
  }, {
    x: 300,
    y: 300
  }, {
    x: 400,
    y: 180
  }, {
    x: 500,
    y: 200
  }];
  
  for (let i = 1; i < data.length; i++) {
    sx = data[i - 1].x;
    sy = data[i - 1].y;
    ex = data[i].x;
    ey = data[i].y;
    c1x = data[i - 1].x;
    c1y = data[i - 1].y;
    c2x = data[i].x;
    c2y = data[i].y;
    addBezier(sx, sy, ex, ey, c1x, c1y, c2x, c2y);
  }
  // addBezier(0);
  // addBezier(200);
  // addBezier(400);

  renderer.render();
}