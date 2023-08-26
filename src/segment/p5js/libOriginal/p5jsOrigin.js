/* react-p5からのインポートに失敗した内容を疑似的に実装したもの */

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  multV(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
  }

  mult(k) {
    this.x *= k;
    this.y *= k;
  }

  addV(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

}

export function createVector(x, y) {
  return new Vector(x, y);
}

export function map(p, s1, f1, s2, f2) {
  let range1, point1, rate, range2;

  range1 = f1 - s1;
  point1 = p - s1;
  rate = point1 / range1;

  range2 = f2 - s2;
  return rate * range2 + s2;
}