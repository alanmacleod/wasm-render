
import SharedMemory         from './SharedMemory'
import {WasmInstance}       from './main.ext';
import {BYTES_PER_PIXEL}    from './Sym';

// Texture data is essentially stored in a plain Uint8 array
// located on the WASM heap via SharedMemory so accessible to JS and WASM code

export default class Texture
{
  public maxu: number;
  public maxv: number;
  public width: number;
  public height: number;
  public data: SharedMemory;
  public ready: boolean = false;
  private wasm:WasmInstance;

  // Bit annoyed I have to pass the wasminstance here cos of SharedMemory
  // But I'd rather wrap memory mgmt into this class then have it externally
  constructor(wasminstance:WasmInstance, url?:string)
  {
    if (url) this.load( url );
    this.wasm = wasminstance;
  }

  // Use the DOM/HTML/browser to get the data with a hidden '<img>' element
  public load(url:string):void
  {
    let i:HTMLImageElement = document.createElement( 'img' );

    i.src = url;

    i.onload = () =>
    {
      let canvas = document.createElement( "canvas" );
      let ctx = canvas.getContext( '2d' );

      this.maxu = i.width - 1;
      this.maxv = i.height - 1;
      canvas.width = i.width;
      canvas.height = i.height;

      this.width = i.width;
      this.height = i.height;

      ctx.drawImage( i, 0, 0, i.width, i.height, 0, 0, i.width, i.height );

      let data = ctx.getImageData( 0, 0, i.width, i.height ).data;

      this.data = new SharedMemory( this.wasm, BYTES_PER_PIXEL * i.width * i.height );

      // Blit the pixel byte data into the WASM heap
      // GC will pick up our `data` object
      this.data.copy( data );
      this.ready = true;
      i = null;
      data = null;
    }

  }

}
