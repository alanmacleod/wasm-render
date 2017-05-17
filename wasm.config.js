// wasm.config.js
module.exports = {
  emscripten_path: './../emsdk',
  inputfile: './c/test.c',
  outputfile: './pub/wasm/test.js',
  exported_functions: [
    '_addOne',
  ],
  flags: [
    '-s WASM=1',
    '-s ASSERTIONS=1',
    '-O3',
  ],
};
