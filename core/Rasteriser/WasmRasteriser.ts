
import IRasteriser from './IRasteriser';
import {WasmInstance} from '../main.ext';

export class WasmRasteriser implements IRasteriser
{
  private wasm: WasmInstance;
  jobs: number;

  constructor(wasm: WasmInstance)
  {
    this.wasm = wasm;

  }

  render()
  {

  }
}
