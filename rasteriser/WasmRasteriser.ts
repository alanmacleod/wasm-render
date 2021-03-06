
import IRasteriser                  from './IRasteriser';
import Texture                      from '../memory/Texture';
import SharedMemory                 from '../memory/SharedMemory'
import {WasmInstance}               from '../core/main.ext';
import Mesh                         from '../mesh/Mesh';
import {BYTES_PER_PIXEL, INT32,
        ALPHA_MAGIC_NUMBER}         from '../core/Sym';

// WasmRasteriser.ts
//              Mostly a skeleton class to hook up the WebAssembly funcs

export default class WasmRasteriser implements IRasteriser
{
  private wasm: WasmInstance;
  private width:number;
  private height:number;
  private pagesize:number;

  // and rasterises into this:
  private framebuffer:SharedMemory;
  private _zbuffer: number;
  private zbuffer: Uint8Array;

  ready: boolean;

  constructor(wasm: WasmInstance)
  {
    this.wasm = wasm;
    this.ready = false;
  }

  public begin()
  {

    this.zbuffer.fill(0);
    this.framebuffer.buffer32.fill(0xff000000);

  }


  public init(w: number, h: number)
  {
    if (this.ready) return;
    this.width = w;
    this.height = h;
    this.pagesize = w * h * BYTES_PER_PIXEL;

    // Alocate some shared memory
    this.framebuffer = new SharedMemory( this.wasm, this.pagesize )
    this._zbuffer = this.wasm._malloc( w * h * 4);

    // Reference to the above so we can clear it here
    this.zbuffer = new Uint8Array(this.wasm.buffer, this._zbuffer, w * h * 4);

    // Tell the WASM exports where to find the heap data and also pass dims
    this.wasm._init( this.framebuffer.pointer, this._zbuffer, w, h );

    this.ready = true;
  }

  get buffer():Uint8ClampedArray
  {
    return this.framebuffer.buffer;
  }

  private rgbpack(r:number,g:number,b:number): number
  {
    // little-endian bytepack: aaaaaaaa bbbbbbbb gggggggg rrrrrrrr
    return ALPHA_MAGIC_NUMBER + (b << 16) + (g << 8) + r;
  }

  public pset(x:number, y:number, r:number, g:number, b:number)
  {
    this.wasm._pset(x<<0, y<<0, this.rgbpack(r,g,b));
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

  public tri(points:number[][], uvs:number[][], light:number, tex: Texture, wireframe?:boolean): void
  {
    // In Javascript we render wireframe before the texture has loaded
    // but for WASM I'll just skip adding the job cos I haven't implemented
    // a line routine in C!
    if (!tex.ready)
      return;

      // console.log("tri",  points[0][0], points[0][1], points[0][2], uvs[0][0], uvs[0][1],
      //                 points[1][0], points[1][1], points[1][2], uvs[1][0], uvs[1][1],
      //                 points[2][0], points[2][1], points[2][2], uvs[2][0], uvs[2][1],
      //                 tex.data.pointer, tex.width, light);
      //
    // Call the WASM/C code! ....omg it's fast
    this.wasm._tri( points[0][0], points[0][1], points[0][2], uvs[0][0], uvs[0][1],
                    points[1][0], points[1][1], points[1][2], uvs[1][0], uvs[1][1],
                    points[2][0], points[2][1], points[2][2], uvs[2][0], uvs[2][1],
                    tex.data.pointer, tex.width, light);

  }

}
