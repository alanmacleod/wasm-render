# wasm-render
Software rasteriser written in WASM/C &amp; TypeScript to test WebAssembly and compare performance

Using the rather awesome [wasm-init](https://github.com/shamadee/wasm-init) tool which relieved me of many, *many* headaches.

#### How to build and run


##### Install Emscripten
```
git clone https://github.com/juj/emsdk.git
cd emsdk
./emsdk install sdk-incoming-64bit binaryen-master-64bit
./emsdk activate sdk-incoming-64bit binaryen-master-64bit
```
_warning: this takes about an hour or more!_

##### Clone and install
```
git clone https://github.com/alanmacleod/wasm-render.git
npm install

npm run buildall

node server
```

If all went well, it should be running: http://localhost:3000/
