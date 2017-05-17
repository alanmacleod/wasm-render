
import WasmLoader from './WasmLoader';

let w = new WasmLoader();

w.load("./wasm/test").then((wasm) => {

  // // fill heap
  // for (let t=0; t< 100; t++)
  // {
  //   wasm.HEAP32[t] = t;
  // }

  const INT32_SIZE = 4;
  let numInt32 = 5;

  let testArray = new Int32Array([10,11,12,13,14]);

  let ptr = wasm._malloc(numInt32 * INT32_SIZE);

  wasm.HEAP32.set(testArray, ptr / INT32_SIZE);

  //console.log("Module...", Module);

  wasm._addOne(ptr);

});
