

// Vector3.ts
//        offers static overloads operating on simple arrays for speed

// Passing the `out` by reference instead of creating & returning `out`
// is literally twice the speed (Chrome 58). As it always was in the C days!
// So doing it like this with TS's phoney static methods. GC working less

export default class Vector3
{
  public x:number;
  public y:number;
  public z:number;

  constructor(x:number = 0,y :number = 0, z:number = 0)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Static Methods ///////////////////////////////////////////////////////////

  public static add(a:number[], b:number[], out:number[]):void
  {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
  }

  public static sub(a:number[], b:number[], out:number[]):void
  {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
  }

  public static norm(v:number[], out:number[]):void
  {
    let m = Vector3.mag( v );
    if (m == 0)
      out = [];
    else
      [out[0], out[1], out[2]] = [ v[0]/m, v[1]/m, v[2]/m ];
  }

  public static mag(v):number
  {
    return Math.sqrt(v[0] * v[0] + v[1]*v[1] + v[2]*v[2]);
  }

  public static dot(a:number[], b:number[]):number
  {
    return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
  }

  public static cross(a:number[], b:number[], out:number[]):void
  {
    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[2] * b[0] - a[0] * b[2];
    out[2] = a[0] * b[1] - a[1] * b[0];
  }

  // Instance Methods /////////////////////////////////////////////////////////

  public add(b:Vector3):Vector3
  {
    return new Vector3(
      this.x + b.x,
      this.y + b.y,
      this.z + b.z
    );
  }

  public sub(b:Vector3):Vector3
  {
    return new Vector3(
      this.x - b.x,
      this.y - b.y,
      this.z - b.z
    );
  }

  public norm():Vector3
  {
    let m = this.mag();
    if (m == 0) return new Vector3();
    return new Vector3(
      this.x / m, this.y / m, this.z / m
    );
  }

  public mag():number
  {
    return Math.sqrt(this.x * this.x + this.y*this.y + this.z*this.z);
  }

  public dot(b:Vector3):number
  {
    return (this.x * b.x) + (this.y * b.y) + (this.z * b.z);
  }

  public cross(b:Vector3)
  {
    return new Vector3(
        this.y * b.z - this.z * b.y,
        this.z * b.x - this.x * b.z,
        this.x * b.y - this.y * b.x,
    );
  }

}
