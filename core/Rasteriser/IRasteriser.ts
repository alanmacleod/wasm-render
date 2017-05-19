
interface IRasteriser
{
  buffer: Uint8ClampedArray;
  ready: boolean;

  init(width: number, height: number): void;
  vline(x:number, y1:number, y2:number, r:number, g:number, b:number): void;
  fill(r:number, g:number, b:number): void;
  pset(x:number, y:number, r:number, g:number, b:number);

  render(): void;
}

export default IRasteriser;
