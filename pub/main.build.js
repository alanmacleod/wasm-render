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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const BYTES_PER_PIXEL = 4;
/* harmony export (immutable) */ __webpack_exports__["a"] = BYTES_PER_PIXEL;

const ALPHA_MAGIC_NUMBER = 4278190080;
/* harmony export (immutable) */ __webpack_exports__["b"] = ALPHA_MAGIC_NUMBER;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sym__ = __webpack_require__(0);
// Device.ts
// Just abstracts the canvas crap
// Accepts a Uint8 buffer for rendering

// rename VideoDevice() as will extend to include texture "memory" etc
class Device {
    constructor(width, height, rasteriser) {
        this.width = width;
        this.height = height;
        this.rasteriser = rasteriser;
        this.rasteriser.init(width, height);
        this.bytes = width * height * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */];
    }
    create(element) {
        let e = !(element) ? document.body :
            document.getElementById(element);
        let c = document.createElement('canvas');
        c.width = this.width;
        c.height = this.height;
        this.canvas = c;
        this.context = this.canvas.getContext('2d');
        this.clear();
        // the actual pixel data
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        e.appendChild(c);
    }
    use(rasteriser) {
        if (!rasteriser.ready)
            rasteriser.init(this.width, this.height);
        this.rasteriser = rasteriser;
    }
    clear(colour = "0xffffff") {
        this.context.fillStyle = colour;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    // Old school points for anyone who smiles at 'flip'
    flip() {
        if (!this.rasteriser.buffer)
            throw new ReferenceError("`rasteriser.buffer: Uint8ClampedArray` is required!");
        this.imageData.data.set(this.rasteriser.buffer);
        this.context.putImageData(this.imageData, 0, 0);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Device;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return StatsMode; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__);

class StatsGraph {
    constructor(mode = 1) {
        this.stats = __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__();
        document.body.appendChild(this.stats.dom);
        this.stats.showPanel(mode);
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

var StatsMode;
(function (StatsMode) {
    StatsMode[StatsMode["FPS"] = 0] = "FPS";
    StatsMode[StatsMode["MS"] = 1] = "MS";
    StatsMode[StatsMode["MB"] = 2] = "MB";
    StatsMode[StatsMode["CUSTOM"] = 3] = "CUSTOM";
})(StatsMode || (StatsMode = {}));


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sym__ = __webpack_require__(0);

class NativeRasteriser {
    triangle() { }
    ;
    constructor() {
        this.ready = false;
        this.triangle = () => {
            console.log("Hell I'm a triangle");
        };
    }
    init(w, h) {
        this.width = w;
        this.height = h;
        this.pagesize = w * h * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */];
        this.buffer = new Uint8ClampedArray(this.pagesize);
        this.ready = true;
    }
    line(x0, y0, x1, y1, r, g, b) {
        // Clipping?
        let steep = false;
        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            [x0, y0] = [y0, x0];
            [x1, y1] = [y1, x1];
            steep = true;
        }
        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }
        let dx = x1 - x0;
        let dy = y1 - y0;
        let derror2 = Math.abs(dy) * 2;
        let error2 = 0;
        let y = y0;
        for (let x = x0; x <= x1; x++) {
            if (steep) {
                this.pset(y, x, r, g, b);
            }
            else {
                this.pset(x, y, r, g, b);
            }
            error2 += derror2;
            if (error2 > dx) {
                y += (y1 > y0 ? 1 : -1);
                error2 -= dx * 2;
            }
        }
    }
    // void line(int x0, int y0, int x1, int y1, TGAImage &image, TGAColor color) {
    //     bool steep = false;
    //     if (std::abs(x0-x1)<std::abs(y0-y1)) {
    //         std::swap(x0, y0);
    //         std::swap(x1, y1);
    //         steep = true;
    //     }
    //     if (x0>x1) {
    //         std::swap(x0, x1);
    //         std::swap(y0, y1);
    //     }
    //     int dx = x1-x0;
    //     int dy = y1-y0;
    //     int derror2 = std::abs(dy)*2;
    //     int error2 = 0;
    //     int y = y0;
    //     for (int x=x0; x<=x1; x++) {
    //         if (steep) {
    //             image.set(y, x, color);
    //         } else {
    //             image.set(x, y, color);
    //         }
    //         error2 += derror2;
    //         if (error2 > dx) {
    //             y += (y1>y0?1:-1);
    //             error2 -= dx*2;
    //         }
    //     }
    // }
    xline(xd, yd, x1, y1, x2, y2, r, g, b) {
        let ychange = yd / xd;
        let y = y1;
        for (let x = x1; x <= x2; x++) {
            this.pset(x, Math.round(y), r, g, b);
            y += ychange;
        }
    }
    pset(x, y, r, g, b) {
        let o = y * this.width * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */] + x * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */];
        this.buffer[o + 0] = r;
        this.buffer[o + 1] = g;
        this.buffer[o + 2] = b;
        this.buffer[o + 3] = 255;
    }
    vline(x, y1, y2, r, g, b) {
        let hwidth = this.width * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */];
        let xo = x * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */];
        for (let y = y1; y <= y2; y++) {
            let o = y * hwidth + xo;
            this.buffer[o + 0] = r;
            this.buffer[o + 1] = g;
            this.buffer[o + 2] = b;
            this.buffer[o + 3] = 255;
        }
    }
    fill(r, g, b) {
        for (let o = 0; o < this.pagesize; o += 4) {
            this.buffer[o + 0] = r;
            this.buffer[o + 1] = g;
            this.buffer[o + 2] = b;
            this.buffer[o + 3] = 255;
        }
    }
    render() {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NativeRasteriser;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sym__ = __webpack_require__(0);

class WasmRasteriser {
    constructor(wasm) {
        this.wasm = wasm;
        this.ready = false;
    }
    init(w, h) {
        this.width = w;
        this.height = h;
        this.pagesize = w * h * __WEBPACK_IMPORTED_MODULE_0__sym__["a" /* BYTES_PER_PIXEL */];
        // Allocate buffer on the WASM heap
        this.heapbuffer = this.wasm._malloc(this.pagesize);
        // Tell the WASM exports where to find the heap data and also pass dims
        this.wasm._init(this.heapbuffer, w, h);
        // Now create a "reverse reference" to the heap using a JS TypedArray
        this.buffer = new Uint8ClampedArray(this.wasm.buffer, this.heapbuffer, this.pagesize);
        this.ready = true;
    }
    rgbpack(r, g, b) {
        // little-endian bytepack: aaaaaaaa bbbbbbbb gggggggg rrrrrrrr
        return __WEBPACK_IMPORTED_MODULE_0__sym__["b" /* ALPHA_MAGIC_NUMBER */] + (b << 16) + (g << 8) + r;
    }
    pset(x, y, r, g, b) {
        this.wasm._pset(x, y, this.rgbpack(r, g, b));
    }
    vline(x, y1, y2, r, g, b) {
        this.wasm._vline(x, y1, y2, this.rgbpack(r, g, b));
    }
    fill(r, g, b) {
        //TODO: use memset!
        this.wasm._fill(this.rgbpack(r, g, b));
    }
    render() {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WasmRasteriser;



/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WasmLoader__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StatsGraph__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rasteriser_NativeRasteriser__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rasteriser_WasmRasteriser__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Device__ = __webpack_require__(1);





const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;
let w = new __WEBPACK_IMPORTED_MODULE_0__WasmLoader__["a" /* default */]();
let s = new __WEBPACK_IMPORTED_MODULE_1__StatsGraph__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__StatsGraph__["b" /* StatsMode */].MS);
w.load("./wasm/WasmRasteriser").then((wasm) => {
    // Create a rasteriser
    let nraster = new __WEBPACK_IMPORTED_MODULE_2__rasteriser_NativeRasteriser__["a" /* default */]();
    let wraster = new __WEBPACK_IMPORTED_MODULE_3__rasteriser_WasmRasteriser__["a" /* default */](wasm);
    // Create a device, pass the rasteriser
    let device = new __WEBPACK_IMPORTED_MODULE_4__Device__["a" /* default */](SCR_WIDTH, SCR_HEIGHT, nraster);
    device.create();
    nraster.fill(32, 0, 128);
    // for (let x=0; x <640; x+=8)
    // {
    //   nraster.vline(x, 0, 479, 255,255,255);
    //   nraster.vline(x+1, 0, 479, 0,0,0);
    //   nraster.vline(x+2, 0, 479, 255,255,255);
    // }
    for (let t = 0; t < 10000; t++) {
        nraster.line(Math.floor(Math.random() * SCR_WIDTH), Math.floor(Math.random() * SCR_HEIGHT), Math.floor(Math.random() * SCR_WIDTH), Math.floor(Math.random() * SCR_HEIGHT), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
    }
    device.flip();
    //
    // requestAnimationFrame(render);
    //
    // function render()
    // {
    //   s.begin();
    //   device.flip();
    //   s.end();
    //
    //   // s.begin();
    //   // for (let t:number = 0; t<60; t++)
    //   // {
    //   //   //wasm.a.addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
    //   //   device.flip(view);
    //   // }
    //   // s.end();
    //   //
    //   requestAnimationFrame(render);
    // }
});


/***/ })
/******/ ]);
//# sourceMappingURL=main.build.js.map