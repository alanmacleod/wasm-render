// loadWASM.js

var Module = {};
function loadWASM() {
  return new Promise((resolve, reject) => {
    if (!('WebAssembly' in window)) {
      console.log('Could not load WASM');
      return reject(Module);
    } else {
      // TODO: use xmlhttprequest where fetch not supported
      fetch('./wasm/lib.wasm')
        .then(response => {
          return response.arrayBuffer();
        })
        .then(buffer => {
          Module.wasmBinary = buffer;

          function wasmLoaded() {
            console.log('Emscripten boilerplate loaded.');
            resolve(Module);
          }

          // GLOBAL -- create custom event for complete glue script execution
          script = document.createElement('script');
          doneEvent = new Event('done');
          script.addEventListener('done', wasmLoaded);
          // END GLOBAL

          // TODO: IN EMSCRIPTEN GLUE INSERT
          // else{doRun()} ...
          // script.dispatchEvent(doneEvent);
          // ... }Module["run"]

          script.src = './wasm/lib.js';
          document.body.appendChild(script);
        });
    }
  });
}

