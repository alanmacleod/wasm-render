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
	
	var _statsMin = __webpack_require__(2);
	
	var _statsMin2 = _interopRequireDefault(_statsMin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INT32_SIZE_IN_BYTES = 4;
	var SCR_WIDTH = 640,
	    SCR_HEIGHT = 480;
	var PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;
	
	var w = new _WasmLoader2.default();
	
	var stats = new _statsMin2.default();
	stats.showPanel(1);
	document.body.appendChild(stats.dom);
	
	// console.log(stats.dom);
	stats.dom.style.position = "absolute";
	stats.dom.style.top = "5px";
	stats.dom.style.right = "5px";
	stats.dom.style.left = "";
	
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
	
	  // let time = performance.now();
	  //
	  // for (let t=0; t<60; t++)
	  // {
	  //
	  // }
	  //
	  // console.log("60 fps time = ", performance.now() - time);
	  requestAnimationFrame(render);
	  //render();
	
	
	  function render() {
	    stats.begin();
	
	    var numFrames = 30 + Math.random() * 60;
	
	    for (var t = 0; t < numFrames; t++) {
	      // Call the WASM/C code! Telling it where the heap data is
	      wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
	
	      // Write it's output into our Canvas buffer
	      canvasData.data.set(view);
	
	      // Display on screen!
	      ctx.putImageData(canvasData, 0, 0);
	    }
	
	    stats.end();
	
	    requestAnimationFrame(render);
	  }
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// stats.js - http://github.com/mrdoob/stats.js
	(function (f, e) {
	  "object" === ( false ? "undefined" : _typeof(exports)) && "undefined" !== typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : f.Stats = e();
	})(undefined, function () {
	  var f = function f() {
	    function e(a) {
	      c.appendChild(a.dom);return a;
	    }function u(a) {
	      for (var d = 0; d < c.children.length; d++) {
	        c.children[d].style.display = d === a ? "block" : "none";
	      }l = a;
	    }var l = 0,
	        c = document.createElement("div");c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click", function (a) {
	      a.preventDefault();
	      u(++l % c.children.length);
	    }, !1);var k = (performance || Date).now(),
	        g = k,
	        a = 0,
	        r = e(new f.Panel("FPS", "#0ff", "#002")),
	        h = e(new f.Panel("MS", "#0f0", "#020"));if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201"));u(0);return { REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function begin() {
	        k = (performance || Date).now();
	      }, end: function end() {
	        a++;var c = (performance || Date).now();h.update(c - k, 200);if (c > g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {
	          var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
	        }return c;
	      }, update: function update() {
	        k = this.end();
	      }, domElement: c, setMode: u };
	  };f.Panel = function (e, f, l) {
	    var c = Infinity,
	        k = 0,
	        g = Math.round,
	        a = g(window.devicePixelRatio || 1),
	        r = 80 * a,
	        h = 48 * a,
	        t = 3 * a,
	        v = 2 * a,
	        d = 3 * a,
	        m = 15 * a,
	        n = 74 * a,
	        p = 30 * a,
	        q = document.createElement("canvas");q.width = r;q.height = h;q.style.cssText = "width:80px;height:48px";var b = q.getContext("2d");b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";b.textBaseline = "top";b.fillStyle = l;b.fillRect(0, 0, r, h);b.fillStyle = f;b.fillText(e, t, v);
	    b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function update(h, w) {
	        c = Math.min(c, h);k = Math.max(k, h);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = f;b.fillText(g(h) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, g((1 - h / w) * p));
	      } };
	  };return f;
	});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTVmZWM4ZTdlMzczODNiZGE0MmUiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9XYXNtTG9hZGVyLmpzIiwid2VicGFjazovLy8uLi9saWIvc3RhdHMubWluLmpzIl0sIm5hbWVzIjpbIklOVDMyX1NJWkVfSU5fQllURVMiLCJTQ1JfV0lEVEgiLCJTQ1JfSEVJR0hUIiwiUEFHRV9TSVpFX0JZVEVTIiwidyIsInN0YXRzIiwic2hvd1BhbmVsIiwiZG9jdW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJkb20iLCJzdHlsZSIsInBvc2l0aW9uIiwidG9wIiwicmlnaHQiLCJsZWZ0IiwibG9hZCIsInRoZW4iLCJ3YXNtIiwiYyIsImNyZWF0ZUNhbnZhcyIsImN0eCIsImdldENvbnRleHQiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsImNhbnZhc0RhdGEiLCJnZXRJbWFnZURhdGEiLCJIRUFQX2J1ZmZlcl9wdHI4IiwiX21hbGxvYyIsInZpZXciLCJVaW50OENsYW1wZWRBcnJheSIsImJ1ZmZlciIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJlbmRlciIsImJlZ2luIiwibnVtRnJhbWVzIiwiTWF0aCIsInJhbmRvbSIsInQiLCJfYWRkT25lIiwiZGF0YSIsInNldCIsInB1dEltYWdlRGF0YSIsImVuZCIsImgiLCJjcmVhdGVFbGVtZW50Iiwid2lkdGgiLCJoZWlnaHQiLCJ3aW5kb3ciLCJNb2R1bGUiLCJXYXNtTG9hZGVyIiwiX3dhc20iLCJfaW1wb3J0cyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29uc29sZSIsImxvZyIsImZldGNoIiwicmVzcG9uc2UiLCJhcnJheUJ1ZmZlciIsIndhc21CaW5hcnkiLCJzY3JpcHQiLCJkb25lRXZlbnQiLCJFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJmIiwiZSIsImV4cG9ydHMiLCJtb2R1bGUiLCJTdGF0cyIsImEiLCJ1IiwiZCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiZGlzcGxheSIsImwiLCJjc3NUZXh0IiwicHJldmVudERlZmF1bHQiLCJrIiwicGVyZm9ybWFuY2UiLCJEYXRlIiwibm93IiwiZyIsInIiLCJQYW5lbCIsInNlbGYiLCJtZW1vcnkiLCJSRVZJU0lPTiIsImFkZFBhbmVsIiwidXBkYXRlIiwidXNlZEpTSGVhcFNpemUiLCJqc0hlYXBTaXplTGltaXQiLCJkb21FbGVtZW50Iiwic2V0TW9kZSIsIkluZmluaXR5Iiwicm91bmQiLCJkZXZpY2VQaXhlbFJhdGlvIiwidiIsIm0iLCJuIiwicCIsInEiLCJiIiwiZm9udCIsInRleHRCYXNlbGluZSIsImZpbGxUZXh0IiwiZ2xvYmFsQWxwaGEiLCJtaW4iLCJtYXgiLCJkcmF3SW1hZ2UiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsS0FBTUEsc0JBQXNCLENBQTVCO0FBQ0EsS0FBTUMsWUFBWSxHQUFsQjtBQUFBLEtBQXVCQyxhQUFhLEdBQXBDO0FBQ0EsS0FBTUMsa0JBQWtCRixZQUFZQyxVQUFaLEdBQXlCRixtQkFBakQ7O0FBRUEsS0FBSUksSUFBSSwwQkFBUjs7QUFFQSxLQUFJQyxRQUFRLHdCQUFaO0FBQ0FBLE9BQU1DLFNBQU4sQ0FBaUIsQ0FBakI7QUFDQUMsVUFBU0MsSUFBVCxDQUFjQyxXQUFkLENBQTJCSixNQUFNSyxHQUFqQzs7QUFFQTtBQUNBTCxPQUFNSyxHQUFOLENBQVVDLEtBQVYsQ0FBZ0JDLFFBQWhCLEdBQTJCLFVBQTNCO0FBQ0FQLE9BQU1LLEdBQU4sQ0FBVUMsS0FBVixDQUFnQkUsR0FBaEIsR0FBc0IsS0FBdEI7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RWpGLFFBQUYsQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlOEQsQ0FBZixFQUFpQmUsQ0FBakIsRUFBb0JJLEVBQUVsRixTQUFGLEdBQVk0QyxDQUFaLENBQWNzQyxFQUFFRyxRQUFGLENBQVd2QixFQUFFekMsQ0FBRixJQUFLLEdBQUwsR0FBU3dCLENBQVQsR0FBVyxJQUFYLEdBQWdCaUIsRUFBRWxFLENBQUYsQ0FBaEIsR0FBcUIsR0FBckIsR0FBeUJrRSxFQUFFSixDQUFGLENBQXpCLEdBQThCLEdBQXpDLEVBQTZDM0MsQ0FBN0MsRUFBK0M4RCxDQUEvQyxFQUFrREssRUFBRU8sU0FBRixDQUFZUixDQUFaLEVBQWM5QixJQUFFRixDQUFoQixFQUFrQjZCLENBQWxCLEVBQW9CQyxJQUFFOUIsQ0FBdEIsRUFBd0IrQixDQUF4QixFQUEwQjdCLENBQTFCLEVBQTRCMkIsQ0FBNUIsRUFBOEJDLElBQUU5QixDQUFoQyxFQUFrQytCLENBQWxDLEVBQXFDRSxFQUFFakYsUUFBRixDQUFXa0QsSUFBRTRCLENBQUYsR0FBSTlCLENBQWYsRUFBaUI2QixDQUFqQixFQUFtQjdCLENBQW5CLEVBQXFCK0IsQ0FBckIsRUFBd0JFLEVBQUVsRixTQUFGLEdBQVl1RCxDQUFaLENBQWMyQixFQUFFSSxXQUFGLEdBQWMsRUFBZCxDQUFpQkosRUFBRWpGLFFBQUYsQ0FBV2tELElBQUU0QixDQUFGLEdBQUk5QixDQUFmLEVBQWlCNkIsQ0FBakIsRUFBbUI3QixDQUFuQixFQUFxQmEsRUFBRSxDQUFDLElBQUV6QyxJQUFFeEMsQ0FBTCxJQUFRbUcsQ0FBVixDQUFyQjtBQUFtQyxRQUE3UyxFQUFOO0FBQXFULElBRHRSLENBQ3VSLE9BQU9wQyxDQUFQO0FBQVMsRUFIdFksRSIsImZpbGUiOiJtYWluLmJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGE1ZmVjOGU3ZTM3MzgzYmRhNDJlIiwiXG5pbXBvcnQgV2FzbUxvYWRlciBmcm9tICcuL1dhc21Mb2FkZXInO1xuaW1wb3J0IFN0YXRzICAgICAgZnJvbSAnLi4vbGliL3N0YXRzLm1pbi5qcyc7XG5cbmNvbnN0IElOVDMyX1NJWkVfSU5fQllURVMgPSA0O1xuY29uc3QgU0NSX1dJRFRIID0gNjQwLCBTQ1JfSEVJR0hUID0gNDgwO1xuY29uc3QgUEFHRV9TSVpFX0JZVEVTID0gU0NSX1dJRFRIICogU0NSX0hFSUdIVCAqIElOVDMyX1NJWkVfSU5fQllURVM7XG5cbmxldCB3ID0gbmV3IFdhc21Mb2FkZXIoKTtcblxudmFyIHN0YXRzID0gbmV3IFN0YXRzKCk7XG5zdGF0cy5zaG93UGFuZWwoIDEgKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbSApO1xuXG4vLyBjb25zb2xlLmxvZyhzdGF0cy5kb20pO1xuc3RhdHMuZG9tLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuc3RhdHMuZG9tLnN0eWxlLnRvcCA9IFwiNXB4XCI7XG5zdGF0cy5kb20uc3R5bGUucmlnaHQgPSBcIjVweFwiO1xuc3RhdHMuZG9tLnN0eWxlLmxlZnQgPSBcIlwiO1xuXG5cblxudy5sb2FkKFwiLi93YXNtL3Rlc3RcIikudGhlbigod2FzbSkgPT4ge1xuXG4gIC8vIFNldHVwIENhbnZhcyBhbmQgaW5pdGlhbGlzZSB0byBmaWxsIGJsdWVcbiAgbGV0IGMgPSBjcmVhdGVDYW52YXMoU0NSX1dJRFRILCBTQ1JfSEVJR0hUKTtcbiAgbGV0IGN0eCA9IGMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgY3R4LmZpbGxTdHlsZSA9IFwiIzAwMDBmZlwiO1xuICBjdHguZmlsbFJlY3QoMCwwLFNDUl9XSURUSCwgU0NSX0hFSUdIVCk7XG5cbiAgLy8gR2V0IGEgcmVmZXJlbmNlIHRvIHRoZSBpbWFnZSBkYXRhIGJ5dGVzIGBjYW52YXNEYXRhLmRhdGFgXG4gIGxldCBjYW52YXNEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBTQ1JfV0lEVEgsIFNDUl9IRUlHSFQpO1xuXG4gIC8vIEFsbG9jYXRlIGEgYnVmZmVyIG9uIHRoZSBoZWFwIGZvciBvdXIgV0FTTSBjb2RlIHRvIHdyaXRlIGludG9cbiAgbGV0IEhFQVBfYnVmZmVyX3B0cjggPSB3YXNtLl9tYWxsb2MoUEFHRV9TSVpFX0JZVEVTKTtcblxuICAvLyBOb3cgY3JlYXRlIGEgcmV2ZXJzZS1yZWZlcmVuY2UgdG8gdGhlIFdBU00gaGVhcCBhcyBhIEpTIFR5cGVkQXJyYXlcbiAgLy8gV2hpY2ggd2UgY2FuIG1hbmlwdWxhdGUgZWFzaWx5IEpTLXNpZGUsIGUuZy4gY29weSBpbnRvIHRoZSBDYW52YXNcbiAgbGV0IHZpZXcgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkod2FzbS5idWZmZXIsIEhFQVBfYnVmZmVyX3B0cjgsIFBBR0VfU0laRV9CWVRFUyk7XG5cblxuICAvLyBsZXQgdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAvL1xuICAvLyBmb3IgKGxldCB0PTA7IHQ8NjA7IHQrKylcbiAgLy8ge1xuICAvL1xuICAvLyB9XG4gIC8vXG4gIC8vIGNvbnNvbGUubG9nKFwiNjAgZnBzIHRpbWUgPSBcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSB0aW1lKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gIC8vcmVuZGVyKCk7XG5cblxuICBmdW5jdGlvbiByZW5kZXIoKVxuICB7XG4gICAgc3RhdHMuYmVnaW4oKTtcblxuICAgIGxldCBudW1GcmFtZXMgPSAzMCArIE1hdGgucmFuZG9tKCkgKiA2MDtcblxuICAgIGZvciAobGV0IHQ9MDsgdDxudW1GcmFtZXM7IHQrKylcbiAgICB7XG4gICAgICAvLyBDYWxsIHRoZSBXQVNNL0MgY29kZSEgVGVsbGluZyBpdCB3aGVyZSB0aGUgaGVhcCBkYXRhIGlzXG4gICAgICB3YXNtLl9hZGRPbmUoMTI4LCBIRUFQX2J1ZmZlcl9wdHI4LCBQQUdFX1NJWkVfQllURVMpO1xuXG4gICAgICAvLyBXcml0ZSBpdCdzIG91dHB1dCBpbnRvIG91ciBDYW52YXMgYnVmZmVyXG4gICAgICBjYW52YXNEYXRhLmRhdGEuc2V0KHZpZXcpO1xuXG4gICAgICAvLyBEaXNwbGF5IG9uIHNjcmVlbiFcbiAgICAgIGN0eC5wdXRJbWFnZURhdGEoY2FudmFzRGF0YSwgMCwgMCk7XG4gICAgfVxuXG4gICAgc3RhdHMuZW5kKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgfVxuXG59KTtcblxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyh3LCBoKVxue1xuICBsZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjLndpZHRoID0gdywgYy5oZWlnaHQgPSBoO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGMpO1xuICByZXR1cm4gYztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCJcblxud2luZG93Lk1vZHVsZSA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXNtTG9hZGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuXG4gIH1cblxuICBsb2FkKHdhc20pXG4gIHtcbiAgICBsZXQgX3dhc20gPSB3YXNtICsgXCIud2FzbVwiO1xuICAgIGxldCBfaW1wb3J0cyA9IHdhc20gKyBcIi5qc1wiO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgLy8gV0FTTSBub3Qgc3VwcG9ydGVkLCBlbmRcbiAgICAgIGlmICghKCdXZWJBc3NlbWJseScgaW4gd2luZG93KSlcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2FkIFdBU00nKTtcbiAgICAgICAgcmV0dXJuIHJlamVjdChNb2R1bGUpO1xuICAgICAgfVxuXG4gICAgICBmZXRjaChfd2FzbSkudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihidWZmZXIgPT4ge1xuXG4gICAgICAgIE1vZHVsZS53YXNtQmluYXJ5ID0gYnVmZmVyO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgd2luZG93LmRvbmVFdmVudCA9IG5ldyBFdmVudCgnZG9uZScpO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZG9uZScsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKE1vZHVsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuc3JjID0gJy4vd2FzbS90ZXN0LmpzJztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3aW5kb3cuc2NyaXB0KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1dhc21Mb2FkZXIuanMiLCIvLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xuKGZ1bmN0aW9uKGYsZSl7XCJvYmplY3RcIj09PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6Zi5TdGF0cz1lKCl9KSh0aGlzLGZ1bmN0aW9uKCl7dmFyIGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGEpe2MuYXBwZW5kQ2hpbGQoYS5kb20pO3JldHVybiBhfWZ1bmN0aW9uIHUoYSl7Zm9yKHZhciBkPTA7ZDxjLmNoaWxkcmVuLmxlbmd0aDtkKyspYy5jaGlsZHJlbltkXS5zdHlsZS5kaXNwbGF5PWQ9PT1hP1wiYmxvY2tcIjpcIm5vbmVcIjtsPWF9dmFyIGw9MCxjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO2N1cnNvcjpwb2ludGVyO29wYWNpdHk6MC45O3otaW5kZXg6MTAwMDBcIjtjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKTtcbnUoKytsJWMuY2hpbGRyZW4ubGVuZ3RoKX0sITEpO3ZhciBrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCksZz1rLGE9MCxyPWUobmV3IGYuUGFuZWwoXCJGUFNcIixcIiMwZmZcIixcIiMwMDJcIikpLGg9ZShuZXcgZi5QYW5lbChcIk1TXCIsXCIjMGYwXCIsXCIjMDIwXCIpKTtpZihzZWxmLnBlcmZvcm1hbmNlJiZzZWxmLnBlcmZvcm1hbmNlLm1lbW9yeSl2YXIgdD1lKG5ldyBmLlBhbmVsKFwiTUJcIixcIiNmMDhcIixcIiMyMDFcIikpO3UoMCk7cmV0dXJue1JFVklTSU9OOjE2LGRvbTpjLGFkZFBhbmVsOmUsc2hvd1BhbmVsOnUsYmVnaW46ZnVuY3Rpb24oKXtrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCl9LGVuZDpmdW5jdGlvbigpe2ErKzt2YXIgYz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpO2gudXBkYXRlKGMtaywyMDApO2lmKGM+ZysxRTMmJihyLnVwZGF0ZSgxRTMqYS8oYy1nKSwxMDApLGc9YyxhPTAsdCkpe3ZhciBkPXBlcmZvcm1hbmNlLm1lbW9yeTt0LnVwZGF0ZShkLnVzZWRKU0hlYXBTaXplL1xuMTA0ODU3NixkLmpzSGVhcFNpemVMaW1pdC8xMDQ4NTc2KX1yZXR1cm4gY30sdXBkYXRlOmZ1bmN0aW9uKCl7az10aGlzLmVuZCgpfSxkb21FbGVtZW50OmMsc2V0TW9kZTp1fX07Zi5QYW5lbD1mdW5jdGlvbihlLGYsbCl7dmFyIGM9SW5maW5pdHksaz0wLGc9TWF0aC5yb3VuZCxhPWcod2luZG93LmRldmljZVBpeGVsUmF0aW98fDEpLHI9ODAqYSxoPTQ4KmEsdD0zKmEsdj0yKmEsZD0zKmEsbT0xNSphLG49NzQqYSxwPTMwKmEscT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Eud2lkdGg9cjtxLmhlaWdodD1oO3Euc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7aGVpZ2h0OjQ4cHhcIjt2YXIgYj1xLmdldENvbnRleHQoXCIyZFwiKTtiLmZvbnQ9XCJib2xkIFwiKzkqYStcInB4IEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmXCI7Yi50ZXh0QmFzZWxpbmU9XCJ0b3BcIjtiLmZpbGxTdHlsZT1sO2IuZmlsbFJlY3QoMCwwLHIsaCk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGUsdCx2KTtcbmIuZmlsbFJlY3QoZCxtLG4scCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCxtLG4scCk7cmV0dXJue2RvbTpxLHVwZGF0ZTpmdW5jdGlvbihoLHcpe2M9TWF0aC5taW4oYyxoKTtrPU1hdGgubWF4KGssaCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPTE7Yi5maWxsUmVjdCgwLDAscixtKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZyhoKStcIiBcIitlK1wiIChcIitnKGMpK1wiLVwiK2coaykrXCIpXCIsdCx2KTtiLmRyYXdJbWFnZShxLGQrYSxtLG4tYSxwLGQsbSxuLWEscCk7Yi5maWxsUmVjdChkK24tYSxtLGEscCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCtuLWEsbSxhLGcoKDEtaC93KSpwKSl9fX07cmV0dXJuIGZ9KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9saWIvc3RhdHMubWluLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==