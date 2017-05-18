
import WasmLoader       from './WasmLoader';
import StatsGraph       from './StatsGraph';
import NativeRasteriser from './rasteriser/NativeRasteriser';
import {WasmInstance}   from './main.ext';
import Device           from './Device';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();
let s = new StatsGraph();

w.load("./wasm/test").then((wasm: WasmInstance) =>
{
  let device = new Device(SCR_WIDTH, SCR_HEIGHT);

  device.insert();
  device.clear('#ff00ff');

  // Allocate a buffer on the heap for our WASM code to write into
  // Note that the boilerplate in wasm/test.js sets a limit of 16 MB
  // although theoretically the maximum is 4 GB
  let HEAP_buffer_ptr8 = wasm._malloc(PAGE_SIZE_BYTES);

  // Now create a reverse-reference to the WASM heap as a JS TypedArray
  // Which we can manipulate easily JS-side, e.g. copy into the Canvas
  let view = new Uint8ClampedArray(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);

  requestAnimationFrame(render);

  function render()
  {
    s.begin();
      wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
      device.flip(view);
    s.end();

    requestAnimationFrame(render);
  }

});
