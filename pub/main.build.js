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
	
	var SCR_WIDTH = 640,
	    SCR_HEIGHT = 480;
	var PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;
	
	var w = new _WasmLoader2.default();
	
	w.load("./wasm/test").then(function (wasm) {
	
	  // Setup Canvas and initialise to fill blue
	  var c = createCanvas(SCR_WIDTH, SCR_HEIGHT);
	  var ctx = c.getContext('2d');
	  ctx.fillStyle = "#0000ff";
	  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
	  // Get a reference to the image data bytes `canvasData.data`
	  var canvasData = ctx.getImageData(0, 0, SCR_WIDTH, SCR_HEIGHT);
	
	  // Allocate a buffer on the heap for our WASM code to write into
	  var HEAP_buffer_ptr8 = wasm._malloc(PAGE_SIZE_BYTES);
	
	  // Now create a reverse-reference to the WASM heap as a JS TypedArray
	  // Which we can manipulate easily JS-side, e.g. copy into the Canvas
	  var view = new Uint8ClampedArray(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
	
	  var time = performance.now();
	
	  for (var t = 0; t < 60; t++) {
	    // Call the WASM/C code!
	    wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
	
	    // Write it's output into our Canvas buffer
	    canvasData.data.set(view);
	
	    // Display on screen!
	    ctx.putImageData(canvasData, 0, 0);
	  }
	
	  console.log("60 fps time = ", performance.now() - time);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTdjYWFhMjJmNTcwOWFhMDVmZmYiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9XYXNtTG9hZGVyLmpzIl0sIm5hbWVzIjpbIlNDUl9XSURUSCIsIlNDUl9IRUlHSFQiLCJQQUdFX1NJWkVfQllURVMiLCJJTlQzMl9TSVpFX0lOX0JZVEVTIiwidyIsImxvYWQiLCJ0aGVuIiwid2FzbSIsImMiLCJjcmVhdGVDYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJjYW52YXNEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwiSEVBUF9idWZmZXJfcHRyOCIsIl9tYWxsb2MiLCJ2aWV3IiwiVWludDhDbGFtcGVkQXJyYXkiLCJidWZmZXIiLCJ0aW1lIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0IiwiX2FkZE9uZSIsImRhdGEiLCJzZXQiLCJwdXRJbWFnZURhdGEiLCJjb25zb2xlIiwibG9nIiwiaCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9keSIsImFwcGVuZENoaWxkIiwid2luZG93IiwiTW9kdWxlIiwiV2FzbUxvYWRlciIsIl93YXNtIiwiX2ltcG9ydHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZldGNoIiwicmVzcG9uc2UiLCJhcnJheUJ1ZmZlciIsIndhc21CaW5hcnkiLCJzY3JpcHQiLCJkb25lRXZlbnQiLCJFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7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QVFMLE1BQVI7QUFDRCxZQUZEOztBQUlBRCxrQkFBT1ksTUFBUCxDQUFjSSxHQUFkLEdBQW9CLGdCQUFwQjtBQUNBdEIsb0JBQVNJLElBQVQsQ0FBY0MsV0FBZCxDQUEwQkMsT0FBT1ksTUFBakM7QUFFRCxVQWpCRDtBQW1CRCxRQTVCTSxDQUFQO0FBOEJEOzs7Ozs7bUJBMUNrQlYsVSIsImZpbGUiOiJtYWluLmJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE3Y2FhYTIyZjU3MDlhYTA1ZmZmIiwiXG5pbXBvcnQgV2FzbUxvYWRlciBmcm9tICcuL1dhc21Mb2FkZXInO1xuXG5jb25zdCBTQ1JfV0lEVEggPSA2NDAsIFNDUl9IRUlHSFQgPSA0ODA7XG5jb25zdCBQQUdFX1NJWkVfQllURVMgPSBTQ1JfV0lEVEggKiBTQ1JfSEVJR0hUICogSU5UMzJfU0laRV9JTl9CWVRFUztcblxubGV0IHcgPSBuZXcgV2FzbUxvYWRlcigpO1xuXG53LmxvYWQoXCIuL3dhc20vdGVzdFwiKS50aGVuKCh3YXNtKSA9PiB7XG5cbiAgLy8gU2V0dXAgQ2FudmFzIGFuZCBpbml0aWFsaXNlIHRvIGZpbGwgYmx1ZVxuICBsZXQgYyA9IGNyZWF0ZUNhbnZhcyhTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuICBsZXQgY3R4ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xuICBjdHguZmlsbFN0eWxlID0gXCIjMDAwMGZmXCI7XG4gIGN0eC5maWxsUmVjdCgwLDAsU0NSX1dJRFRILCBTQ1JfSEVJR0hUKTtcbiAgLy8gR2V0IGEgcmVmZXJlbmNlIHRvIHRoZSBpbWFnZSBkYXRhIGJ5dGVzIGBjYW52YXNEYXRhLmRhdGFgXG4gIGxldCBjYW52YXNEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuXG4gIC8vIEFsbG9jYXRlIGEgYnVmZmVyIG9uIHRoZSBoZWFwIGZvciBvdXIgV0FTTSBjb2RlIHRvIHdyaXRlIGludG9cbiAgbGV0IEhFQVBfYnVmZmVyX3B0cjggPSB3YXNtLl9tYWxsb2MoUEFHRV9TSVpFX0JZVEVTKTtcblxuICAvLyBOb3cgY3JlYXRlIGEgcmV2ZXJzZS1yZWZlcmVuY2UgdG8gdGhlIFdBU00gaGVhcCBhcyBhIEpTIFR5cGVkQXJyYXlcbiAgLy8gV2hpY2ggd2UgY2FuIG1hbmlwdWxhdGUgZWFzaWx5IEpTLXNpZGUsIGUuZy4gY29weSBpbnRvIHRoZSBDYW52YXNcbiAgbGV0IHZpZXcgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkod2FzbS5idWZmZXIsIEhFQVBfYnVmZmVyX3B0cjgsIFBBR0VfU0laRV9CWVRFUyk7XG5cblxuICBsZXQgdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGZvciAobGV0IHQ9MDsgdDw2MDsgdCsrKVxuICB7XG4gICAgLy8gQ2FsbCB0aGUgV0FTTS9DIGNvZGUhXG4gICAgd2FzbS5fYWRkT25lKDEyOCwgSEVBUF9idWZmZXJfcHRyOCwgUEFHRV9TSVpFX0JZVEVTKTtcblxuICAgIC8vIFdyaXRlIGl0J3Mgb3V0cHV0IGludG8gb3VyIENhbnZhcyBidWZmZXJcbiAgICBjYW52YXNEYXRhLmRhdGEuc2V0KHZpZXcpO1xuXG4gICAgLy8gRGlzcGxheSBvbiBzY3JlZW4hXG4gICAgY3R4LnB1dEltYWdlRGF0YShjYW52YXNEYXRhLCAwLCAwKTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiNjAgZnBzIHRpbWUgPSBcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSB0aW1lKTtcblxuXG59KTtcblxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyh3LCBoKVxue1xuICBsZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjLndpZHRoID0gdywgYy5oZWlnaHQgPSBoO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGMpO1xuICByZXR1cm4gYztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCJcblxud2luZG93Lk1vZHVsZSA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXNtTG9hZGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuXG4gIH1cblxuICBsb2FkKHdhc20pXG4gIHtcbiAgICBsZXQgX3dhc20gPSB3YXNtICsgXCIud2FzbVwiO1xuICAgIGxldCBfaW1wb3J0cyA9IHdhc20gKyBcIi5qc1wiO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgLy8gV0FTTSBub3Qgc3VwcG9ydGVkLCBlbmRcbiAgICAgIGlmICghKCdXZWJBc3NlbWJseScgaW4gd2luZG93KSlcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2FkIFdBU00nKTtcbiAgICAgICAgcmV0dXJuIHJlamVjdChNb2R1bGUpO1xuICAgICAgfVxuXG4gICAgICBmZXRjaChfd2FzbSkudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihidWZmZXIgPT4ge1xuXG4gICAgICAgIE1vZHVsZS53YXNtQmluYXJ5ID0gYnVmZmVyO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgd2luZG93LmRvbmVFdmVudCA9IG5ldyBFdmVudCgnZG9uZScpO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZG9uZScsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKE1vZHVsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuc3JjID0gJy4vd2FzbS90ZXN0LmpzJztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3aW5kb3cuc2NyaXB0KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1dhc21Mb2FkZXIuanMiXSwic291cmNlUm9vdCI6IiJ9