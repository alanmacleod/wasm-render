
// Device.ts
// Just abstracts the canvas crap
// Accepts a Uint8 buffer for rendering

// 32-bit colour RGBA
const PIXEL_SIZE_BYTES:number = 4;

export default class Device
{
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private imageData: ImageData;

  constructor(width: number, height: number)
  {
    this.width = width;
    this.height = height;

    let bytes:number = width * height * PIXEL_SIZE_BYTES;
  }

  insert(element?:string)
  {
    let e:HTMLElement = !(element) ? document.body :
                                     document.getElementById(element);

    let c:HTMLCanvasElement = document.createElement('canvas');

    c.width = this.width;
    c.height = this.height;

    this.canvas = c;
    this.context = this.canvas.getContext('2d');

    // the actual pixel data
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);

    e.appendChild(c);
  }

  clear(colour:string = "0xffffff")
  {
    this.context.fillStyle = colour;
    this.context.fillRect( 0, 0, this.width, this.height );
  }

  // Old school points for anyone who cracks a smile at the 'flip' verb
  flip(buffer: Uint8ClampedArray)
  {
    if (!buffer)
      throw new ReferenceError("`buffer: Uint8ClampedArray` is required!");

    this.imageData.data.set(buffer);
    this.context.putImageData(this.imageData, 0, 0);
  }


}
