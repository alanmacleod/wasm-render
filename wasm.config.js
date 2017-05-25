// wasm.config.js
module.exports = {
  emscripten_path: './../emsdk',
  inputfile: './c/WasmRasteriser.c',
  extras: '', //'./c/vec3.c',
  outputfile: './pub/wasm/WasmRasteriser.js',
  exported_functions: [
    '_init','_exec_jobs', '_fill', '_pset', '_vline'
  ],
  flags: [
    '-s WASM=1',
    '-s ASSERTIONS=1',
    '-O3',
  ],
};
