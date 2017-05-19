
import IRasteriser          from './IRasteriser';
import {WasmInstance}       from '../main.ext';
import {BYTES_PER_PIXEL,
        ALPHA_MAGIC_NUMBER}  from '../sym';


export default class WasmRasteriser implements IRasteriser
{
  private wasm: WasmInstance;
  private width:number;
  private height:number;
  private pagesize:number;

  // Real heap memory here
  private heapbuffer: number;

  // Reference to the heap memory
  buffer: Uint8ClampedArray;
  ready: boolean;

  constructor(wasm: WasmInstance)
  {
    this.wasm = wasm;
    this.ready = false;
  }

  public init(w: number, h: number)
  {
    this.width = w;
    this.height = h;
    this.pagesize = w * h * BYTES_PER_PIXEL;

    // Allocate buffer on the WASM heap
    this.heapbuffer = this.wasm._malloc( this.pagesize );

    // Tell the WASM exports where to find the heap data and also pass dims
    this.wasm._init( this.heapbuffer, w, h );

    // Now create a "reverse reference" to the heap using a JS TypedArray
    this.buffer = new Uint8ClampedArray( this.wasm.buffer,
      this.heapbuffer,
      this.pagesize
    );

    this.ready = true;
  }

  private rgbpack(r:number,g:number,b:number): number
  {
    // little-endian bytepack: aaaaaaaa bbbbbbbb gggggggg rrrrrrrr
    return ALPHA_MAGIC_NUMBER + (b << 16) + (g << 8) + r;
  }

  public pset(x:number, y:number, r:number, g:number, b:number)
  {
    this.wasm._pset(x, y, this.rgbpack(r,g,b));
  }

  public vline(x:number, y1:number, y2:number, r:number, g:number, b:number): void
  {
    this.wasm._vline(x, y1, y2, this.rgbpack(r,g,b));
  }

  public fill(r:number, g:number, b:number): void
  {
    //TODO: use memset!
    this.wasm._fill(this.rgbpack(r,g,b));
  }

  render()
  {

  }
}
