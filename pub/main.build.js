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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector3__ = __webpack_require__(3);

const X = 0, Y = 1;
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(b) {
        return new Vector2(b.x + this.x, b.y + this.y);
    }
    sub(b) {
        return new Vector2(this.x - b.x, this.y - b.y);
    }
    dot(b) {
        return (this.x * b.x) + (this.y * b.y);
    }
    barycentric(a, b, c) {
        // p = this
        let v0 = b.sub(a); // cache
        let v1 = c.sub(a); // cache
        let v2 = this.sub(a); // RECALC
        let d00 = v0.dot(v0); // cache
        let d01 = v0.dot(v1); // cache
        let d11 = v1.dot(v1); // cache
        let d20 = v2.dot(v0); // RECALC
        let d21 = v2.dot(v1); // RECALC
        let denom = 1 / (d00 * d11 - d01 * d01); // cache
        let v = (d11 * d20 - d01 * d21) * denom; //a
        let w = (d00 * d21 - d01 * d20) * denom;
        let u = 1.0 - v - w;
        return new __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */](u, v, w);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector2;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SharedMemory {
    constructor(wasminstance, sizebytes) {
        this.size = 0;
        this.wasm = wasminstance;
        if (sizebytes)
            this.allocate(sizebytes);
    }
    // Lock a chunk of WASM heap
    allocate(sizebytes) {
        this.size = sizebytes;
        this._heap = this.wasm._malloc(sizebytes);
        this._buffer = new Uint8ClampedArray(this.wasm.buffer, this._heap, this.size);
        return this.size;
    }
    // Blit `from` -> `.buffer`
    copy(from) {
        if (!this.size)
            throw ReferenceError("Copying into unallocated memory");
        if (from.length != this._buffer.length)
            console.warn("Array byte size mis-match, truncating will occur");
        this._buffer.set(from);
    }
    // Warning: this returns a generic ref to the *entire* heap at base address!
    get heap() {
        return this.wasm.buffer;
    }
    // Return a ref to our buffer view into WASM space
    get buffer() {
        return this._buffer;
    }
    // Return the heap pointer in WASM space (C funcs will need this)
    get pointer() {
        return this._heap;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SharedMemory;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const X = 0, Y = 1;
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector3;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sym__ = __webpack_require__(0);
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
        this.bytes = width * height * __WEBPACK_IMPORTED_MODULE_0__Sym__["a" /* BYTES_PER_PIXEL */];
    }
    create(element) {
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
        this.clear();
    }
    use(rasteriser) {
        if (!rasteriser.ready)
            rasteriser.init(this.width, this.height);
        this.rasteriser = rasteriser;
    }
    clear(colour = "#000000") {
        this.context.fillStyle = colour;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    // Old school points for smiling at 'flip'
    flip() {
        if (!this.rasteriser.buffer)
            throw new ReferenceError("`rasteriser.buffer: Uint8ClampedArray` is required!");
        this.imageData.data.set(this.rasteriser.buffer);
        this.context.putImageData(this.imageData, 0, 0);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Device;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return StatsMode; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_min_js__ = __webpack_require__(10);
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SharedMemory__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Sym__ = __webpack_require__(0);


// Texture data is essentially stored in a plain Uint8 array
// located on the WASM heap via SharedMemory so accessible to JS and WASM code
class Texture {
    // Bit annoyed I have to pass the wasminstance here cos of SharedMemory
    // But I'd rather wrap memory mgmt into this class then have it externally
    constructor(wasminstance, url) {
        this.ready = false;
        if (url)
            this.load(url);
        this.wasm = wasminstance;
    }
    // Use the DOM/HTML/browser to get the data with a hidden '<img>' element
    load(url) {
        let i = document.createElement('img');
        i.src = url;
        i.onload = () => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            this.maxu = i.width - 1;
            this.maxv = i.height - 1;
            canvas.width = i.width;
            canvas.height = i.height;
            this.width = i.width;
            this.height = i.height;
            ctx.drawImage(i, 0, 0, i.width, i.height, 0, 0, i.width, i.height);
            let data = ctx.getImageData(0, 0, i.width, i.height).data;
            this.data = new __WEBPACK_IMPORTED_MODULE_0__SharedMemory__["a" /* default */](this.wasm, __WEBPACK_IMPORTED_MODULE_1__Sym__["a" /* BYTES_PER_PIXEL */] * i.width * i.height);
            // Blit the pixel byte data into the WASM heap
            // GC will pick up our `data` object
            this.data.copy(data);
            this.ready = true;
            i = null;
            data = null;
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Texture;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Errrr not sure how to properly handle this global member mess in TS?
window.Module = {};
class WasmLoader {
    constructor() { }
    load(wasm) {
        let _wasm = wasm + ".wasm";
        let _imports = wasm + ".js";
        return new Promise((resolve, reject) => {
            // WASM not supported, end
            if (!('WebAssembly' in window)) {
                console.log('😂 WebAssembly not supported. Cool browser bro. 😂');
                return reject(window.Module);
            }
            console.log("💪 WebAssembly ENABLED 💪");
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
/* harmony export (immutable) */ __webpack_exports__["a"] = WasmLoader;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Clip__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Vector2__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Vector3__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Sym__ = __webpack_require__(0);
// "Native" probably a bit misleading. More of a "Reference" rasteriser




class NativeRasteriser {
    constructor() {
        this.ready = false;
    }
    init(w, h) {
        this.width = w;
        this.height = h;
        this.pagesize = w * h * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */];
        this.buffer = new Uint8ClampedArray(this.pagesize);
        this.ready = true;
    }
    line(x0, y0, x1, y1, r, g, b, clip) {
        if (clip) {
            let lo = __WEBPACK_IMPORTED_MODULE_0__Clip__["a" /* default */].line(x0, y0, x1, y1, 0, 0, this.width - 1, this.height - 1);
            if (!lo.visible)
                return;
            [x0, y0, x1, y1] = [lo.x0, lo.y0, lo.x1, lo.y1];
        }
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
    // Draw a triangle using a bbox with barycentric coord rejection
    // Heard about this method recently, I always used the top/bottom half tri
    // approach which I'm told is a little old school. I believe GPUs do it this
    // way because it's easier to exec in parallel...
    tri(points, r, g, b) {
        // Get a bounding box from three points
        let minx = Math.min(points[0].x, Math.min(points[1].x, points[2].x));
        let maxx = Math.max(points[0].x, Math.max(points[1].x, points[2].x));
        let miny = Math.min(points[0].y, Math.min(points[1].y, points[2].y));
        let maxy = Math.max(points[0].y, Math.max(points[1].y, points[2].y));
        // clipping
        minx = Math.max(0, minx);
        miny = Math.max(0, miny);
        maxx = Math.min(this.width - 1, maxx);
        maxy = Math.min(this.height - 1, maxy);
        // off-screen test
        if (maxx < 0)
            return;
        if (maxy < 0)
            return;
        if (minx >= this.width)
            return;
        if (miny >= this.height)
            return;
        let P = new __WEBPACK_IMPORTED_MODULE_1__Vector2__["a" /* default */]();
        let o = new __WEBPACK_IMPORTED_MODULE_2__Vector3__["a" /* default */]();
        // Scan a simple bbox
        for (let y = miny; y <= maxy; y++) {
            for (let x = minx; x <= maxx; x++) {
                // Test each coord
                P.x = x;
                P.y = y;
                // Can be massively optimised by unrolling this call
                o = P.barycentric(points[0], points[1], points[2]);
                // o = weighted ratio of each corner
                // points[0] = o.x
                // points[1] = o.y
                // points[2] = o.z
                if (o.x < 0 || o.y < 0 || o.z < 0)
                    continue;
                // Mul o by coords to get u,v
                // This coord is in the triangle, draw it
                this.pset(x, y, r, g, b);
            }
        }
    }
    tritex(points, uvs, tex, r, g, b) {
        // temp for testing
        if (!tex.ready)
            return;
        // Get a bounding box from three points
        let minx = Math.min(points[0].x, Math.min(points[1].x, points[2].x));
        let maxx = Math.max(points[0].x, Math.max(points[1].x, points[2].x));
        let miny = Math.min(points[0].y, Math.min(points[1].y, points[2].y));
        let maxy = Math.max(points[0].y, Math.max(points[1].y, points[2].y));
        // clipping
        minx = Math.max(0, minx);
        miny = Math.max(0, miny);
        maxx = Math.min(this.width - 1, maxx);
        maxy = Math.min(this.height - 1, maxy);
        // off-screen test
        if (maxx < 0)
            return;
        if (maxy < 0)
            return;
        if (minx >= this.width)
            return;
        if (miny >= this.height)
            return;
        let P = new __WEBPACK_IMPORTED_MODULE_1__Vector2__["a" /* default */]();
        let o = new __WEBPACK_IMPORTED_MODULE_2__Vector3__["a" /* default */]();
        let texels = tex.data.buffer;
        let texmaxu = tex.maxu;
        let texmaxv = tex.maxv;
        let texw = tex.width;
        let texh = tex.height;
        // Scan a simple bbox
        for (let y = miny; y <= maxy; y++) {
            for (let x = minx; x <= maxx; x++) {
                // Test each coord
                P.x = x;
                P.y = y;
                // Can be massively optimised by unrolling this call
                o = P.barycentric(points[0], points[1], points[2]);
                // o = weighted ratio of each corner
                // points[0] = o.x
                // points[1] = o.y
                // points[2] = o.z
                if (o.x < 0 || o.y < 0 || o.z < 0)
                    continue;
                let u = Math.round((uvs[0].x * o.x + uvs[1].x * o.y + uvs[2].x * o.z) * texmaxu);
                let v = Math.round((uvs[0].y * o.x + uvs[1].y * o.y + uvs[2].y * o.z) * texmaxv);
                let c = (v * texw * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */]) + (u * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */]);
                let r = texels[c + 0];
                let g = texels[c + 1];
                let b = texels[c + 2];
                this.pset(x, y, r, g, b);
            }
        }
    }
    pset(x, y, r, g, b) {
        let o = y * this.width * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */] + x * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */];
        this.buffer[o + 0] = r;
        this.buffer[o + 1] = g;
        this.buffer[o + 2] = b;
        this.buffer[o + 3] = 255;
    }
    vline(x, y1, y2, r, g, b) {
        let hwidth = this.width * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */];
        let xo = x * __WEBPACK_IMPORTED_MODULE_3__Sym__["a" /* BYTES_PER_PIXEL */];
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SharedMemory__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Sym__ = __webpack_require__(0);


class WasmRasteriser {
    constructor(wasm) {
        this.wasm = wasm;
        this.ready = false;
    }
    init(w, h) {
        this.width = w;
        this.height = h;
        this.pagesize = w * h * __WEBPACK_IMPORTED_MODULE_1__Sym__["a" /* BYTES_PER_PIXEL */];
        // Alocate some shared memory
        this.framebuffer = new __WEBPACK_IMPORTED_MODULE_0__SharedMemory__["a" /* default */](this.wasm, this.pagesize);
        // Tell the WASM exports where to find the heap data and also pass dims
        this.wasm._init(this.framebuffer.pointer, w, h);
        this.ready = true;
    }
    get buffer() {
        return this.framebuffer.buffer;
    }
    rgbpack(r, g, b) {
        // little-endian bytepack: aaaaaaaa bbbbbbbb gggggggg rrrrrrrr
        return __WEBPACK_IMPORTED_MODULE_1__Sym__["b" /* ALPHA_MAGIC_NUMBER */] + (b << 16) + (g << 8) + r;
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
/* 10 */
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WasmLoader__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Texture__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__StatsGraph__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rasteriser_NativeRasteriser__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__rasteriser_WasmRasteriser__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Device__ = __webpack_require__(4);






const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;
let w = new __WEBPACK_IMPORTED_MODULE_0__WasmLoader__["a" /* default */]();
let s = new __WEBPACK_IMPORTED_MODULE_2__StatsGraph__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__StatsGraph__["b" /* StatsMode */].MS);
w.load("./wasm/WasmRasteriser").then((wasm) => {
    // Create a rasteriser
    let nraster = new __WEBPACK_IMPORTED_MODULE_3__rasteriser_NativeRasteriser__["a" /* default */]();
    let wraster = new __WEBPACK_IMPORTED_MODULE_4__rasteriser_WasmRasteriser__["a" /* default */](wasm);
    let device = new __WEBPACK_IMPORTED_MODULE_5__Device__["a" /* default */](SCR_WIDTH, SCR_HEIGHT, nraster);
    device.create();
    let t = new __WEBPACK_IMPORTED_MODULE_1__Texture__["a" /* default */](wasm, "./img/test-texture.png");
    nraster.fill(32, 0, 128);
    nraster.line(-10, -10, 1000, 1000, 255, 255, 255, true);
    device.flip();
    //  let pts:Vector2[] = [
    //      new Vector2(10, 10),
    //      new Vector2(450, 10),
    //      new Vector2(10, 450)
    //  ];
    //
    //  let uvs:Vector2[] = [
    //    new Vector2(0,0),
    //    new Vector2(1,0),
    //    new Vector2(0,1)
    //  ];
    //
    //  // timeout for testing so the .PNG can load
    //  window.setTimeout(() => {
    //
    //    nraster.tritex(pts,uvs,t, 255, 0, 255)
    //    device.flip();
    //
    // }, 200);
    // for (let x=0; x <640; x+=8)
    // {
    //   wraster.vline(x, 0, 479, 255,255,255);
    //   wraster.vline(x+1, 0, 479, 0,0,0);
    //   wraster.vline(x+2, 0, 479, 255,255,255);
    // }
    // for (let t=0; t<10000; t++)
    // {
    //   nraster.line(
    //     Math.floor(Math.random() * SCR_WIDTH),
    //     Math.floor(Math.random() * SCR_HEIGHT),
    //     Math.floor(Math.random() * SCR_WIDTH),
    //     Math.floor(Math.random() * SCR_HEIGHT),
    //     Math.floor(Math.random() * 255),
    //     Math.floor(Math.random() * 255),
    //     Math.floor(Math.random() * 255)
    //   );
    // }
    // device.flip();
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
/*
function runbenchmarks(wasm)
{
  const bsize = 65536;
  const iterations = 5000;
  let hm = wasm._malloc(bsize);
  let wasmview = new Uint8Array(wasm.buffer, hm, bsize);
  let realview = new Uint8Array(bsize);

  let tstart = performance.now();
  // write to buffer
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      wasmview[o] = 1;
  }

  let wasmtotal_write = performance.now() - tstart;

  tstart = performance.now();
  // write to buffer
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      realview[o] = 1;
  }

  let realtotal_write = performance.now() - tstart;

  tstart = performance.now();
  let v = 0;
  // read
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      v = wasmview[o];
  }

  let wasmtotal_read = performance.now() - tstart;

  tstart = performance.now();
  v = 0;
  // read
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      v = realview[o];
  }

  let realtotal_read = performance.now() - tstart;


  console.log(`For ${iterations} WRITE iterations to ${bsize} bytes in WASM View took ${wasmtotal_write} ms`);
  console.log(`For ${iterations} WRITE iterations to ${bsize} bytes in REAL View took ${realtotal_write} ms`);
  console.log(`For ${iterations} READ iterations to ${bsize} bytes in WASM View took ${wasmtotal_read} ms`);
  console.log(`For ${iterations} READ iterations to ${bsize} bytes in REAL View took ${realtotal_read} ms`);


}
*/


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// crusty old JS line routine I had lying around, cba to port to TS properly
class Clip {
    constructor() { }
    static line(x1, y1, x2, y2, x_min, y_min, x_max, y_max) {
        let [u1, u2] = [0.0, 1.0];
        let line_out = { x0: 0, y0: 0, x1: 0, y1: 0, visible: false };
        let delta_x = x2 - x1;
        let delta_y = y2 - y1;
        let p_part = [-1.0 * delta_x, delta_x, -1 * delta_y, delta_y];
        let q_part = [x1 - x_min, x_max - x1, y1 - y_min, y_max - y1];
        let accept = true;
        for (let i = 0; i < 4; i++) {
            let p = p_part[i];
            let q = q_part[i];
            if (p == 0.0 && q < 0.0) {
                accept = false;
                break;
            }
            let r = q / p;
            if (p < 0)
                u1 = Math.max(u1, r);
            if (p > 0)
                u2 = Math.min(u2, r);
            if (u1 > u2) {
                accept = false;
                break;
            }
        }
        if (accept) {
            if (u2 < 1) {
                x2 = x1 + u2 * delta_x;
                y2 = y1 + u2 * delta_y;
            }
            if (u1 > 0) {
                x1 += u1 * delta_x;
                y1 += u1 * delta_y;
            }
            line_out.visible = true;
            line_out.x0 = x1;
            line_out.y0 = y1;
            line_out.x1 = x2;
            line_out.y1 = y2;
        }
        else {
            line_out.visible = false;
            line_out.x0 = -1.0;
            line_out.y0 = -1.0;
            line_out.x1 = -1.0;
            line_out.y1 = -1.0;
        }
        return line_out;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Clip;



/***/ })
/******/ ]);
//# sourceMappingURL=main.build.js.map