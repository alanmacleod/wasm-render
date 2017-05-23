
import Vector3  from './Vector3';

// Method class for 4D Matrix manipulation. Static for speed (2x! - tested)
// Column-major order, right-hand system. Matches OpenGL et al.
// Matrix itself is a simple 4x4 array of arrays [][]

const TO_RAD = Math.PI / 180;

export default class Matrix
{
  // Initialise a blank matrix of given dimensions
  // Bit silly offering dim params, as rest of the code here assumes 4x4 doh!
  public static create(w=4,h=4):number[][]
  {
    for (var m=[]; m.length<h;) // 'var' scope hack oops, sorry es6/ts
    {
      for (var n=[]; n.length < w; n.push(0));
      m.push(n);
    }
    return m;
  }

  // 'NOP' matrix
  public static identity(m:number[][]):void
  {
    for (let i=0; i<m.length; i++)
      for (let j=0; j<m[i].length; j++)
        m[i][j] = (i == j) ? 1 : 0; // Set diagonal to 1
  }

  // Deepcopy one matrix to another
  public static clone(source:number[][], target:number[][])
  {
    for (let y=0; y<source.length; y++)
      for (let x=0; x<source[y].length; x++)
        target[y][x] = source[y][x];
  }

  // Vector -> Matrix Transform -> Vector
  public static transform(v:number[], m:number[][], out:number[]):void
  {
    // Gross blocks of code like this make me weep
    var x = (v[0] * m[0][0]) + (v[1] * m[1][0]) + (v[2] * m[2][0]) + m[3][0];
    var y = (v[0] * m[0][1]) + (v[1] * m[1][1]) + (v[2] * m[2][1]) + m[3][1];
    var z = (v[0] * m[0][2]) + (v[1] * m[1][2]) + (v[2] * m[2][2]) + m[3][2];
    var w = (v[0] * m[0][3]) + (v[1] * m[1][3]) + (v[2] * m[2][3]) + m[3][3];

    let winv = (w != 0 && w != 1) ? 1 / w : 1;

    out[0] = x * winv;
    out[1] = y * winv;
    out[2] = z * winv;
  }

  // Simple translation matrix
  public static translate(position:number[], out:number[][]): void
  {
    Matrix.identity(out);
    out[3][0] = position[0];
    out[3][1] = position[1];
    out[3][2] = position[2];
  }

  // Perspective transform matrix, god this took bloody ages to get right
  public static perspective(fov:number, ar: number, near:number, far:number, out:number[][]):void
  {
    let fovrad = fov * TO_RAD;
    let f = 1 / Math.tan(fovrad / 2);

    let m = [
      [f,     0,        0,                              0 ],
      [0,     f*ar,     0,                              0 ],
      [0,     0,        -(far + near) / (far - near),  -1 ],
      [0,     0,        -2 * far * near / (far - near), 0 ]
    ];

    Matrix.clone(m, out);
  }

  // Camera ('from') look at point ('to'). Up is [0,1,0] (Y+) as usual.
  public static lookat(from:number[], to:number[], up:number[], out:number[][])
  {
    let z = Vector3.create();
    Vector3.sub( from, to, z );
    Vector3.norm(z, z);

    let x = Vector3.create();
    Vector3.cross( up, z, x );
    Vector3.norm(x, x);

    let y = Vector3.create();
    Vector3.cross( z, x, y );
    Vector3.norm( y, y );

    let vx = -Vector3.dot( x, from );
    let vy = -Vector3.dot( y, from );
    let vz = -Vector3.dot( z, from );

    let m = [
      [x[0],  y[0], z[0], 0],
      [x[1],  y[1], z[1], 0],
      [x[2],  y[2], z[2], 0],
      [vx,    vy,   vz,   1]
    ];

    Matrix.clone(m, out);
  }

  // Couldn't be arsed to do rotations for x and z too
  public static rotationy(angle:number, out:number[][]):void
  {
    let r = angle * TO_RAD;
    let s = Math.sin(r);
    let c = Math.cos(r);

  	let m = [
  		 [c,  0,  -s,  0],
  		 [0,  1,  0,  0],
  		 [s,  0,  c,  0],
  		 [0,  0,  0,  1]
  	];

    Matrix.clone(m, out);
  }

  // Multiplies a series of matrices together in the given order
  public static concat(matrices:number[][][], out:number[][]): void
  {
    let mata = matrices[0];

    for (let m=1, l=matrices.length-1; m<=l; m++)
    {
      Matrix.mul(mata, matrices[m], out);
      if (m < l)
        Matrix.clone(out, mata);
    }
  }

  // Muls two matrices col x row using iteration
  public static mul(a:number[][], b:number[][], out:number[][])
  {
    if (a[0].length != b.length)
      throw RangeError("Matrices do not match!");

     for (let i=0; i<a.length; i++)
     {
       for (let j=0; j<b[i].length; j++)
       {
         out[i][j] = 0;
         for (let k=0; k<a[i].length; k++)
             out[i][j] += a[i][k] * b[k][j];
       }
     }
  }

}
