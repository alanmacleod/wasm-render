// index.js
let m = {}
loadWASM().then(wasmModule => {
  m = wasmModule;
  console.log(m._addOne(1));

});
