/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Device.ts
// Just abstracts the canvas crap
// Accepts a Uint8 buffer for rendering
// 32-bit colour RGBA
const PIXEL_SIZE_BYTES = 4;
class Device {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        let bytes = width * height * PIXEL_SIZE_BYTES;
    }
    insert(element) {
        let e = !(element) ? document.body :
            document.getElementById(element);
        let c = document.createElement('canvas');
        c.width = this.width;
        c.height = this.height;
        this.canvas = c;
        this.context = this.canvas.getContext('2d');
        // the actual pixel data
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        e.appendChild(c);
    }
    clear(colour = "0xffffff") {
        this.context.fillStyle = colour;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    // Old school points for anyone who cracks a smile at the 'flip' verb
    flip(buffer) {
        if (!buffer)
            throw new ReferenceError("`buffer: Uint8ClampedArray` is required!");
        this.imageData.data.set(buffer);
        this.context.putImageData(this.imageData, 0, 0);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Device;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__);

class StatsGraph {
    constructor() {
        this.stats = __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__();
        document.body.appendChild(this.stats.dom);
        this.stats.showPanel(1);
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.top = "5px";
        this.stats.dom.style.right = "5px";
        this.stats.dom.style.left = "";
    }
    begin() {
        this.stats.begin();
    }
    end() {
        this.stats.end();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StatsGraph;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
window.Module = {};
class WasmLoader {
    constructor() {
    }
    load(wasm) {
        let _wasm = wasm + ".wasm";
        let _imports = wasm + ".js";
        return new Promise((resolve, reject) => {
            // WASM not supported, end
            if (!('WebAssembly' in window)) {
                console.log('Could not load WASM');
                return reject(window.Module);
            }
            fetch(_wasm).then(response => {
                return response.arrayBuffer();
            })
                .then(buffer => {
                window.Module.wasmBinary = buffer;
                window.script = document.createElement('script');
                window.doneEvent = new Event('done');
                window.script.addEventListener('done', () => {
                    resolve(window.Module);
                });
                window.script.src = './wasm/test.js';
                document.body.appendChild(window.script);
            });
        });
    }
}
/* harmony default export */ __webpack_exports__["a"] = (WasmLoader);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function (f, e) {
   true ? module.exports = e() : "function" === typeof define && define.amd ? define(e) : f.Stats = e();
})(this, function () {
  var f = function () {
    function e(a) {
      c.appendChild(a.dom);return a;
    }function u(a) {
      for (var d = 0; d < c.children.length; d++) c.children[d].style.display = d === a ? "block" : "none";l = a;
    }var l = 0,
        c = document.createElement("div");c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click", function (a) {
      a.preventDefault();
      u(++l % c.children.length);
    }, !1);var k = (performance || Date).now(),
        g = k,
        a = 0,
        r = e(new f.Panel("FPS", "#0ff", "#002")),
        h = e(new f.Panel("MS", "#0f0", "#020"));if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201"));u(0);return { REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function () {
        k = (performance || Date).now();
      }, end: function () {
        a++;var c = (performance || Date).now();h.update(c - k, 200);if (c > g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {
          var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
        }return c;
      }, update: function () {
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
    b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function (h, w) {
        c = Math.min(c, h);k = Math.max(k, h);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = f;b.fillText(g(h) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, g((1 - h / w) * p));
      } };
  };return f;
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WasmLoader__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StatsGraph__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Device__ = __webpack_require__(0);



const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;
let w = new __WEBPACK_IMPORTED_MODULE_0__WasmLoader__["a" /* default */]();
let s = new __WEBPACK_IMPORTED_MODULE_1__StatsGraph__["a" /* default */]();
w.load("./wasm/test").then((wasm) => {
    let device = new __WEBPACK_IMPORTED_MODULE_2__Device__["a" /* default */](SCR_WIDTH, SCR_HEIGHT);
    device.insert();
    device.clear('#ff00ff');
    // Allocate a buffer on the heap for our WASM code to write into
    // Note that the boilerplate in wasm/test.js sets a limit of 16 MB
    // although theoretically the maximum is 4 GB
    let HEAP_buffer_ptr8 = wasm._malloc(PAGE_SIZE_BYTES);
    // Now create a reverse-reference to the WASM heap as a JS TypedArray
    // Which we can manipulate easily JS-side, e.g. copy into the Canvas
    let view = new Uint8ClampedArray(wasm.buffer, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
    requestAnimationFrame(render);
    function render() {
        s.begin();
        wasm._addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
        device.flip(view);
        s.end();
        requestAnimationFrame(render);
    }
});


/***/ })
/******/ ]);
//# sourceMappingURL=main.build.js.map