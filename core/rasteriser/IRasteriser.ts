
import Mesh from '../mesh/Mesh';

interface IRasteriser
{
  buffer: Uint8ClampedArray;
  ready: boolean;

  init( width: number, height: number ): void;
  fill( r:number, g:number, b:number ): void;
  pset( x:number, y:number, r:number, g:number, b:number );

  // Setup and tear-down methods called by Device every frame
  begin(): void;
  end(): void;

  rasterise( mesh:Mesh, matrix:number[][] ): void;
}

export default IRasteriser;
