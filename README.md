# wasm-render
Software rasteriser written in WASM/C &amp; TypeScript to test WebAssembly and compare performance

Rasteriser draws a single texture-mapped polygon onto each face of a simple 3D mesh. The same code has been written in pure Javascript (well... TypeScript) and then again in WebAssembly / C.

![alt tag](https://raw.githubusercontent.com/alanmacleod/wasm-render/master/pub/img/screenshot2.jpg)

You can switch between C and JS at run time to visually compare performance, and a realtime latency graph is included to measure each frame time in milliseconds.

Click the graph to switch between JS and WebAssembly/C.

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
