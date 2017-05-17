
import BootLoader from './BootLoader';

let b = new BootLoader();

b.load("./wasm/test").then((wasm) => {

  wasm._addOne(1);

});
