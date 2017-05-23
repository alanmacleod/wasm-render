
// "Native" probably a bit misleading. More of a "Reference" rasteriser

import IRasteriser            from './IRasteriser';
import Clip                   from './Clip';
import Mesh                   from '../mesh/Mesh';
import Texture                from '../Texture';
import Vector2                from '../Vector2';
import Vector3                from '../Vector3';
import {BYTES_PER_PIXEL, BIT_SHIFT_PER_PIXEL,
        ALPHA_MAGIC_NUMBER}   from '../Sym';
import Matrix                 from '../Matrix';


export default class NativeRasteriser implements IRasteriser
{
  private width:number;
  private height:number;
  private pagesize:number;
  private hwidth: number;
  private hheight: number;

  // IRasteriser members
  // TODO: Perhaps use Uint32 bytepack view for cleaner/faster/easier writes?
  // Real TypedArray to emulate wasm heap
  public buffer: Uint8ClampedArray;
  public ready: boolean;

  constructor()
  {
    this.ready = false;
  }

  public init(w: number, h: number): void
  {
    this.width = w; this.hwidth = (w/2)>>0;
    this.height = h; this.hheight = (h/2)>>0;
    this.pagesize = w * h * BYTES_PER_PIXEL;
    this.buffer = new Uint8ClampedArray( this.pagesize );
    this.ready = true;
  }

