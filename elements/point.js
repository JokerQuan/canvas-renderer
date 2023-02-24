class Point{
  constructor(x, y, fixed = false) {
    this.x = x;
    this.y = y;
    this.fixed = fixed === true ? true : false;
  }
}