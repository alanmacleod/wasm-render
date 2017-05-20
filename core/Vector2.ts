
import Vector3  from './Vector3';

const X = 0, Y = 1;


export default class Vector2
{
  //public v: number[] = [ 0, 0 ];
  public x: number;
  public y: number;

  constructor(x:number = 0,y :number = 0)
  {
    this.x = x;
    this.y = y;
  }

  public add(b:Vector2): Vector2
  {
    return new Vector2(b.x + this.x, b.y + this.y);
  }

  public sub(b: Vector2): Vector2
  {
    return new Vector2(this.x - b.x, this.y - b.y);
  }

  public dot(b: Vector2): number
  {
    return (this.x * b.x) + (this.y * b.y);
  }

  public barycentric(a:Vector2, b:Vector2, c:Vector2): Vector3
  {
    // p = this
      let v0 = b.sub(a);  // cache
      let v1 = c.sub(a);  // cache
      let v2 = this.sub(a); // RECALC
      let d00 = v0.dot(v0); // cache
      let d01 = v0.dot(v1); // cache
      let d11 = v1.dot(v1); // cache
      let d20 = v2.dot(v0); // RECALC
      let d21 = v2.dot(v1); // RECALC

      let denom = 1 / (d00 * d11 - d01 * d01); // cache

      let v = (d11 * d20 - d01 * d21) * denom; //a
      let w = (d00 * d21 - d01 * d20) * denom;
      let u = 1.0 - v - w;

      return new Vector3(u, v, w);
  }



}
