export default class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(other: Point) {
    return other.x === this.x && other.y === this.y;
  }
}