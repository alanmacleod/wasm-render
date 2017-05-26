
import Mesh                           from './mesh/Mesh';
import WasmLoader                     from './WasmLoader';
import Texture                        from './Texture';
import StatsGraph, {StatsMode}        from './StatsGraph';
import NativeRasteriser               from './rasteriser/NativeRasteriser';
import WasmRasteriser                 from './rasteriser/WasmRasteriser';
import {WasmInstance}                 from './main.ext';
import Device                         from './Device';
import Matrix                         from './Matrix';
import Vector2                        from './Vector2';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();
let stats;

const RASTERISER_NATIVE = 0, RASTERISER_WASM = 1;
let rasterisers = [];
let currentraster = RASTERISER_NATIVE;

// Create and position simple test object
let box = new Mesh();
box.boxgeometry( 1, 1, 1 );
box.set( [0,0,6], [0,0,0] );

// Eye -> Screen matrices
let mprojection = Matrix.create(); // Camera -> Screen
let mcamera     = Matrix.create(); // Duh
let mtransform  = Matrix.create(); // Concatenated transformation

Matrix.perspective( 45, SCR_WIDTH/SCR_HEIGHT, 0.01, 1.0, mprojection );
Matrix.lookat( [0,0,10], [0,0,0], [0,1,0], mcamera );

// Concatenate the above matrices for speed
Matrix.concat( [mcamera, mprojection], mtransform );

// Load the WASM code over the wire
w.load("./wasm/WasmRasteriser").then((wasm: WasmInstance) =>
{
  // // Create the two rasterisers
  rasterisers[0] = new NativeRasteriser();
  rasterisers[1] = new WasmRasteriser( wasm );

  // Load the texture here because the WASM instance is needed for SharedMem
  let t = new Texture( wasm, "./img/radicrate.jpg" );
  box.textures.push( t );

  // The 'device' calls the rasterisers and handles the Canvas
  let device = new Device( SCR_WIDTH, SCR_HEIGHT, rasterisers[currentraster] );
  device.create();

  // device.switchrasteriser(wraster)

  stats = new StatsGraph(StatsMode.MS, device.container, function(){
    currentraster = 1 - currentraster;
    device.use(rasterisers[currentraster]);
    let title = currentraster ? "WebAssembly / C:" : "JavaScript:";
    stats.setview(title);
  });


  requestAnimationFrame( render );
  var ang = 360;

  // Main render loop
  function render()
  {
    stats.begin();

    box.setrotation( [0, (ang-=2) % 360, 0] );

    device.clear();
    device.render( box, mtransform );
    device.flip();

    stats.end();
    // if (ang < 10)
    requestAnimationFrame( render );
  }

});


/*
// One of a few performance tests I ran. This one to test memory read/write.
// Had others but didn't keep the code, don't cry.
function runbenchmarks(wasm)
{
  const bsize = 65536;
  const iterations = 5000;
  let hm = wasm._malloc(bsize);
  let wasmview = new Uint8Array(wasm.buffer, hm, bsize);
  let realview = new Uint8Array(bsize);

  let tstart = performance.now();
  // write to buffer
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      wasmview[o] = 1;
  }

  let wasmtotal_write = performance.now() - tstart;

  tstart = performance.now();
  // write to buffer
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      realview[o] = 1;
  }

  let realtotal_write = performance.now() - tstart;

  tstart = performance.now();
  let v = 0;
  // read
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      v = wasmview[o];
  }

  let wasmtotal_read = performance.now() - tstart;

  tstart = performance.now();
  v = 0;
  // read
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      v = realview[o];
  }

  let realtotal_read = performance.now() - tstart;

  console.log(`For ${iterations} WRITE iterations to ${bsize} bytes in WASM View took ${wasmtotal_write} ms`);
  console.log(`For ${iterations} WRITE iterations to ${bsize} bytes in REAL View took ${realtotal_write} ms`);
  console.log(`For ${iterations} READ iterations to ${bsize} bytes in WASM View took ${wasmtotal_read} ms`);
  console.log(`For ${iterations} READ iterations to ${bsize} bytes in REAL View took ${realtotal_read} ms`);


}
*/
