
// Device.ts
// Just abstracts the canvas crap
// Accepts a Uint8 buffer for rendering

import IRasteriser       from './rasteriser/IRasteriser';
import {BYTES_PER_PIXEL} from './Sym';

// rename VideoDevice() as will extend to include texture "memory" etc
export default class Device
{
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private imageData: ImageData;
  private rasteriser: IRasteriser;
  private bytes: number;

  constructor(width: number, height: number, rasteriser: IRasteriser)
  {
    this.width = width;
    this.height = height;
    this.rasteriser = rasteriser;

    this.rasteriser.init(width, height);
    this.bytes = width * height * BYTES_PER_PIXEL;
  }

  public create(element?:string): void
  {
    let e:HTMLElement = !(element) ? document.body :
                                     document.getElementById( element );

    let c:HTMLCanvasElement = document.createElement( 'canvas' );

    c.width = this.width;
    c.height = this.height;

    this.canvas = c;
    this.context = this.canvas.getContext( '2d' );

    // the actual pixel data
    this.imageData = this.context.getImageData( 0, 0, this.width, this.height );

    e.appendChild( c );

    this.clear();
  }

  public use(rasteriser:IRasteriser): void
  {
    if (!rasteriser.ready)
      rasteriser.init( this.width, this.height );

    this.rasteriser = rasteriser;
  }

  public clear(colour:string = "#000000"): void
  {
    this.context.fillStyle = colour;
    this.context.fillRect( 0, 0, this.width, this.height );
  }

  // Old school points for smiling at 'flip'
  public flip(): void
  {
    if (!this.rasteriser.buffer)
      throw new ReferenceError("`rasteriser.buffer: Uint8ClampedArray` is required!");

    this.imageData.data.set( this.rasteriser.buffer );
    this.context.putImageData( this.imageData, 0, 0 );
  }


}
