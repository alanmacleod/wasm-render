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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWNjNDNjZGRiMGQxMzcyZGVhYjIiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9XYXNtTG9hZGVyLmpzIl0sIm5hbWVzIjpbIklOVDMyX1NJWkVfSU5fQllURVMiLCJTQ1JfV0lEVEgiLCJTQ1JfSEVJR0hUIiwiUEFHRV9TSVpFX0JZVEVTIiwidyIsImxvYWQiLCJ0aGVuIiwid2FzbSIsImMiLCJjcmVhdGVDYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJjYW52YXNEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwiSEVBUF9idWZmZXJfcHRyOCIsIl9tYWxsb2MiLCJ2aWV3IiwiVWludDhDbGFtcGVkQXJyYXkiLCJidWZmZXIiLCJ0aW1lIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0IiwiX2FkZE9uZSIsImRhdGEiLCJzZXQiLCJwdXRJbWFnZURhdGEiLCJjb25zb2xlIiwibG9nIiwiaCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9keSIsImFwcGVuZENoaWxkIiwid2luZG93IiwiTW9kdWxlIiwiV2FzbUxvYWRlciIsIl93YXNtIiwiX2ltcG9ydHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZldGNoIiwicmVzcG9uc2UiLCJhcnJheUJ1ZmZlciIsIndhc21CaW5hcnkiLCJzY3JpcHQiLCJkb25lRXZlbnQiLCJFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7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L0IsRUFBdUMsWUFBTTtBQUMzQ1QscUJBQVFMLE1BQVI7QUFDRCxZQUZEOztBQUlBRCxrQkFBT1ksTUFBUCxDQUFjSSxHQUFkLEdBQW9CLGdCQUFwQjtBQUNBdEIsb0JBQVNJLElBQVQsQ0FBY0MsV0FBZCxDQUEwQkMsT0FBT1ksTUFBakM7QUFFRCxVQWpCRDtBQW1CRCxRQTVCTSxDQUFQO0FBOEJEOzs7Ozs7bUJBMUNrQlYsVSIsImZpbGUiOiJtYWluLmJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDljYzQzY2RkYjBkMTM3MmRlYWIyIiwiXG5pbXBvcnQgV2FzbUxvYWRlciBmcm9tICcuL1dhc21Mb2FkZXInO1xuXG5jb25zdCBJTlQzMl9TSVpFX0lOX0JZVEVTID0gNDtcbmNvbnN0IFNDUl9XSURUSCA9IDY0MCwgU0NSX0hFSUdIVCA9IDQ4MDtcbmNvbnN0IFBBR0VfU0laRV9CWVRFUyA9IFNDUl9XSURUSCAqIFNDUl9IRUlHSFQgKiBJTlQzMl9TSVpFX0lOX0JZVEVTO1xuXG5sZXQgdyA9IG5ldyBXYXNtTG9hZGVyKCk7XG5cbncubG9hZChcIi4vd2FzbS90ZXN0XCIpLnRoZW4oKHdhc20pID0+IHtcblxuICAvLyBTZXR1cCBDYW52YXMgYW5kIGluaXRpYWxpc2UgdG8gZmlsbCBibHVlXG4gIGxldCBjID0gY3JlYXRlQ2FudmFzKFNDUl9XSURUSCwgU0NSX0hFSUdIVCk7XG4gIGxldCBjdHggPSBjLmdldENvbnRleHQoJzJkJyk7XG4gIGN0eC5maWxsU3R5bGUgPSBcIiMwMDAwZmZcIjtcbiAgY3R4LmZpbGxSZWN0KDAsMCxTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuXG4gIC8vIEdldCBhIHJlZmVyZW5jZSB0byB0aGUgaW1hZ2UgZGF0YSBieXRlcyBgY2FudmFzRGF0YS5kYXRhYFxuICBsZXQgY2FudmFzRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgU0NSX1dJRFRILCBTQ1JfSEVJR0hUKTtcblxuICAvLyBBbGxvY2F0ZSBhIGJ1ZmZlciBvbiB0aGUgaGVhcCBmb3Igb3VyIFdBU00gY29kZSB0byB3cml0ZSBpbnRvXG4gIGxldCBIRUFQX2J1ZmZlcl9wdHI4ID0gd2FzbS5fbWFsbG9jKFBBR0VfU0laRV9CWVRFUyk7XG5cbiAgLy8gTm93IGNyZWF0ZSBhIHJldmVyc2UtcmVmZXJlbmNlIHRvIHRoZSBXQVNNIGhlYXAgYXMgYSBKUyBUeXBlZEFycmF5XG4gIC8vIFdoaWNoIHdlIGNhbiBtYW5pcHVsYXRlIGVhc2lseSBKUy1zaWRlLCBlLmcuIGNvcHkgaW50byB0aGUgQ2FudmFzXG4gIGxldCB2aWV3ID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdhc20uYnVmZmVyLCBIRUFQX2J1ZmZlcl9wdHI4LCBQQUdFX1NJWkVfQllURVMpO1xuXG5cbiAgbGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBmb3IgKGxldCB0PTA7IHQ8NjA7IHQrKylcbiAge1xuICAgIC8vIENhbGwgdGhlIFdBU00vQyBjb2RlIVxuICAgIHdhc20uX2FkZE9uZSgxMjgsIEhFQVBfYnVmZmVyX3B0cjgsIFBBR0VfU0laRV9CWVRFUyk7XG5cbiAgICAvLyBXcml0ZSBpdCdzIG91dHB1dCBpbnRvIG91ciBDYW52YXMgYnVmZmVyXG4gICAgY2FudmFzRGF0YS5kYXRhLnNldCh2aWV3KTtcblxuICAgIC8vIERpc3BsYXkgb24gc2NyZWVuIVxuICAgIGN0eC5wdXRJbWFnZURhdGEoY2FudmFzRGF0YSwgMCwgMCk7XG4gIH1cblxuICBjb25zb2xlLmxvZyhcIjYwIGZwcyB0aW1lID0gXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gdGltZSk7XG5cblxufSk7XG5cblxuXG5mdW5jdGlvbiBjcmVhdGVDYW52YXModywgaClcbntcbiAgbGV0IGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgYy53aWR0aCA9IHcsIGMuaGVpZ2h0ID0gaDtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjKTtcbiAgcmV0dXJuIGM7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluLmpzIiwiXG5cbndpbmRvdy5Nb2R1bGUgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FzbUxvYWRlclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcblxuICB9XG5cbiAgbG9hZCh3YXNtKVxuICB7XG4gICAgbGV0IF93YXNtID0gd2FzbSArIFwiLndhc21cIjtcbiAgICBsZXQgX2ltcG9ydHMgPSB3YXNtICsgXCIuanNcIjtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIC8vIFdBU00gbm90IHN1cHBvcnRlZCwgZW5kXG4gICAgICBpZiAoISgnV2ViQXNzZW1ibHknIGluIHdpbmRvdykpXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9hZCBXQVNNJyk7XG4gICAgICAgIHJldHVybiByZWplY3QoTW9kdWxlKTtcbiAgICAgIH1cblxuICAgICAgZmV0Y2goX3dhc20pLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oYnVmZmVyID0+IHtcblxuICAgICAgICBNb2R1bGUud2FzbUJpbmFyeSA9IGJ1ZmZlcjtcblxuICAgICAgICB3aW5kb3cuc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHdpbmRvdy5kb25lRXZlbnQgPSBuZXcgRXZlbnQoJ2RvbmUnKTtcblxuICAgICAgICB3aW5kb3cuc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2RvbmUnLCAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShNb2R1bGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3aW5kb3cuc2NyaXB0LnNyYyA9ICcuL3dhc20vdGVzdC5qcyc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod2luZG93LnNjcmlwdCk7XG5cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9XYXNtTG9hZGVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==