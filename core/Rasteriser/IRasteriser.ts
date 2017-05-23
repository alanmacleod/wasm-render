
import Mesh from '../mesh/Mesh';

interface IRasteriser
{
  buffer: Uint8ClampedArray;
  ready: boolean;

  init( width: number, height: number ): void;
  fill( r:number, g:number, b:number ): void;
  pset( x:number, y:number, r:number, g:number, b:number );

  rasterise( mesh:Mesh, matrix:number[][] ): void;
}

export default IRasteriser;
