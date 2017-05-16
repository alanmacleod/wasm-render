// wasm.config.js
module.exports = {
  emscripten_path: './../emsdk',
  inputfile: './c/test.c',
  outputfile: './wasm/lib.js',
  exported_functions: [
    '_addOne',
  ],
  flags: [
    '-s WASM=1',
    '-s ASSERTIONS=1',
    '-O3',
  ],
};
