
import IRasteriser           from './IRasteriser';
import {BYTES_PER_PIXEL,
        ALPHA_MAGIC_NUMBER}  from '../sym';


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

  public triangle(): void {};

  constructor()
  {
    this.ready = false;

    this.triangle = () =>
    {
      console.log("Hell I'm a triangle");
    }
  }

  public init(w: number, h: number)
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

  // void line(int x0, int y0, int x1, int y1, TGAImage &image, TGAColor color) {
  //     bool steep = false;
  //     if (std::abs(x0-x1)<std::abs(y0-y1)) {
  //         std::swap(x0, y0);
  //         std::swap(x1, y1);
  //         steep = true;
  //     }
  //     if (x0>x1) {
  //         std::swap(x0, x1);
  //         std::swap(y0, y1);
  //     }
  //     int dx = x1-x0;
  //     int dy = y1-y0;
  //     int derror2 = std::abs(dy)*2;
  //     int error2 = 0;
  //     int y = y0;
  //     for (int x=x0; x<=x1; x++) {
  //         if (steep) {
  //             image.set(y, x, color);
  //         } else {
  //             image.set(x, y, color);
  //         }
  //         error2 += derror2;
  //         if (error2 > dx) {
  //             y += (y1>y0?1:-1);
  //             error2 -= dx*2;
  //         }
  //     }
  // }

  private xline(xd, yd, x1, y1, x2, y2, r, g, b)
  {
    let ychange = yd / xd;
    let y = y1;
    for (let x=x1; x<=x2; x++)
    {
      this.pset(x, Math.round(y), r, g, b);
      y += ychange;
    }
  }

  public pset(x: number, y: number, r: number, g: number, b: number)
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
