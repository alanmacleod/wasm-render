
// IRasteriser.ts
//              Common interface for Device() to use allowing uniform method
//              calls and switching between rasterisers

import Texture  from '../memory/Texture';

interface IRasteriser
{
  buffer: Uint8ClampedArray;
  ready: boolean;

  init( width: number, height: number ): void;
  tri(points:number[][], uvs:number[][], light:number, tex: Texture, wireframe?:boolean): void;

  // Setup method for every frame
  begin(): void;
}

export default IRasteriser;
