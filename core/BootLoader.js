

window.Module = {};

export default class BootLoader
{
  constructor()
  {

  }

  load(wasm)
  {
    let _wasm = wasm + ".wasm";
    let _imports = wasm + ".js";

    return new Promise((resolve, reject) => {

      // WASM not supported, end
      if (!('WebAssembly' in window))
      {
        console.log('Could not load WASM');
        return reject(Module);
      }

      fetch(_wasm).then( response => {
        return response.arrayBuffer();
      })
      .then(buffer => {

        Module.wasmBinary = buffer;

        window.script = document.createElement('script');
        window.doneEvent = new Event('done');

        window.script.addEventListener('done', () => {
          resolve(Module);
        });

        window.script.src = './wasm/test.js';
        document.body.appendChild(window.script);

      });

    });

  }

}
