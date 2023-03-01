data.forEach(e => {
  const { high, low, open, close} = e.kline;
  e.kline.high = parseFloat(high);
  e.kline.low = parseFloat(low);
  e.kline.open = parseFloat(open);
  e.kline.close = parseFloat(close);
  e.ma5.avgPrice = parseFloat(e.ma5.avgPrice);
  e.ma10.avgPrice = parseFloat(e.ma10.avgPrice);
  e.ma20.avgPrice = parseFloat(e.ma20.avgPrice);
});

let renderNum = 20;

// 渲染数据的下标，左闭右闭，用于多渲染一条数据
let start = data.length - renderNum;
let end = data.length;

const renderer = new CanvasRenderer('#k-line', {
  canvasDrag: 'horizontal'
});

const { canvasWidth, canvasHeight } = renderer.getCanvasSize();

let perCandleWidth = canvaWidth / renderNum;
let perValueHeight = 0; //单位数值占高度px
let gap = 4;
let renderData = [];

// 内容高度占比 10/12，上下留白各占 1/12
const contentSize = 10;
const topSpaceSize = 1;
const bottomSpaceSize = 1;

// 当前渲染数组中的最大最小值
let maxY = -Infinity;
let minY = Infinity;
// 按上面两个值和占比算出的Y轴的最大最小轴值
let axisMaxY = 0;
let axisMinY = 0;

// 渲染所有数据需要的总宽度
let virtualTotalWidth = perCandleWidth * data.length;
// 当前渲染数据的offset
let virtualLeft = -perCandleWidth * start;


// 计算各种基准数值
const calcBaseNums = () => {
  renderData = data.slice(start, end + 1);

  maxY = -Infinity;
  minY = Infinity;
  
  // 计算当前渲染数据中的最大值和最小值
  renderData.forEach(day => {
    const { kline: { open, close, high, low } } = day;
    
    const dayMax = Math.max(open, close, high, low);
    maxY = maxY < dayMax ? dayMax : maxY;
    
    const dayMin = Math.min(open, close, high, low);
    minY = minY > dayMin ? dayMin : minY;
  });
  
  perValueHeight = canvaHeight / ((maxY - minY) / contentSize * (contentSize + topSpaceSize + bottomSpaceSize));

  axisMaxY = maxY + ((maxY - minY) / contentSize * topSpaceSize);
  axisMinY = minY - ((maxY - minY) / contentSize * bottomSpaceSize);

  virtualTotalWidth = perCandleWidth * data.length;
}

const yToPx = (y) => {
  return (axisMaxY - y) * perValueHeight;
}

const valueToPx = (item) => {
  const index = data.findIndex(d => d.date === item.date);
  const renderIndex = index - start;
  const { kline: { open, close, high, low} } = item;
  const baseY = yToPx(Math.max(open, close));
  const openY = yToPx(open);
  const closeY = yToPx(close);
  const highY = yToPx(high);
  const lowY = yToPx(low);

  return { index, renderIndex, baseY, openY, closeY, highY, lowY };
}

// 这里的x是点在canvas上的px位置
const pxToValue = (x, y) => {
  const index = Math.floor((x - virtualLeft) / perCandleWidth);
  return {
    index,
    item: data[index]
  }
}

const addCandle = (item) => {
  const { index, baseY, openY, closeY, highY, lowY } = valueToPx(item);
  const middle = (index + 0.5) * perCandleWidth + virtualLeft;
  const baseX = middle - perCandleWidth / 2 + gap / 2;
  const base = renderer.addCtrlPoint(baseX, baseY);
  const open = renderer.addCtrlPoint(middle, openY);
  const close = renderer.addCtrlPoint(middle, closeY);
  const high = renderer.addCtrlPoint(middle, highY);
  const low = renderer.addCtrlPoint(middle, lowY);

  const candle = new Candle(`candle-${item.date}`, base, open, close, high, low, perCandleWidth - gap);
  renderer.addElement(candle);
}

const addElements = () => {
  for (let i = start; i <= end; i++) {
    if (i < 0 || i >= data.length) return;
    addCandle(data[i]);
  }
}

// 返回 true 停止拖拽
renderer.onCanvasDrag = (offsetX) => {
  if (virtualLeft + offsetX >= 0) {
    virtualLeft = 0;
    return true;
  } else if (virtualLeft + offsetX <= canvaWidth - virtualTotalWidth) {
    virtualLeft = canvaWidth - virtualTotalWidth;
    return true;
  } else {
    virtualLeft += offsetX;
    const { index: startIndex } = pxToValue(0);
    const { index: endIndex } = pxToValue(canvaWidth);
    if (startIndex !== start || endIndex !== end) {
      start = startIndex;
      end = endIndex;
      update();
    }
  }
  
}

const update = () => {
  renderer.reset();
  render();
}

const render = () => {
  calcBaseNums();
  addElements();
  renderer.render();
}

render();


