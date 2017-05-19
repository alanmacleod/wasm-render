
import WasmLoader                     from './WasmLoader';
import StatsGraph, {StatsMode}        from './StatsGraph';
import NativeRasteriser               from './rasteriser/NativeRasteriser';
import WasmRasteriser                 from './rasteriser/WasmRasteriser';
import {WasmInstance}                 from './main.ext';
import Device                         from './Device';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();
let s = new StatsGraph(StatsMode.MS);

w.load("./wasm/test").then((wasm: WasmInstance) =>
{
  // Create a rasteriser
  let nraster = new NativeRasteriser();
  let wraster = new WasmRasteriser(wasm);

  // Create a device, pass the rasteriser
  let device = new Device(SCR_WIDTH, SCR_HEIGHT, nraster);

  device.create();

  nraster.fill(32,0,128);

  // for (let x=0; x <640; x+=8)
  // {
  //   nraster.vline(x, 0, 479, 255,255,255);
  //   nraster.vline(x+1, 0, 479, 0,0,0);
  //   nraster.vline(x+2, 0, 479, 255,255,255);
  // }

  for (let t=0; t<10000; t++)
  {
    nraster.line(
      Math.floor(Math.random() * SCR_WIDTH),
      Math.floor(Math.random() * SCR_HEIGHT),
      Math.floor(Math.random() * SCR_WIDTH),
      Math.floor(Math.random() * SCR_HEIGHT),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    );
  }



  device.flip();
  //
  // requestAnimationFrame(render);
  //
  // function render()
  // {
  //   s.begin();
  //   device.flip();
  //   s.end();
  //
  //   // s.begin();
  //   // for (let t:number = 0; t<60; t++)
  //   // {
  //   //   //wasm.a.addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
  //   //   device.flip(view);
  //   // }
  //   // s.end();
  //   //
  //   requestAnimationFrame(render);
  // }

});
