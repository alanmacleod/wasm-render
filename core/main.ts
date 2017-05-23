
import Mesh                           from './mesh/Mesh';
import WasmLoader                     from './WasmLoader';
import Texture                        from './Texture';
import StatsGraph, {StatsMode}        from './StatsGraph';
import NativeRasteriser               from './rasteriser/NativeRasteriser';
import WasmRasteriser                 from './rasteriser/WasmRasteriser';
import {WasmInstance}                 from './main.ext';
import Device                         from './Device';
import Vector3                        from './Vector3';
import Matrix                         from './Matrix';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();
let s = new StatsGraph(StatsMode.FPS); // Performance monitoring

let m = new Mesh();
m.boxgeometry(1,1,1);

let m2 = new Mesh();
m2.boxgeometry(0.5,0.5,0.5);


let mprojection = Matrix.create(); // Camera -> Screen
let mcamera     = Matrix.create(); // Duh
let mrotatey    = Matrix.create(); // Object space rotation
let mtranslate  = Matrix.create(); // Object position in world
let mtransform  = Matrix.create(); // Concatenated transformation

Matrix.perspective(45, SCR_WIDTH/SCR_HEIGHT, 0.01, 1.0, mprojection);
Matrix.lookat([0,0,10], [0,0,0], [0,1,0], mcamera);

// Matrix.rotationy(5, mrotatey);
// Matrix.translate([0,0,0], mtranslate);
//
// Matrix.concat([mrotatey, mtranslate], m.matrix);

m.set( [0,0,4], [0,0,0] );
m2.set( [-0.9,0.2,4], [0,5,0] );

Matrix.concat([
    mcamera, mprojection
], mtransform);


w.load("./wasm/WasmRasteriser").then((wasm: WasmInstance) =>
{
  // Create a rasteriser
  let nraster = new NativeRasteriser();
  let wraster = new WasmRasteriser(wasm);

  let device = new Device(SCR_WIDTH, SCR_HEIGHT, nraster);
  device.create();

  let t = new Texture(wasm, "./img/test-texture.png");

  m.textures.push(t);
  m2.textures.push(t);

  nraster.fill(32,0,128);
  nraster.rasterise(m, mtransform);
  device.flip();

  requestAnimationFrame(render);
  var ang = 0;
  function render()
  {
    s.begin();
    ang += 3;

    m.setrotation( [0,ang,0] );
    m2.setrotation( [0,ang*2,0] );

    //nraster.fill(32,0,128);
    nraster.fill(0,0,0);

    nraster.rasterise(m, mtransform);
    nraster.rasterise(m2, mtransform);

    device.flip();

    s.end();

    requestAnimationFrame(render);
  }

});


/*
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
