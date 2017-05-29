

// NativeRasteriser.ts
//       Alan MacLeod 2017, alanamacleod.eu, github.com/alanmacleod
//       "Native" probably a bit misleading. More of a "Reference" rasteriser
//       Inspired and influenced by portions of Dmitry V. Sokolov's course
//       work: https://github.com/ssloy


import IRasteriser            from './IRasteriser';
import Clip                   from './Clip';
import Mesh                   from '../mesh/Mesh';
import Texture                from '../memory/Texture';
import Vector2                from '../math/Vector2';
import Vector3                from '../math/Vector3';
import {BYTES_PER_PIXEL, BIT_SHIFT_PER_PIXEL,
        ALPHA_MAGIC_NUMBER}   from '../core/Sym';
import Matrix                 from '../math/Matrix';


export default class NativeRasteriser implements IRasteriser
{
  private width:number;
  private height:number;
  private pagesize:number;
  private hwidth: number;
  private hheight: number;

  // Use a SharedMemory?
  private zbuffer: Float32Array;

  // IRasteriser members
  // TODO: Perhaps use Uint32 bytepack view for cleaner/faster/easier writes?
  // Real TypedArray to emulate wasm heap
  public buffer: Uint8ClampedArray;
  private buffer32: Int32Array;
  public ready: boolean;

  constructor()
  {
    this.ready = false;
  }

  public init(w: number, h: number): void
  {
    if (this.ready) return;
    this.width = w; this.hwidth = (w/2)>>0;
    this.height = h; this.hheight = (h/2)>>0;
    this.pagesize = w * h * BYTES_PER_PIXEL;
    this.buffer = new Uint8ClampedArray( this.pagesize );
    this.buffer32 = new Int32Array(this.buffer);

    this.zbuffer = new Float32Array( w * h );
    this.ready = true;
  }

  public begin()
  {
   this.buffer.fill(0);
  //  this.buffer32.fill(ALPHA_MAGIC_NUMBER + 255);
  }

