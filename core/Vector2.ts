
import Vector3  from './Vector3';

// Not convinced I need this class anywhere. Schedule for review/delete.

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

  public static barycentric(P:number[], a:number[], b:number[], c:number[], o:number[]): void
  {
    let va = [ c[0] - a[0], b[0] - a[0], a[0] - P[0] ];
    let vb = [ c[1] - a[1], b[1] - a[1], a[1] - P[1] ];
    let bc = [ 0, 0 ,0 ];

    Vector3.cross( va, vb, bc );

    // Outside
    if (Math.abs(bc[ 2 ]) < 1)
    {
      o[0] = -1; o[1] = -1; o[2] = -1;
      return;
    }

    let iz = 1 / bc[ 2 ];

    o[0] = 1.0 - (bc[0] + bc[1]) * iz;
    o[1] = bc[1] * iz;
    o[2] = bc[0] * iz;
  }

  public barycentric(a:Vector2, b:Vector2, c:Vector2): number[]
  {
    let va = [c.x - a.x, b.x - a.x, a.x - this.x];
    let vb = [c.y - a.y, b.y - a.y, a.y - this.y];
    let bc = [0,0,0];

    Vector3.cross(va, vb, bc);

    if (Math.abs(bc[2])<1) return [-1,1,1];

    let iz = 1/bc[2];

    return [1.0 - (bc[0]+bc[1])*iz, bc[1]*iz, bc[0]*iz];
  }
 }
