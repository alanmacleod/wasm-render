
import IRasteriser                  from './IRasteriser';
import Texture                      from '../Texture';
import SharedMemory                 from '../SharedMemory'
import {WasmInstance}               from '../main.ext';
import Mesh                         from '../mesh/Mesh';
import {BYTES_PER_PIXEL, INT32,
        ALPHA_MAGIC_NUMBER,
        MAX_WASM_TASKS_PER_FRAME}   from '../Sym';

const WASM_TASK_LENGTH = INT32 + INT32  // triangle point0 X, Y
                       + INT32 + INT32  // point1 X, Y
                       + INT32 + INT32; // point2 X, Y


export default class WasmRasteriser implements IRasteriser
{
  private wasm: WasmInstance;
  private width:number;
  private height:number;
  private pagesize:number;

  // Single WASM call per frame, executes this raster job list:
  private taskbuffer:SharedMemory;
  private taskno:number;

  // and rasterises into this:
  private framebuffer:SharedMemory;

  ready: boolean;

  constructor(wasm: WasmInstance)
  {
    this.wasm = wasm;
    this.ready = false;
  }

  public begin()
  {
    // Start a new task list
    this.taskno = 0;
  }

  public end()
  {
    // Smash the arse off the rasteriser
  }

  public init(w: number, h: number)
  {
    this.width = w;
    this.height = h;
    this.pagesize = w * h * BYTES_PER_PIXEL;

    // Alocate some shared memory
    this.framebuffer = new SharedMemory( this.wasm, this.pagesize )

    // Rasterisation jobs per frame
    this.taskbuffer = new SharedMemory( this.wasm, MAX_WASM_TASKS_PER_FRAME * WASM_TASK_LENGTH );


    // Tell the WASM exports where to find the heap data and also pass dims
    this.wasm._init( this.framebuffer.pointer, w, h );

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

  public tri(points:number[][], uvs:number[][], light:number, tex: Texture): void
  {
    // add a job to the list

    // We need to stuff the vertex data into a heap buffer before calling
    // the C code

  }

}