  public end()
  {
    this.zbuffer.fill(0);
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

  /* flat shaded tri for testing
  public triflat(points:number[][], r:number, g:number, b:number, wireframe?:boolean): void
  {
    if (wireframe)
    {
      this.wireframe(points);
      return;
    }

    // Get a bounding box from three points
    let minx:number = Math.min(points[0][0], Math.min=(points[1][0], points[2][0]));
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
        // Can be massively optimised by unrolling this call
        Vector2.barycentric([x,y], points[0], points[1], points[2], o);

        if (o[0] < 0 || o[1] < 0 || o[2] < 0) continue;

        // This coord is in the triangle

        // Calculate the pixel's Z
        let z = points[0][2] * o[0] +
                points[1][2] * o[1] +
                points[2][2] * o[2];

        let zo = y * this.width + x;

        // Is it closer than an existing pixel? Draw it
        if (this.zbuffer[zo] < z)
        {
          this.zbuffer[zo] = z;
          this.pset( x, y, r, g, b );
        }

      }
    }

  }

  */

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
        0, 0, 0,  // Colour
        true            // Clipping?
      );
    }
  }

  // Uses a barycentric coord technique of rasterisation I found here
  // in this excellent course/repo: https://github.com/ssloy/tinyrenderer

  public tri(points:number[][], uvs:number[][], light:number, tex: Texture, wireframe?:boolean): void
  {
    // Texture hasn't loaded yet, draw an outline
    if (!tex.ready || wireframe)
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

    let P:number[] = [0, 0];
    let o = [0, 0, 0];

    let texels = tex.data.buffer;
    let texmaxu= tex.maxu;
    let texmaxv = tex.maxv;
    let texw = tex.width;
    let texh = tex.height;

    let u=0, v=0;
    let r=0, g=0, b=0;

    let inv_p0z = 1 / points[0][2];
    let inv_p1z = 1 / points[1][2];
    let inv_p2z = 1 / points[2][2];

    // FIXME below: just * by inv_p0z etc you idiot.
    let inv_p0u = uvs[0][0] / points[0][2];
    let inv_p1u = uvs[1][0] / points[1][2];
    let inv_p2u = uvs[2][0] / points[2][2];

    let inv_p0v = uvs[0][1] / points[0][2];
    let inv_p1v = uvs[1][1] / points[1][2];
    let inv_p2v = uvs[2][1] / points[2][2];

    let inv_Pz = 0;
    let inv_Pu = 0;
    let inv_Pv = 0;

    // Barycentre data we can precalc and cache outside inner loop
    let va0 = points[2][0] - points[0][0];
    let va1 = points[1][0] - points[0][0];
    let va2; // <- needs perpixel calc

    let vb0 = points[2][1] - points[0][1];
    let vb1 = points[1][1] - points[0][1];
    let vb2; // <- needs perpixel calc

    let bc0; // <- needs perpixel calc
    let bc1; // <- needs perpixel calc
    let bc2 = va0 * vb1 - va1 * vb0;

    if (Math.abs(bc2) < 1)
      return;

    let iz = 1 / bc2;

    bc0 = va1 * vb2 - va2 * vb1;
    bc1 = va2 * vb0 - va0 * vb2;

    // Scan a simple bbox
    for ( P[1]=miny; P[1]<=maxy; P[1]++ )
    {
      for ( P[0]=minx; P[0]<=maxx; P[0]++ )
      {
        // barycentric is _all_ about Barry
        // Can be optimised by unrolling this call (- which I later did)
        // Vector2.barycentric( P, points[0], points[1], points[2], o );

        // Below: fragmented and unrolled barycentric() calcs:
        va2 = points[0][0] - P[0];
        vb2 = points[0][1] - P[1];

        bc0 = va1 * vb2 - va2 * vb1;
        bc1 = va2 * vb0 - va0 * vb2;

        o[0] = 1.0 - (bc0 + bc1) * iz;
        o[1] = bc1 * iz;
        o[2] = bc0 * iz;

        if (o[0] < 0 || o[1] < 0 || o[2] < 0) continue;

        // Calc weighted values
        // including linear -> persp correct 1/u div 1/z
        inv_Pz =  inv_p0z * o[0] +    // 1/z
                  inv_p1z * o[1] +
                  inv_p2z * o[2];
        inv_Pu =  inv_p0u * o[0] +    // u/z
                  inv_p1u * o[1] +
                  inv_p2u * o[2];
        inv_Pv =  inv_p0v * o[0] +    // v/z
                  inv_p1v * o[1] +
                  inv_p2v * o[2];

        let zo = P[1] * this.width + P[0];

        // Use 1/z depth test
        if (this.zbuffer[zo] > inv_Pz) continue;

        this.zbuffer[zo] = inv_Pz;

        // Divide u/z & v/z by 1/z to get perspective correct UV coords
        u = ((inv_Pu / inv_Pz) * texmaxu)>>0;
        v = ((inv_Pv / inv_Pz) * texmaxv)>>0

        let c = (v * texw << BIT_SHIFT_PER_PIXEL) + ( u << BIT_SHIFT_PER_PIXEL );
        let r = texels[ c+0 ] * light;
        let g = texels[ c+1 ] * light;
        let b = texels[ c+2 ] * light;

        this.pset( P[0], P[1], r, g, b );
      }
    }

  }

  // Smile if you remember QBASIC
  public pset(x: number, y: number, r: number, g: number, b: number): void
  {
    let o:number = (y>>0) * this.width * BYTES_PER_PIXEL + (x>>0) * BYTES_PER_PIXEL;

    this.buffer[ o + 0 ] = r;
    this.buffer[ o + 1 ] = g;
    this.buffer[ o + 2 ] = b;
    this.buffer[ o + 3 ] = 255;
  }

}
