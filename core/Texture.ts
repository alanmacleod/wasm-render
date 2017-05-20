
interface ITexture
{
  buffer: Uint8ClampedArray;
  heapbuffer: number;
}

export default class Texture implements ITexture
{
  buffer: Uint8ClampedArray
  heapbuffer: number;

  constructor()
  {

  }
}
