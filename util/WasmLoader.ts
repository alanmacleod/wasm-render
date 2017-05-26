


// Errrr not sure how to properly handle this global member mess in TS?
(<any>window).Module = {};

export default class WasmLoader
{
  constructor() { }

  load(wasm: string)
  {

    let _wasm = wasm + ".wasm";
    let _imports = wasm + ".js";

    console.log("Fetching "+_wasm);

    return new Promise((resolve, reject) => {

      // WASM not supported, end
      if (!('WebAssembly' in window))
      {
        console.log('😂 WebAssembly not supported. Cool browser bro. 😂');
        return reject((<any>window).Module);
      }

      console.log("💪 WebAssembly ENABLED 💪");

      fetch(_wasm).then( response => {
        return response.arrayBuffer();
      })
      .then(buffer => {

        (<any>window).Module.wasmBinary = buffer;

        (<any>window).script = document.createElement('script');
        (<any>window).doneEvent = new Event('done');

        (<any>window).script.addEventListener('done', () => {
          resolve((<any>window).Module);
        });

        (<any>window).script.src = _imports;//'./wasm/test.js';
        document.body.appendChild((<any>window).script);

      });

    });

  }

}
