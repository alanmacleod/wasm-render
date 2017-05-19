
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
      let v0 = b.sub(a);
      let v1 = c.sub(a);
      let v2 = this.sub(a);
      let d00 = v0.dot(v0);
      let d01 = v0.dot(v1);
      let d11 = v1.dot(v1);
      let d20 = v2.dot(v0);
      let d21 = v2.dot(v1);

      let denom = d00 * d11 - d01 * d01;
      //float denom = d00 * d11 - d01 * d01;
      let v = (d11 * d20 - d01 * d21) / denom;
      //v = (d11 * d20 - d01 * d21) / denom;
      let w = (d00 * d21 - d01 * d20) / denom;
      //w = (d00 * d21 - d01 * d20) / denom;
      let u = 1.0 - v - w;
      //u = 1.0f - v - w;
      return new Vector3(u, v, w);
  }



}
