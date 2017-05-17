
import WasmLoader from './WasmLoader';
import Stats      from '../lib/stats.min.js';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();

var stats = new Stats();
stats.showPanel( 1 );
document.body.appendChild( stats.dom );

// console.log(stats.dom);
stats.dom.style.position = "absolute";
stats.dom.style.top = "5px";
stats.dom.style.right = "5px";
stats.dom.style.left = "";

w.load("./wasm/test").then((wasm) => {

  // Setup Canvas and initialise to fill blue
  let c = createCanvas(SCR_WIDTH, SCR_HEIGHT);
  let ctx = c.getContext('2d');
  ctx.fillStyle = "#0000ff";
  ctx.fillRect(0,0,SCR_WIDTH, SCR_HEIGHT);

  // Get a reference to the image data bytes `canvasData.data`
  let canvasData = ctx.getImageData(0, 0, SCR_WIDTH, SCR_HEIGHT);

  // Allocate a buffer on the heap for our WASM code to write into
  let HEAP_buffer_ptr8 = wasm._malloc(PAGE_SIZE_BYTES);

  // Now create a reverse-reference to the WASM heap as a JS TypedArray
  // Which we can manipulate easily JS-side, e.g. copy into the Canvas
  let view = new Uint8ClampedArray(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);


  // let time = performance.now();
  //
  // for (let t=0; t<60; t++)
  // {
  //
  // }
  //
  // console.log("60 fps time = ", performance.now() - time);
  requestAnimationFrame(render);
  //render();


  function render()
  {
    stats.begin();

    let numFrames = 30 + Math.random() * 60;

    for (let t=0; t<numFrames; t++)
    {
      // Call the WASM/C code! Telling it where the heap data is
      wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);

      // Write it's output into our Canvas buffer
      canvasData.data.set(view);

      // Display on screen!
      ctx.putImageData(canvasData, 0, 0);
    }

    stats.end();

    requestAnimationFrame(render);
  }

});



function createCanvas(w, h)
{
  let c = document.createElement('canvas');
  c.width = w, c.height = h;
  document.body.appendChild(c);
  return c;
}
