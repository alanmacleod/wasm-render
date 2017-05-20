
import {WasmInstance}   from './main.ext';

export default class SharedMemory
{
  private _buffer: Uint8ClampedArray;
  private _heap: number;         // *unsigned char pointer
  private wasm: WasmInstance;
  private size: number;

  constructor(wasminstance: WasmInstance, sizebytes?:number)
  {
    this.wasm = wasminstance;

    if (sizebytes)
      this.allocate(sizebytes);
  }

  public allocate(sizebytes:number):number
  {
    this.size = sizebytes;
    this._heap = this.wasm._malloc(sizebytes);
    this._buffer = new Uint8ClampedArray(this.wasm.buffer, this._heap, this.size);

    return this.size;
  }

  public copy(from:Uint8ClampedArray)
  {
    if (from.length != this._buffer.length)
      console.warn("Array byte size mis-match, truncating will occur");

    
  }

  get heap(): ArrayBuffer
  {
    return this.wasm.buffer;
  }

  get buffer(): Uint8ClampedArray
  {
    return this._buffer;
  }

  get pointer(): number
  {
    return this._heap;
  }
}
