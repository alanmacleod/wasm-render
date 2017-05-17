
import WasmLoader from './WasmLoader';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();

w.load("./wasm/test").then((wasm) => {


  let c = createCanvas(SCR_WIDTH, SCR_HEIGHT);
  let ctx = c.getContext('2d');

  ctx.fillStyle = "#0000ff";
  ctx.fillRect(0,0,SCR_WIDTH, SCR_HEIGHT);

  let canvasData = ctx.getImageData(0, 0, SCR_WIDTH, SCR_HEIGHT);

  // let testArray = new Uint8ClampedArray(PAGE_SIZE_BYTES);
  // testArray.fill(0);
  // canvasData.data.set(testArray)

  let HEAP_buffer_ptr8 = wasm._malloc(PAGE_SIZE_BYTES);
  //let view = new DataView(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
  let view = new Uint8ClampedArray(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);

  wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);

  let time = performance.now();

  for (let t=0; t<60; t++)
  {
    canvasData.data.set(view);
    ctx.putImageData(canvasData, 0, 0);
  }

  console.log("60 time = ", performance.now() - time);


  // Create array of five int32s
  //let numInt32 = 5;
  //let testArray = new Int32Array([10,11,12,13,14]);
  //let doubleBuffer = new Uint8Array(PAGE_SIZE_BYTES);

  // Allocate bytes on the WASM heap (max 4GB) and get *int (as 32-bit JS int)
  // which is a byte-aligned offset
  //let ptr = wasm._malloc(PAGE_SIZE_BYTES);

  //let offset32 = ptr / INT32_SIZE_IN_BYTES;
  //let offset8 = ptr;

  // Copy data from our ArrayBuffer onto the heap via above *int
  // divide 8-bit byte offset by 4 to get 32-bit offset
  //wasm.HEAP32.set(testArray, offset32);

  //let view = new DataView(wasm.buffer, ptr, numInt32 * INT32_SIZE_IN_BYTES);

  //console.log(wasm);

  // wasm._addOne(ptr);

  // let startTime = performance.now();
  // for (let t=0; t<60; t++)
  // {
  //   testArray.set(wasm.HEAP32.subarray(offset32, offset32 + numInt32));
  // }

  // console.log(wasm._memcpy);

});



function createCanvas(w, h)
{
  let c = document.createElement('canvas');
  c.width = w, c.height = h;
  document.body.appendChild(c);
  return c;
}