  // Standard Bres' line routine, I've been copying, pasting and translating
  // this code of mine for about 10 years. It's seen around six languages.
  public line(x0, y0, x1, y1, r, g, b, clip?:boolean)
  {
    if (clip)
    {
      let lo = Clip.line( x0, y0, x1, y1, 0, 0, this.width-1, this.height-1 );
      if (!lo.visible) return;
      [ x0, y0, x1, y1 ] = [ lo.x0, lo.y0, lo.x1, lo.y1 ];
    }

    let steep:boolean = false;

    if (Math.abs(x0-x1) < Math.abs(y0-y1))
    {
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
        steep = true;
    }

    if (x0 > x1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    let dx:number = x1 - x0;
    let dy:number = y1 - y0;

    let derror2:number = Math.abs(dy) * 2;
    let error2:number = 0;
    let y:number = y0;

    for (let x:number=x0; x<=x1; x++)
    {
        if (steep) {
            this.pset( y, x, r, g, b );
        } else {
            this.pset( x, y, r, g, b );
        }

        error2 += derror2;

        if (error2 > dx)
        {
            y += (y1 > y0 ? 1 : -1);
            error2 -= dx * 2;
        }
    }
  }

  // Draw a triangle using a bbox with barycentric coord rejection
  // Heard about this method recently, I always used the top/bottom half tri
  // approach which I'm told is a little old school. I believe GPUs do it this
  // way because it's easier to exec in parallel...
  public tri(points:number[][], r:number, g:number, b:number, wireframe?:boolean): void
  {
    if (wireframe)
    {
      this.wireframe(points);
      return;
    }
    // Get a bounding box from three points
    let minx:number = Math.min(points[0][0], Math.min(points[1][0], points[2][0]));
    let maxx:number = Math.max(points[0][0], Math.max(points[1][0], points[2][0]));
    let miny:number = Math.min(points[0][1], Math.min(points[1][1], points[2][1]));
    let maxy:number = Math.max(points[0][1], Math.max(points[1][1], points[2][1]));

    // clipping
    minx = Math.max(0, minx);
    miny = Math.max(0, miny);
    maxx = Math.min(this.width-1, maxx);
    maxy = Math.min(this.height-1, maxy);

    // off-screen test
    if (maxx < 0) return;
    if (maxy < 0) return;
    if (minx >= this.width) return;
    if (miny >= this.height) return;

    // Fast float->int convert. Need ints otherwise gaps in the BC test.
    minx >>= 0; maxx >>= 0;
    miny >>= 0; maxy >>= 0;

    let P = [0, 0];
    let o = [0, 0, 0];

    for ( let y=miny; y<=maxy; y++ )
    {
      for (let x=minx; x<=maxx; x++ )
      {
        P[0] = x;
        P[1] = y;

        // Can be massively optimised by unrolling this call
        Vector2.barycentric(P, points[0], points[1], points[2], o);

        // o = weighted ratio of each corner
        // points[0] = o.x
        // points[1] = o.y
        // points[2] = o.z

        if (o[0] < 0 || o[1] < 0 || o[2] < 0) continue;

        // Mul o by coords to get u,v

        // This coord is in the triangle, draw it
        this.pset( x, y, r, g, b );

      }
    }

  }

  // Draws a triangle in wireframe mode
  public wireframe(points:number[][])
  {
    for (let t=0; t<3; t++)
    {
      let a = points[t]
      let b = points[(t+1)%3];
      this.line(
        a[0], a[1],     // point A
        b[0], b[1],     // point B
        255, 255, 255,  // Colour
        true            // Clipping?
      );
    }

  }

  public tritex(points:Vector2[], uvs:Vector2[],tex: Texture, r:number, g:number, b:number): void
  {
    // temp for testing
    if (!tex.ready) return;

    // Get a bounding box from three points
    let minx:number = Math.min(points[0].x, Math.min(points[1].x, points[2].x));
    let maxx:number = Math.max(points[0].x, Math.max(points[1].x, points[2].x));
    let miny:number = Math.min(points[0].y, Math.min(points[1].y, points[2].y));
    let maxy:number = Math.max(points[0].y, Math.max(points[1].y, points[2].y));

    // clipping
    minx = Math.max(0, minx);
    miny = Math.max(0, miny);
    maxx = Math.min(this.width-1, maxx);
    maxy = Math.min(this.height-1, maxy);

    // off-screen test
    if (maxx < 0) return;
    if (maxy < 0) return;
    if (minx >= this.width) return;
    if (miny >= this.height) return;

    let P = new Vector2();
    let o = [0,0,0];

    let texels = tex.data.buffer;
    let texmaxu= tex.maxu;
    let texmaxv = tex.maxv;
    let texw = tex.width;
    let texh = tex.height;

    // Scan a simple bbox
    for ( let y=miny; y<=maxy; y++ )
    {
      for ( let x=minx; x<=maxx; x++ )
      {
        // Test each coord
        P.x = x;
        P.y = y;

        // barycentric is _all_ about Barry
        // Can be massively optimised by unrolling this call
        o = P.barycentric( points[0], points[1], points[2] );

        // Check [0] first
        if (o[0] < 0 || o[1] < 0 || o[2] < 0) continue;

        let u = Math.round((uvs[0].x * o[0] + uvs[1].x * o[1] + uvs[2].x * o[2] ) * texmaxu);
        let v = Math.round((uvs[0].y * o[0] + uvs[1].y * o[1] + uvs[2].y * o[2] ) * texmaxv);

        let c = (v * texw << BIT_SHIFT_PER_PIXEL) + (u << BIT_SHIFT_PER_PIXEL);
        let r = texels[ c+0 ];
        let g = texels[ c+1 ];
        let b = texels[ c+2 ];

        // ..and not doing this
        this.pset( x, y, r, g, b );

      }
    }

  }

  public pset(x: number, y: number, r: number, g: number, b: number): void
  {
    let o:number = (y>>0) * this.width * BYTES_PER_PIXEL + (x>>0) * BYTES_PER_PIXEL;

    this.buffer[ o + 0 ] = r;
    this.buffer[ o + 1 ] = g;
    this.buffer[ o + 2 ] = b;
    this.buffer[ o + 3 ] = 255;
  }


  public fill(r:number, g:number, b:number): void
  {
    for (let o:number=0; o<this.pagesize; o+=4)
    {
      this.buffer[ o + 0 ] = r;
      this.buffer[ o + 1 ] = g;
      this.buffer[ o + 2 ] = b;
      this.buffer[ o + 3 ] = 255;
    }
  }

  rasterise(m: Mesh, mat:number[][])
  {
    // Directional light
    let light = [0, 0, -1];

    // Initialise these outside the loop for normal/lighting calcs
    let v1 = Vector3.create();
    let v2 = Vector3.create();
    let fnormal = Vector3.create();

    // Rasterisation screen coordinates buffer
    let triscreen = [
      Vector3.create(),
      Vector3.create(),
      Vector3.create()
    ];

    // Triangle word coordinates for lighting, culling
    let triworld = [
      Vector3.create(),
      Vector3.create(),
      Vector3.create()
    ];

    let vertex;

    // For each face (triangle) of the mesh model
    for (let f of m.faces)
    {
      // For each vertex of the face
      for (let v=0; v<3; v++)
      {
        vertex = m.vertices[f[v]];

        // Vertex shader
        // Object.matrix -> world space
        Matrix.transform(vertex, m.matrix, triworld[v]);

        // View & Projection matrix -> screen
        Matrix.transform(triworld[v], mat, triscreen[v]);

        // Scale it onto display space
        triscreen[v][0] =  triscreen[v][0] * this.width + this.hwidth;
        triscreen[v][1] = -triscreen[v][1] * this.height + this.hheight;
      }

      Vector3.sub(triworld[2], triworld[1], v1);
      Vector3.sub(triworld[1], triworld[0], v2);
      Vector3.cross(v1, v2, fnormal);
      Vector3.norm(fnormal, fnormal);

      let power = Vector3.dot(fnormal, light);

      // power = 1;
      if (power > 0)
      {
        //power = 1;
        this.tri(triscreen, (255 * power)>>0, (255 * power)>>0, (255 * power)>>0, !true);
      }
    }
  }

}
