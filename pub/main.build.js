/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _WasmLoader = __webpack_require__(1);
	
	var _WasmLoader2 = _interopRequireDefault(_WasmLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INT32_SIZE_IN_BYTES = 4;
	var SCR_WIDTH = 640,
	    SCR_HEIGHT = 480;
	var PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;
	
	var w = new _WasmLoader2.default();
	
	w.load("./wasm/test").then(function (wasm) {
	
	  var c = createCanvas(SCR_WIDTH, SCR_HEIGHT);
	  var ctx = c.getContext('2d');
	
	  ctx.fillStyle = "#0000ff";
	  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
	
	  var canvasData = ctx.getImageData(0, 0, SCR_WIDTH, SCR_HEIGHT);
	
	  // let testArray = new Uint8ClampedArray(PAGE_SIZE_BYTES);
	  // testArray.fill(0);
	  // canvasData.data.set(testArray)
	
	  var HEAP_buffer_ptr8 = wasm._malloc(PAGE_SIZE_BYTES);
	  //let view = new DataView(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
	  var view = new Uint8ClampedArray(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
	
	  wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
	
	  var time = performance.now();
	
	  for (var t = 0; t < 60; t++) {
	    canvasData.data.set(view);
	    ctx.putImageData(canvasData, 0, 0);
	  }
	
	  console.log("60 time = ", performance.now() - time);
	
	  // Create array of five int32s
	  //let numInt32 = 5;
	  //let testArray = new Int32Array([10,11,12,13,14]);
	  //let doubleBuffer = new Uint8Array(PAGE_SIZE_BYTES);
	
	  // Allocate bytes on the WASM heap (max 4GB) and get *int (as 32-bit JS int)
	  // which is a byte-aligned offset
	  //let ptr = wasm._malloc(PAGE_SIZE_BYTES);
	
	  //let offset32 = ptr / INT32_SIZE_IN_BYTES;
	  //let offset8 = ptr;
	
	  // Copy data from our ArrayBuffer onto the heap via above *int
	  // divide 8-bit byte offset by 4 to get 32-bit offset
	  //wasm.HEAP32.set(testArray, offset32);
	
	  //let view = new DataView(wasm.buffer, ptr, numInt32 * INT32_SIZE_IN_BYTES);
	
	  //console.log(wasm);
	
	  // wasm._addOne(ptr);
	
	  // let startTime = performance.now();
	  // for (let t=0; t<60; t++)
	  // {
	  //   testArray.set(wasm.HEAP32.subarray(offset32, offset32 + numInt32));
	  // }
	
	  // console.log(wasm._memcpy);
	});
	
	function createCanvas(w, h) {
	  var c = document.createElement('canvas');
	  c.width = w, c.height = h;
	  document.body.appendChild(c);
	  return c;
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	window.Module = {};
	
	var WasmLoader = function () {
	  function WasmLoader() {
	    _classCallCheck(this, WasmLoader);
	  }
	
	  _createClass(WasmLoader, [{
	    key: "load",
	    value: function load(wasm) {
	      var _wasm = wasm + ".wasm";
	      var _imports = wasm + ".js";
	
	      return new Promise(function (resolve, reject) {
	
	        // WASM not supported, end
	        if (!('WebAssembly' in window)) {
	          console.log('Could not load WASM');
	          return reject(Module);
	        }
	
	        fetch(_wasm).then(function (response) {
	          return response.arrayBuffer();
	        }).then(function (buffer) {
	
	          Module.wasmBinary = buffer;
	
	          window.script = document.createElement('script');
	          window.doneEvent = new Event('done');
	
	          window.script.addEventListener('done', function () {
	            resolve(Module);
	          });
	
	          window.script.src = './wasm/test.js';
	          document.body.appendChild(window.script);
	        });
	      });
	    }
	  }]);
	
	  return WasmLoader;
	}();
	
	exports.default = WasmLoader;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWU5ZjliZTFjOTMxODkxMTRiMmMiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9XYXNtTG9hZGVyLmpzIl0sIm5hbWVzIjpbIklOVDMyX1NJWkVfSU5fQllURVMiLCJTQ1JfV0lEVEgiLCJTQ1JfSEVJR0hUIiwiUEFHRV9TSVpFX0JZVEVTIiwidyIsImxvYWQiLCJ0aGVuIiwid2FzbSIsImMiLCJjcmVhdGVDYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJjYW52YXNEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwiSEVBUF9idWZmZXJfcHRyOCIsIl9tYWxsb2MiLCJ2aWV3IiwiVWludDhDbGFtcGVkQXJyYXkiLCJidWZmZXIiLCJfYWRkT25lIiwidGltZSIsInBlcmZvcm1hbmNlIiwibm93IiwidCIsImRhdGEiLCJzZXQiLCJwdXRJbWFnZURhdGEiLCJjb25zb2xlIiwibG9nIiwiaCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9keSIsImFwcGVuZENoaWxkIiwid2luZG93IiwiTW9kdWxlIiwiV2FzbUxvYWRlciIsIl93YXNtIiwiX2ltcG9ydHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZldGNoIiwicmVzcG9uc2UiLCJhcnJheUJ1ZmZlciIsIndhc21CaW5hcnkiLCJzY3JpcHQiLCJkb25lRXZlbnQiLCJFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7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QUFDQUssa0JBQU9hLFNBQVAsR0FBbUIsSUFBSUMsS0FBSixDQUFVLE1BQVYsQ0FBbkI7O0FBRUFkLGtCQUFPWSxNQUFQLENBQWNHLGdCQUFkLENBQStCLE1BQS9CLEVBQXVDLFlBQU07QUFDM0NULHFCQUFRTCxNQUFSO0FBQ0QsWUFGRDs7QUFJQUQsa0JBQU9ZLE1BQVAsQ0FBY0ksR0FBZCxHQUFvQixnQkFBcEI7QUFDQXRCLG9CQUFTSSxJQUFULENBQWNDLFdBQWQsQ0FBMEJDLE9BQU9ZLE1BQWpDO0FBRUQsVUFqQkQ7QUFtQkQsUUE1Qk0sQ0FBUDtBQThCRDs7Ozs7O21CQTFDa0JWLFUiLCJmaWxlIjoibWFpbi5idWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhZTlmOWJlMWM5MzE4OTExNGIyYyIsIlxuaW1wb3J0IFdhc21Mb2FkZXIgZnJvbSAnLi9XYXNtTG9hZGVyJztcblxuY29uc3QgSU5UMzJfU0laRV9JTl9CWVRFUyA9IDQ7XG5jb25zdCBTQ1JfV0lEVEggPSA2NDAsIFNDUl9IRUlHSFQgPSA0ODA7XG5jb25zdCBQQUdFX1NJWkVfQllURVMgPSBTQ1JfV0lEVEggKiBTQ1JfSEVJR0hUICogSU5UMzJfU0laRV9JTl9CWVRFUztcblxubGV0IHcgPSBuZXcgV2FzbUxvYWRlcigpO1xuXG53LmxvYWQoXCIuL3dhc20vdGVzdFwiKS50aGVuKCh3YXNtKSA9PiB7XG5cblxuICBsZXQgYyA9IGNyZWF0ZUNhbnZhcyhTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuICBsZXQgY3R4ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gIGN0eC5maWxsU3R5bGUgPSBcIiMwMDAwZmZcIjtcbiAgY3R4LmZpbGxSZWN0KDAsMCxTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuXG4gIGxldCBjYW52YXNEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuXG4gIC8vIGxldCB0ZXN0QXJyYXkgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoUEFHRV9TSVpFX0JZVEVTKTtcbiAgLy8gdGVzdEFycmF5LmZpbGwoMCk7XG4gIC8vIGNhbnZhc0RhdGEuZGF0YS5zZXQodGVzdEFycmF5KVxuXG4gIGxldCBIRUFQX2J1ZmZlcl9wdHI4ID0gd2FzbS5fbWFsbG9jKFBBR0VfU0laRV9CWVRFUyk7XG4gIC8vbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcod2FzbS5idWZmZXIsIEhFQVBfYnVmZmVyX3B0cjgsIFBBR0VfU0laRV9CWVRFUyk7XG4gIGxldCB2aWV3ID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdhc20uYnVmZmVyLCBIRUFQX2J1ZmZlcl9wdHI4LCBQQUdFX1NJWkVfQllURVMpO1xuXG4gIHdhc20uX2FkZE9uZSgxMjgsIEhFQVBfYnVmZmVyX3B0cjgsIFBBR0VfU0laRV9CWVRFUyk7XG5cbiAgbGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBmb3IgKGxldCB0PTA7IHQ8NjA7IHQrKylcbiAge1xuICAgIGNhbnZhc0RhdGEuZGF0YS5zZXQodmlldyk7XG4gICAgY3R4LnB1dEltYWdlRGF0YShjYW52YXNEYXRhLCAwLCAwKTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiNjAgdGltZSA9IFwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHRpbWUpO1xuXG5cbiAgLy8gQ3JlYXRlIGFycmF5IG9mIGZpdmUgaW50MzJzXG4gIC8vbGV0IG51bUludDMyID0gNTtcbiAgLy9sZXQgdGVzdEFycmF5ID0gbmV3IEludDMyQXJyYXkoWzEwLDExLDEyLDEzLDE0XSk7XG4gIC8vbGV0IGRvdWJsZUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KFBBR0VfU0laRV9CWVRFUyk7XG5cbiAgLy8gQWxsb2NhdGUgYnl0ZXMgb24gdGhlIFdBU00gaGVhcCAobWF4IDRHQikgYW5kIGdldCAqaW50IChhcyAzMi1iaXQgSlMgaW50KVxuICAvLyB3aGljaCBpcyBhIGJ5dGUtYWxpZ25lZCBvZmZzZXRcbiAgLy9sZXQgcHRyID0gd2FzbS5fbWFsbG9jKFBBR0VfU0laRV9CWVRFUyk7XG5cbiAgLy9sZXQgb2Zmc2V0MzIgPSBwdHIgLyBJTlQzMl9TSVpFX0lOX0JZVEVTO1xuICAvL2xldCBvZmZzZXQ4ID0gcHRyO1xuXG4gIC8vIENvcHkgZGF0YSBmcm9tIG91ciBBcnJheUJ1ZmZlciBvbnRvIHRoZSBoZWFwIHZpYSBhYm92ZSAqaW50XG4gIC8vIGRpdmlkZSA4LWJpdCBieXRlIG9mZnNldCBieSA0IHRvIGdldCAzMi1iaXQgb2Zmc2V0XG4gIC8vd2FzbS5IRUFQMzIuc2V0KHRlc3RBcnJheSwgb2Zmc2V0MzIpO1xuXG4gIC8vbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcod2FzbS5idWZmZXIsIHB0ciwgbnVtSW50MzIgKiBJTlQzMl9TSVpFX0lOX0JZVEVTKTtcblxuICAvL2NvbnNvbGUubG9nKHdhc20pO1xuXG4gIC8vIHdhc20uX2FkZE9uZShwdHIpO1xuXG4gIC8vIGxldCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgLy8gZm9yIChsZXQgdD0wOyB0PDYwOyB0KyspXG4gIC8vIHtcbiAgLy8gICB0ZXN0QXJyYXkuc2V0KHdhc20uSEVBUDMyLnN1YmFycmF5KG9mZnNldDMyLCBvZmZzZXQzMiArIG51bUludDMyKSk7XG4gIC8vIH1cblxuICAvLyBjb25zb2xlLmxvZyh3YXNtLl9tZW1jcHkpO1xuXG59KTtcblxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyh3LCBoKVxue1xuICBsZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjLndpZHRoID0gdywgYy5oZWlnaHQgPSBoO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGMpO1xuICByZXR1cm4gYztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCJcblxud2luZG93Lk1vZHVsZSA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXNtTG9hZGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuXG4gIH1cblxuICBsb2FkKHdhc20pXG4gIHtcbiAgICBsZXQgX3dhc20gPSB3YXNtICsgXCIud2FzbVwiO1xuICAgIGxldCBfaW1wb3J0cyA9IHdhc20gKyBcIi5qc1wiO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgLy8gV0FTTSBub3Qgc3VwcG9ydGVkLCBlbmRcbiAgICAgIGlmICghKCdXZWJBc3NlbWJseScgaW4gd2luZG93KSlcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2FkIFdBU00nKTtcbiAgICAgICAgcmV0dXJuIHJlamVjdChNb2R1bGUpO1xuICAgICAgfVxuXG4gICAgICBmZXRjaChfd2FzbSkudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihidWZmZXIgPT4ge1xuXG4gICAgICAgIE1vZHVsZS53YXNtQmluYXJ5ID0gYnVmZmVyO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgd2luZG93LmRvbmVFdmVudCA9IG5ldyBFdmVudCgnZG9uZScpO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZG9uZScsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKE1vZHVsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuc3JjID0gJy4vd2FzbS90ZXN0LmpzJztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3aW5kb3cuc2NyaXB0KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1dhc21Mb2FkZXIuanMiXSwic291cmNlUm9vdCI6IiJ9