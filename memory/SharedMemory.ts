
import {WasmInstance}   from '../core/main.ext';

export default class SharedMemory
{
  private _buffer: Uint8ClampedArray;
  private _buffer32: Int32Array;
  private _heap: number;         // *unsigned char pointer
  private wasm: WasmInstance;
  private size: number = 0;

  constructor(wasminstance: WasmInstance, sizebytes?:number)
  {
    this.wasm = wasminstance;

    if (sizebytes)
      this.allocate(sizebytes);
  }

  // Lock a chunk of WASM heap
  public allocate(sizebytes:number):number
  {
    this.size = sizebytes;
    this._heap = this.wasm._malloc(sizebytes);
    this._buffer = new Uint8ClampedArray(this.wasm.buffer, this._heap, this.size);

    // Note: us
    this._buffer32 = new Int32Array(this.wasm.buffer, this._heap, this.size);

    return this.size;
  }

  // Blit `from` -> `.buffer`
  public copy(from:Uint8ClampedArray)
  {
    if (!this.size)
      throw ReferenceError("Copying into unallocated memory");

    if (from.length != this._buffer.length)
      console.warn("Array byte size mis-match, truncating will occur");

    this._buffer.set(from);
  }

  // Warning: this returns a generic ref to the *entire* heap at base address!
  get heap(): ArrayBuffer
  {
    return this.wasm.buffer;
  }

  // Return a ref to our buffer view into WASM space
  get buffer(): Uint8ClampedArray
  {
    return this._buffer;
  }

  get bufferi32(): Int32Array
  {
    return this._buffer32;
  }

  // Return the heap pointer in WASM space (C funcs will need this)
  get pointer(): number
  {
    return this._heap;
  }
}
