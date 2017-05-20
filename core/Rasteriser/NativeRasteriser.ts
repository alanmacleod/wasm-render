
import IRasteriser            from './IRasteriser';
import Vector2                from '../Vector2';
import Vector3                from '../Vector3';
import {BYTES_PER_PIXEL,
        ALPHA_MAGIC_NUMBER}   from '../sym';


export default class NativeRasteriser implements IRasteriser
{
  private width:number;
  private height:number;
  private pagesize:number;
  // private numpixels:number;

  // TODO: Perhaps use Uint32 view for cleaner writes?
  // Real TypedArray to emulate wasm heap
  buffer: Uint8ClampedArray;
  ready: boolean;


  constructor()
  {
    this.ready = false;
  }

  public init(w: number, h: number): void
  {
    this.width = w;
    this.height = h;
    this.pagesize = w * h * BYTES_PER_PIXEL;
    this.buffer = new Uint8ClampedArray( this.pagesize );
    this.ready = true;
  }

  public line(x0, y0, x1, y1, r, g, b)
  {
    // Clipping?

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
  public tri(points:Vector2[], r:number, g:number, b:number): void
  {
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
    let o = new Vector3();

    // Scan a simple bbox
    for ( let y=miny; y<=maxy; y++ )
    {
      for (let x=minx; x<=maxx; x++ )
      {
        // Test each coord
        P.x = x;
        P.y = y;

        // Can be massively optimised by unrolling this call
        o = P.barycentric(points[0], points[1], points[2]);

        // o = weighted ratio of each corner
        // points[0] = o.x
        // points[1] = o.y
        // points[2] = o.z

        if (o.x < 0 || o.y < 0 || o.z < 0) continue;

        // This coord is in the triangle, draw it
        this.pset( x, y, r, g, b );

      }
    }

  }


  public pset(x: number, y: number, r: number, g: number, b: number): void
  {
    let o:number = y * this.width * BYTES_PER_PIXEL + x * BYTES_PER_PIXEL;

    this.buffer[ o + 0 ] = r;
    this.buffer[ o + 1 ] = g;
    this.buffer[ o + 2 ] = b;
    this.buffer[ o + 3 ] = 255;
  }

  public vline(x:number, y1:number, y2:number, r:number, g:number, b:number): void
  {
    let hwidth = this.width * BYTES_PER_PIXEL;
    let xo = x * BYTES_PER_PIXEL;

    for (let y:number=y1; y<=y2; y++)
    {
      let o = y * hwidth + xo;

      this.buffer[ o + 0 ] = r;
      this.buffer[ o + 1 ] = g;
      this.buffer[ o + 2 ] = b;
      this.buffer[ o + 3 ] = 255;
    }
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

  render()
  {

  }
}
