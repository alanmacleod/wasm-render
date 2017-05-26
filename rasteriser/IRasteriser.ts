
// import Mesh     from '../mesh/Mesh';
import Texture  from '../memory/Texture';

interface IRasteriser
{
  buffer: Uint8ClampedArray;
  ready: boolean;

  init( width: number, height: number ): void;
  tri(points:number[][], uvs:number[][], light:number, tex: Texture): void;

  // Setup and tear-down methods called by Device every frame
  begin(): void;
  end(): void;
}

export default IRasteriser;
