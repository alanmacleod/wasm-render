// wasm.config.js
module.exports = {
  emscripten_path: './../emsdk',
  inputfile: './c/test.c',
  outputfile: './pub/wasm/test.js',
  exported_functions: [
    '_init', '_fill', '_pset', '_vline'
  ],
  flags: [
    '-s WASM=1',
    '-s ASSERTIONS=1',
    '-O3',
  ],
};
