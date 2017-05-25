
// import Mesh     from '../mesh/Mesh';
import Texture  from '../Texture';

interface IRasteriser
{
  buffer: Uint8ClampedArray;
  ready: boolean;

  init( width: number, height: number ): void;
  //fill( r:number, g:number, b:number ): void;
  //pset( x:number, y:number, r:number, g:number, b:number );
  tri(points:number[][], uvs:number[][], light:number, tex: Texture): void;

  // Setup and tear-down methods called by Device every frame
  begin(): void;
  finish(): void;
  end(): void;
}

export default IRasteriser;
