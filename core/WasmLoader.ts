

(<any>window).Module = {};

class WasmLoader
{
  constructor()
  {

  }

  load(wasm: string)
  {
    let _wasm = wasm + ".wasm";
    let _imports = wasm + ".js";

    return new Promise((resolve, reject) => {

      // WASM not supported, end
      if (!('WebAssembly' in window))
      {
        console.log('Could not load WASM');
        return reject((<any>window).Module);
      }

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

        (<any>window).script.src = './wasm/test.js';
        document.body.appendChild((<any>window).script);

      });

    });

  }

}

export default WasmLoader;
