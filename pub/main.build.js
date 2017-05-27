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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Symbols/consts used by the application
const BYTES_PER_PIXEL = 4;
/* harmony export (immutable) */ __webpack_exports__["a"] = BYTES_PER_PIXEL;

const BIT_SHIFT_PER_PIXEL = 2;
/* harmony export (immutable) */ __webpack_exports__["c"] = BIT_SHIFT_PER_PIXEL;
 // e.g. texelU << 2
// e.g. texelU << 2
const ALPHA_MAGIC_NUMBER = 4278190080;
/* harmony export (immutable) */ __webpack_exports__["b"] = ALPHA_MAGIC_NUMBER;

const MAX_WASM_TASKS_PER_FRAME = 1000;
/* unused harmony export MAX_WASM_TASKS_PER_FRAME */
 // arbitrary really;
// Byte sizes, should probably be machine words but whatevz
// arbitrary really;
const INT32 = 4, PTR32 = 4, FLOAT32 = 4, FLOAT64 = 8;
/* unused harmony export INT32 */

/* unused harmony export PTR32 */

/* unused harmony export FLOAT32 */

/* unused harmony export FLOAT64 */



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector3__ = __webpack_require__(2);

// Method class for 4D Matrix manipulation. Static for speed (2x! - tested)
// Column-major order, right-hand system. Matches OpenGL et al.
// Matrix itself is a simple 4x4 array of arrays [][]
const TO_RAD = Math.PI / 180;
class Matrix {
    // Initialise a blank matrix of given dimensions
    // Bit silly offering dim params, as rest of the code here assumes 4x4 doh!
    static create(w = 4, h = 4) {
        for (var m = []; m.length < h;) {
            for (var n = []; n.length < w; n.push(0))
                ;
            m.push(n);
        }
        return m;
    }
    // 'NOP' matrix
    static identity(m) {
        for (let i = 0; i < m.length; i++)
            for (let j = 0; j < m[i].length; j++)
                m[i][j] = (i == j) ? 1 : 0; // Set diagonal to 1
    }
    // Deepcopy one matrix to another
    static clone(source, target) {
        for (let y = 0; y < source.length; y++)
            for (let x = 0; x < source[y].length; x++)
                target[y][x] = source[y][x];
    }
    // Vector -> Matrix Transform -> Vector
    static transform(v, m, out) {
        // Gross blocks of code like this make me weep
        var x = (v[0] * m[0][0]) + (v[1] * m[1][0]) + (v[2] * m[2][0]) + m[3][0];
        var y = (v[0] * m[0][1]) + (v[1] * m[1][1]) + (v[2] * m[2][1]) + m[3][1];
        var z = (v[0] * m[0][2]) + (v[1] * m[1][2]) + (v[2] * m[2][2]) + m[3][2];
        var w = (v[0] * m[0][3]) + (v[1] * m[1][3]) + (v[2] * m[2][3]) + m[3][3];
        let winv = (w != 0 && w != 1) ? 1 / w : 1;
        out[0] = x * winv;
        out[1] = y * winv;
        out[2] = z; // * winv;
    }
    // Simple translation matrix
    static translate(position, out) {
        Matrix.identity(out);
        out[3][0] = position[0];
        out[3][1] = position[1];
        out[3][2] = position[2];
    }
    // Perspective transform matrix, god this took bloody ages to get right
    static perspective(fov, ar, near, far, out) {
        let fovrad = fov * TO_RAD;
        let f = 1 / Math.tan(fovrad / 2);
        let m = [
            [f, 0, 0, 0],
            [0, f * ar, 0, 0],
            [0, 0, -(far + near) / (far - near), -1],
            [0, 0, -2 * far * near / (far - near), 0]
        ];
        Matrix.clone(m, out);
    }
    // Camera ('from') look at point ('to'). Up is [0,1,0] (Y+) as usual.
    static lookat(from, to, up, out) {
        let z = __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].create();
        __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].sub(from, to, z);
        __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].norm(z, z);
        let x = __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].create();
        __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].cross(up, z, x);
        __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].norm(x, x);
        let y = __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].create();
        __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].cross(z, x, y);
        __WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].norm(y, y);
        let vx = -__WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].dot(x, from);
        let vy = -__WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].dot(y, from);
        let vz = -__WEBPACK_IMPORTED_MODULE_0__Vector3__["a" /* default */].dot(z, from);
        let m = [
            [x[0], y[0], z[0], 0],
            [x[1], y[1], z[1], 0],
            [x[2], y[2], z[2], 0],
            [vx, vy, vz, 1]
        ];
        Matrix.clone(m, out);
    }
    // Couldn't be arsed to do rotations for x and z too
    static rotationy(angle, out) {
        let r = angle * TO_RAD;
        let s = Math.sin(r);
        let c = Math.cos(r);
        let m = [
            [c, 0, -s, 0],
            [0, 1, 0, 0],
            [s, 0, c, 0],
            [0, 0, 0, 1]
        ];
        Matrix.clone(m, out);
    }
    // Multiplies a series of matrices together in the given order
    static concat(matrices, out) {
        let mata = matrices[0];
        for (let m = 1, l = matrices.length - 1; m <= l; m++) {
            Matrix.mul(mata, matrices[m], out);
            if (m < l)
                Matrix.clone(out, mata);
        }
    }
    // Muls two matrices col x row using iteration
    static mul(a, b, out) {
        if (a[0].length != b.length)
            throw RangeError("Matrices do not match!");
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b[i].length; j++) {
                out[i][j] = 0;
                for (let k = 0; k < a[i].length; k++)
                    out[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Matrix;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Vector3.ts
//        offers static overloads operating on simple arrays for speed
// Passing the `out` by reference instead of creating & returning `out`
// is literally twice the speed (Chrome 58). As it always was in the C dayssss
// So, doing it like this with using TypeScript's static and overload options.
// Garbage collector takin' it easy too.
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // Static Methods ///////////////////////////////////////////////////////////
    static create(a, b, c) {
        return [a || 0, b || 0, c || 0];
    }
    static add(a, b, out) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
    }
    static sub(a, b, out) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
    }
    static mul(a, s, out) {
        out[0] = a[0] * s;
        out[1] = a[1] * s;
        out[2] = a[2] * s;
    }
    static div(a, d, out) {
        let id = 1 / d;
        out[0] = a[0] * id;
        out[1] = a[1] * id;
        out[2] = a[2] * id;
    }
    static norm(v, out) {
        let m = Vector3.mag(v);
        if (m == 0)
            out = [];
        else
            [out[0], out[1], out[2]] = [v[0] / m, v[1] / m, v[2] / m];
    }
    static mag(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }
    static dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    }
    static cross(a, b, out) {
        out[0] = a[1] * b[2] - a[2] * b[1];
        out[1] = a[2] * b[0] - a[0] * b[2];
        out[2] = a[0] * b[1] - a[1] * b[0];
    }
    // Instance Methods /////////////////////////////////////////////////////////
    add(b) {
        return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
    }
    sub(b) {
        return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
    }
    norm() {
        let m = this.mag();
        if (m == 0)
            return new Vector3();
        return new Vector3(this.x / m, this.y / m, this.z / m);
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    dot(b) {
        return (this.x * b.x) + (this.y * b.y) + (this.z * b.z);
    }
    cross(b) {
        return new Vector3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector3;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//  SharedMemory.ts
//        Allows sharing a pool of memory between Javascript and WebAssembly
//        Necessary for fast real-time rasteriser switching
//        and for communication between C and JS
//        Uses 50% less memory than the alternative, obviously
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
        // Note: us
        this._buffer32 = new Int32Array(this.wasm.buffer, this._heap, this.size);
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
    get bufferi32() {
        return this._buffer32;
    }
    // Return the heap pointer in WASM space (C funcs will need this)
    get pointer() {
        return this._heap;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SharedMemory;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math_Vector3__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math_Matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Sym__ = __webpack_require__(0);
// Device.ts
// Just abstracts the canvas crap
// Accepts a Uint8 buffer for rendering



// rename VideoDevice() as will extend to include texture "memory" etc
class Device {
    constructor(width, height, rasteriser) {
        this.width = width;
        this.height = height;
        this.hwidth = (width / 2) >> 0;
        this.hheight = (height / 2) >> 0;
        this.rasteriser = rasteriser;
        this.container = null;
        this.rasteriser.init(width, height);
        this.bytes = width * height * __WEBPACK_IMPORTED_MODULE_2__Sym__["a" /* BYTES_PER_PIXEL */];
    }
    create(element) {
        let e = !(element) ? document.body :
            document.getElementById(element);
        let c = document.createElement('canvas');
        this.container = document.createElement('div');
        // this.container.style.backgroundColor = "#f0f";
        this.container.style.width = this.width + "px";
        this.container.style.height = this.height + "px";
        this.container.style.position = "relative";
        // this.container.style.border = "1px solid #d0d0d0";
        this.container.appendChild(c);
        c.width = this.width;
        c.height = this.height;
        this.canvas = c;
        this.context = this.canvas.getContext('2d');
        // the actual pixel data
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        e.appendChild(this.container);
        this.clear();
    }
    use(rasteriser) {
        if (!rasteriser.ready)
            rasteriser.init(this.width, this.height);
        this.rasteriser = rasteriser;
    }
    clear() {
        this.rasteriser.begin();
    }
    // Old school points for smiling at 'flip'
    flip() {
        if (!this.rasteriser.buffer)
            throw new ReferenceError("`rasteriser.buffer: Uint8ClampedArray` is required!");
        this.imageData.data.set(this.rasteriser.buffer);
        this.context.putImageData(this.imageData, 0, 0);
        this.rasteriser.end();
    }
    // Renders a textured Mesh with zBuffer
    render(m, mat) {
        // Directional light
        let light = [0, 0, -1];
        let saturation = 1.35;
        // Initialise these outside the loop for normal/lighting calcs
        let v1 = __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create();
        let v2 = __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create();
        let fnormal = __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create();
        // Rasterisation screen coordinates buffer
        let triscreen = [
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create(),
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create(),
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create()
        ];
        // Triangle world coordinates for lighting, culling
        let triworld = [
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create(),
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create(),
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].create()
        ];
        let vertex;
        let transform = __WEBPACK_IMPORTED_MODULE_1__math_Matrix__["a" /* default */].create();
        __WEBPACK_IMPORTED_MODULE_1__math_Matrix__["a" /* default */].concat([m.matrix, mat], transform);
        // For each face (triangle) of the mesh model
        for (let fi = 0; fi < m.faces.length; fi++) {
            let face = m.faces[fi];
            // Transform each face's vertex into view space
            for (let v = 0; v < 3; v++) {
                vertex = m.vertices[face[v]];
                __WEBPACK_IMPORTED_MODULE_1__math_Matrix__["a" /* default */].transform(vertex, transform, triworld[v]);
                triscreen[v][0] = triworld[v][0] * this.width + this.hwidth;
                triscreen[v][1] = -triworld[v][1] * this.height + this.hheight;
                triscreen[v][2] = triworld[v][2];
            }
            // Compute lighting & visibilty for this face
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].sub(triworld[2], triworld[1], v1);
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].sub(triworld[1], triworld[0], v2);
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].cross(v1, v2, fnormal);
            __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].norm(fnormal, fnormal);
            let power = __WEBPACK_IMPORTED_MODULE_0__math_Vector3__["a" /* default */].dot(fnormal, light);
            // Rasterise if visible etc
            if (power > 0 && m.textures.length > 0) {
                // Call the rasteriser! JS || WASM
                this.rasteriser.tri(triscreen, m.uvs[fi], power * saturation, m.textures[m.uvtextures[fi]]);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Device;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SharedMemory__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sym__ = __webpack_require__(0);


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
            this.data = new __WEBPACK_IMPORTED_MODULE_0__SharedMemory__["a" /* default */](this.wasm, __WEBPACK_IMPORTED_MODULE_1__core_Sym__["a" /* BYTES_PER_PIXEL */] * i.width * i.height);
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math_Matrix__ = __webpack_require__(1);

// Mesh.ts
//        Represents a simple 3d model with a texture(s)
//        Just using a box for now, but can handle arbitrary 3d models easily.
//
class Mesh {
    constructor() {
        this.matrix = __WEBPACK_IMPORTED_MODULE_0__math_Matrix__["a" /* default */].create();
        this.mrotation = __WEBPACK_IMPORTED_MODULE_0__math_Matrix__["a" /* default */].create();
        this.mtranslation = __WEBPACK_IMPORTED_MODULE_0__math_Matrix__["a" /* default */].create();
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.textures = [];
    }
    updatematrix() {
        // Y only
        __WEBPACK_IMPORTED_MODULE_0__math_Matrix__["a" /* default */].rotationy(this.rotation[1], this.mrotation);
        __WEBPACK_IMPORTED_MODULE_0__math_Matrix__["a" /* default */].translate(this.position, this.mtranslation);
        __WEBPACK_IMPORTED_MODULE_0__math_Matrix__["a" /* default */].concat([this.mrotation, this.mtranslation], this.matrix);
    }
    set(position, rotation) {
        this.position = position;
        this.rotation = (rotation) ? rotation : this.rotation;
        this.updatematrix();
    }
    setrotation(rotation) {
        this.rotation = rotation;
        this.updatematrix();
    }
    //public loadobj(url):void {}
    boxgeometry(width, height, depth) {
        // Test object.
        // I used THREE's CubeGeometry class to create a cube, then
        // just dumped the vertices and faces arrays to this:
        this.vertices = [
            [0.5, 0.5, 0.5],
            [0.5, 0.5, -0.5],
            [0.5, -0.5, 0.5],
            [0.5, -0.5, -0.5],
            [-0.5, 0.5, -0.5],
            [-0.5, 0.5, 0.5],
            [-0.5, -0.5, -0.5],
            [-0.5, -0.5, 0.5]
        ];
        this.faces = [
            [0, 2, 1],
            [2, 3, 1],
            [4, 6, 5],
            [6, 7, 5],
            [4, 5, 1],
            [5, 0, 1],
            [7, 6, 2],
            [6, 3, 2],
            [5, 7, 0],
            [7, 2, 0],
            [1, 3, 4],
            [3, 6, 4]
        ];
        this.uvs = [
            [[0, 1], [0, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1]],
            [[0, 1], [0, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1]],
            [[0, 1], [0, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1]],
            [[0, 1], [0, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1]],
            [[0, 1], [0, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1]],
            [[0, 1], [0, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1]]
        ];
        this.uvtextures = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let v of this.vertices) {
            v[0] *= width;
            v[1] *= height;
            v[2] *= depth;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mesh;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Clip__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sym__ = __webpack_require__(0);
// "Native" probably a bit misleading. More of a "Reference" rasteriser


class NativeRasteriser {
    constructor() {
        this.ready = false;
    }
    init(w, h) {
        if (this.ready)
            return;
        this.width = w;
        this.hwidth = (w / 2) >> 0;
        this.height = h;
        this.hheight = (h / 2) >> 0;
        this.pagesize = w * h * __WEBPACK_IMPORTED_MODULE_1__core_Sym__["a" /* BYTES_PER_PIXEL */];
        this.buffer = new Uint8ClampedArray(this.pagesize);
        this.zbuffer = new Float32Array(w * h);
        this.ready = true;
    }
    begin() {
        this.buffer.fill(0);
    }
    end() {
        this.zbuffer.fill(0);
    }
    // Standard Bres' line routine, I've been copying, pasting and translating
    // this code of mine for about 10 years. It's seen around six languages.
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
    /* flat shaded tri for testing
    public triflat(points:number[][], r:number, g:number, b:number, wireframe?:boolean): void
    {
      if (wireframe)
      {
        this.wireframe(points);
        return;
      }
  
      // Get a bounding box from three points
      let minx:number = Math.min(points[0][0], Math.min=(points[1][0], points[2][0]));
      let maxx:number = Math.max(points[0][0], Math.max(points[1][0], points[2][0]));
      let miny:number = Math.min(points[0][1], Math.min(points[1][1], points[2][1]));
      let maxy:number = Math.max(points[0][1], Math.max(points[1][1], points[2][1]));
  
      // clipping
      minx = Math.max(0, minx);
      miny = Math.max(0, miny);
      maxx = Math.min(this.width-1, maxx);
      maxy = Math.min(this.height-1, maxy);
  
      // off-screen test
      if (maxx < 0) return;
      if (maxy < 0) return;
      if (minx >= this.width) return;
      if (miny >= this.height) return;
  
      // Fast float->int convert. Need ints otherwise gaps in the BC test.
      minx >>= 0; maxx >>= 0;
      miny >>= 0; maxy >>= 0;
  
      let P = [0, 0];
      let o = [0, 0, 0];
  
      for ( let y=miny; y<=maxy; y++ )
      {
        for (let x=minx; x<=maxx; x++ )
        {
          // Can be massively optimised by unrolling this call
          Vector2.barycentric([x,y], points[0], points[1], points[2], o);
  
          if (o[0] < 0 || o[1] < 0 || o[2] < 0) continue;
  
          // This coord is in the triangle
  
          // Calculate the pixel's Z
          let z = points[0][2] * o[0] +
                  points[1][2] * o[1] +
                  points[2][2] * o[2];
  
          let zo = y * this.width + x;
  
          // Is it closer than an existing pixel? Draw it
          if (this.zbuffer[zo] < z)
          {
            this.zbuffer[zo] = z;
            this.pset( x, y, r, g, b );
          }
  
        }
      }
  
    }
  
    */
    // Draws a triangle in wireframe mode
    wireframe(points) {
        for (let t = 0; t < 3; t++) {
            let a = points[t];
            let b = points[(t + 1) % 3];
            this.line(a[0], a[1], // point A
            b[0], b[1], // point B
            0, 0, 0, // Colour
            true // Clipping?
            );
        }
    }
    // Draw a triangle using a bbox with barycentric coord rejection
    // Heard about this method recently, I always used the top/bottom half tri
    // approach which I'm told is a little old school. I believe GPUs do it this
    // way because it's easier to exec in parallel...
    tri(points, uvs, light, tex) {
        // Texture hasn't loaded yet, draw an outline
        // console.log(tex.ready);
        if (!tex.ready) {
            this.wireframe(points);
            return;
        }
        // Get a bounding box from three points
        let minx = Math.min(points[0][0], Math.min(points[1][0], points[2][0]));
        let maxx = Math.max(points[0][0], Math.max(points[1][0], points[2][0]));
        let miny = Math.min(points[0][1], Math.min(points[1][1], points[2][1]));
        let maxy = Math.max(points[0][1], Math.max(points[1][1], points[2][1]));
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
        // Fast float->int convert. Need ints otherwise gaps in the BC test.
        minx >>= 0;
        maxx >>= 0;
        miny >>= 0;
        maxy >>= 0;
        let P = [0, 0];
        let o = [0, 0, 0];
        let texels = tex.data.buffer;
        let texmaxu = tex.maxu;
        let texmaxv = tex.maxv;
        let texw = tex.width;
        let texh = tex.height;
        let u = 0, v = 0;
        let r = 0, g = 0, b = 0;
        let inv_p0z = 1 / points[0][2];
        let inv_p1z = 1 / points[1][2];
        let inv_p2z = 1 / points[2][2];
        // FIXME below: just * by inv_p0z etc you idiot.
        let inv_p0u = uvs[0][0] / points[0][2];
        let inv_p1u = uvs[1][0] / points[1][2];
        let inv_p2u = uvs[2][0] / points[2][2];
        let inv_p0v = uvs[0][1] / points[0][2];
        let inv_p1v = uvs[1][1] / points[1][2];
        let inv_p2v = uvs[2][1] / points[2][2];
        let inv_Pz = 0;
        let inv_Pu = 0;
        let inv_Pv = 0;
        // a = points[0], b = points[1], c = points[2]
        let va0 = points[2][0] - points[0][0];
        let va1 = points[1][0] - points[0][0];
        let va2;
        let vb0 = points[2][1] - points[0][1];
        let vb1 = points[1][1] - points[0][1];
        let vb2;
        let bc0;
        let bc1;
        let bc2 = va0 * vb1 - va1 * vb0;
        let iz = 1 / bc2;
        if (Math.abs(bc2) < 1)
            return;
        bc0 = va1 * vb2 - va2 * vb1;
        bc1 = va2 * vb0 - va0 * vb2;
        // Scan a simple bbox
        for (P[1] = miny; P[1] <= maxy; P[1]++) {
            for (P[0] = minx; P[0] <= maxx; P[0]++) {
                // barycentric is _all_ about Barry
                // Can be optimised by unrolling this call (- which I later did)
                // Vector2.barycentric( P, points[0], points[1], points[2], o );
                va2 = points[0][0] - P[0];
                vb2 = points[0][1] - P[1];
                bc0 = va1 * vb2 - va2 * vb1;
                bc1 = va2 * vb0 - va0 * vb2;
                o[0] = 1.0 - (bc0 + bc1) * iz;
                o[1] = bc1 * iz;
                o[2] = bc0 * iz;
                // Check [0] first
                if (o[0] < 0 || o[1] < 0 || o[2] < 0)
                    continue;
                // Calc weighted values
                inv_Pz = inv_p0z * o[0] +
                    inv_p1z * o[1] +
                    inv_p2z * o[2];
                inv_Pu = inv_p0u * o[0] +
                    inv_p1u * o[1] +
                    inv_p2u * o[2];
                inv_Pv = inv_p0v * o[0] +
                    inv_p1v * o[1] +
                    inv_p2v * o[2];
                let zo = P[1] * this.width + P[0];
                // Use 1/z depth test
                if (this.zbuffer[zo] > inv_Pz)
                    continue;
                this.zbuffer[zo] = inv_Pz;
                // Divide u/z & v/z by 1/z to get perspective correct UV coords
                u = ((inv_Pu / inv_Pz) * texmaxu) >> 0;
                v = ((inv_Pv / inv_Pz) * texmaxv) >> 0;
                let c = (v * texw << __WEBPACK_IMPORTED_MODULE_1__core_Sym__["c" /* BIT_SHIFT_PER_PIXEL */]) + (u << __WEBPACK_IMPORTED_MODULE_1__core_Sym__["c" /* BIT_SHIFT_PER_PIXEL */]);
                let r = texels[c + 0] * light;
                let g = texels[c + 1] * light;
                let b = texels[c + 2] * light;
                this.pset(P[0], P[1], r, g, b);
            }
        }
    }
    pset(x, y, r, g, b) {
        let o = (y >> 0) * this.width * __WEBPACK_IMPORTED_MODULE_1__core_Sym__["a" /* BYTES_PER_PIXEL */] + (x >> 0) * __WEBPACK_IMPORTED_MODULE_1__core_Sym__["a" /* BYTES_PER_PIXEL */];
        this.buffer[o + 0] = r;
        this.buffer[o + 1] = g;
        this.buffer[o + 2] = b;
        this.buffer[o + 3] = 255;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NativeRasteriser;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__memory_SharedMemory__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sym__ = __webpack_require__(0);


// WasmRasteriser.ts
//              Mostly a skeleton class to hook up the WebAssembly funcs               
class WasmRasteriser {
    constructor(wasm) {
        this.wasm = wasm;
        this.ready = false;
    }
    begin() {
        // Start a new task list
        this.framebuffer.buffer.fill(0);
    }
    end() {
        // clear z-buffer
        // console.log("WASM tasks: "+ this.taskno);
    }
    init(w, h) {
        if (this.ready)
            return;
        this.width = w;
        this.height = h;
        this.pagesize = w * h * __WEBPACK_IMPORTED_MODULE_1__core_Sym__["a" /* BYTES_PER_PIXEL */];
        // Alocate some shared memory
        this.framebuffer = new __WEBPACK_IMPORTED_MODULE_0__memory_SharedMemory__["a" /* default */](this.wasm, this.pagesize);
        // Tell the WASM exports where to find the heap data and also pass dims
        this.wasm._init(this.framebuffer.pointer, w, h);
        this.ready = true;
    }
    get buffer() {
        return this.framebuffer.buffer;
    }
    rgbpack(r, g, b) {
        // little-endian bytepack: aaaaaaaa bbbbbbbb gggggggg rrrrrrrr
        return __WEBPACK_IMPORTED_MODULE_1__core_Sym__["b" /* ALPHA_MAGIC_NUMBER */] + (b << 16) + (g << 8) + r;
    }
    pset(x, y, r, g, b) {
        this.wasm._pset(x << 0, y << 0, this.rgbpack(r, g, b));
    }
    vline(x, y1, y2, r, g, b) {
        this.wasm._vline(x, y1, y2, this.rgbpack(r, g, b));
    }
    fill(r, g, b) {
        //TODO: use memset!
        this.wasm._fill(this.rgbpack(r, g, b));
    }
    tri(points, uvs, light, tex) {
        // In Javascript we render wireframe before the texture has loaded
        // but for WASM I'll just skip adding the job cos I haven't implemented
        // a line routine in C!
        if (!tex.ready)
            return;
        // Call the WASM/C code! ....omg it's fast
        this.wasm._tri(points[0][0], points[0][1], points[0][2], uvs[0][0], uvs[0][1], points[1][0], points[1][1], points[1][2], uvs[1][0], uvs[1][1], points[2][0], points[2][1], points[2][2], uvs[2][0], uvs[2][1], tex.data.pointer, tex.width, light);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WasmRasteriser;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return StatsMode; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_mod_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_stats_mod_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__lib_stats_mod_js__);

class StatsGraph {
    constructor(mode = 1, appendElement, clickHandler) {
        this.stats = __WEBPACK_IMPORTED_MODULE_0__lib_stats_mod_js__(clickHandler);
        let e = appendElement || document.body;
        e.appendChild(this.stats.dom);
        this.stats.showPanel(mode);
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.top = '';
        this.stats.dom.style.bottom = "0";
        // this.stats.dom.style.right = "5px";
        this.stats.dom.style.left = "30px";
    }
    begin() {
        this.stats.begin();
    }
    setview(title) {
        this.stats.setview(title);
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Errrr not sure how to properly handle this global member mess in TS?
window.Module = {};
class WasmLoader {
    constructor() { }
    load(wasm) {
        let _wasm = wasm + ".wasm";
        let _imports = wasm + ".js";
        console.log("Fetching " + _wasm);
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
                window.script.src = _imports; //'./wasm/test.js';
                document.body.appendChild(window.script);
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WasmLoader;



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Stats = factory();
})(this, function () {
	'use strict';

	/**
  * @author mrdoob / http://mrdoob.com/
  */

	navigator.sayswho = function () {
		var ua = navigator.userAgent,
		    tem,
		    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
		return M.join(' ');
	}();

	var Stats = function (clickHandler) {

		var mode = 0;

		var container = document.createElement('div');
		container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.7;z-index:10000';
		container.addEventListener('click', function (event) {

			event.preventDefault();
			// showPanel( ++ mode % container.children.length );

			if (clickHandler) clickHandler();
		}, false);

		//

		function addPanel(panel) {

			container.appendChild(panel.dom);
			return panel;
		}

		function showPanel(id) {

			for (var i = 0; i < container.children.length; i++) {

				container.children[i].style.display = i === id ? 'block' : 'none';
			}

			mode = id;
		}

		//

		var beginTime = (performance || Date).now(),
		    prevTime = beginTime,
		    frames = 0;

		var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
		var msPanel = addPanel(new Stats.Panel('MS', '#000', '#060'));

		if (self.performance && self.performance.memory) {

			var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
		}

		showPanel(0);

		return {

			REVISION: 16,

			dom: container,

			addPanel: addPanel,
			showPanel: showPanel,

			setview: function (rno) {
				//console.log(msPanel);
				msPanel.textlabel = rno ? "WebAssembly / C:" : "JavaScript:";
				msPanel.fillCol = rno ? "#0033CC" : "#00BB00";
				msPanel.bgCol = rno ? "#000044" : "#006600";
			},

			begin: function () {

				beginTime = (performance || Date).now();
			},

			end: function () {

				frames++;

				var time = (performance || Date).now();

				msPanel.update(time - beginTime, 200);

				if (time > prevTime + 1000) {

					fpsPanel.update(frames * 1000 / (time - prevTime), 100);

					prevTime = time;
					frames = 0;

					if (memPanel) {

						var memory = performance.memory;
						memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
					}
				}

				return time;
			},

			update: function () {

				beginTime = this.end();
			},

			// Backwards Compatibility

			domElement: container,
			setMode: showPanel

		};
	};

	Stats.Panel = function (name, fg, bg) {

		var system = navigator.sayswho;

		var min = Infinity,
		    max = 0,
		    round = Math.round;
		var PR = round(window.devicePixelRatio || 1);

		var WIDTH = 8 * 80 * PR,
		    HEIGHT = 2 * 48 * PR,
		    TEXT_X = 6 * PR,
		    TEXT_Y = 1 * PR,
		    GRAPH_X = 3 * PR,
		    GRAPH_Y = 15 * PR,
		    GRAPH_WIDTH = 8 * 74 * PR,
		    GRAPH_HEIGHT = 2 * 30 * PR;

		var canvas = document.createElement('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.cssText = 'width:' + WIDTH + 'px;height:' + HEIGHT + 'px';

		var context = canvas.getContext('2d');
		context.font = 'bold ' + 15 * PR + 'px Helvetica,Arial,sans-serif';
		context.textBaseline = 'top';

		context.fillStyle = bg;
		// context.fillRect( 0, 0, WIDTH, HEIGHT );

		// context.globalAlpha = 1;
		context.fillStyle = fg;
		// context.fillText( name, TEXT_X, TEXT_Y );
		//graph background
		// context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

		context.fillStyle = '#ffffff'; //bg;
		context.globalAlpha = 1; //0.9;
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		return {

			dom: canvas,

			textlabel: "JavaScript:",

			fillCol: "#00BB00",

			bgCol: "#006600",

			update: function (value, maxValue) {

				min = Math.min(min, value);
				max = Math.max(max, value);

				context.fillStyle = this.bgCol;
				context.globalAlpha = 1;
				// title bar
				context.fillRect(GRAPH_X, GRAPH_HEIGHT + 15, GRAPH_WIDTH, GRAPH_Y + 3);

				// title text
				context.fillStyle = '#ffffff'; //fg
				//let text = ' JavaScript ('+system+') frame time: ' + round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')';
				let text = ' ' + this.textlabel + ' ' + round(value) + ' ' + name;
				context.fillText(text, TEXT_X, GRAPH_HEIGHT + 16);
				context.fillStyle = this.fillCol;

				// Shift the graph <--- left
				context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

				// context.fillStyle = bg;
				context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

				context.fillStyle = '#ffffff'; //bg;
				context.globalAlpha = 1;
				context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - value / maxValue) * GRAPH_HEIGHT));
			}

		};
	};

	return Stats;
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mesh_Mesh__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_WasmLoader__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__memory_Texture__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_StatsGraph__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__rasteriser_NativeRasteriser__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__rasteriser_WasmRasteriser__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Device__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__math_Matrix__ = __webpack_require__(1);








const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * 4;
const RASTERISER_NATIVE = 0, RASTERISER_WASM = 1;
let w = new __WEBPACK_IMPORTED_MODULE_1__util_WasmLoader__["a" /* default */]();
let stats;
let rasterisers = [];
let currentraster = RASTERISER_NATIVE;
// 3D scene setup
// Create and position simple test object
let box = new __WEBPACK_IMPORTED_MODULE_0__mesh_Mesh__["a" /* default */]();
box.boxgeometry(1, 1, 1);
box.set([0, 0, 6], [0, 0, 0]);
// Eye -> Screen matrices
let mprojection = __WEBPACK_IMPORTED_MODULE_7__math_Matrix__["a" /* default */].create(); // Camera -> Screen
let mcamera = __WEBPACK_IMPORTED_MODULE_7__math_Matrix__["a" /* default */].create(); // Duh
let mtransform = __WEBPACK_IMPORTED_MODULE_7__math_Matrix__["a" /* default */].create(); // Concatenated transformation
__WEBPACK_IMPORTED_MODULE_7__math_Matrix__["a" /* default */].perspective(45, SCR_WIDTH / SCR_HEIGHT, 0.01, 1.0, mprojection);
__WEBPACK_IMPORTED_MODULE_7__math_Matrix__["a" /* default */].lookat([0, 0, 10], [0, 0, 0], [0, 1, 0], mcamera);
// Concatenate the above matrices for speed
__WEBPACK_IMPORTED_MODULE_7__math_Matrix__["a" /* default */].concat([mcamera, mprojection], mtransform);
// Load the WASM code over the wire
w.load("./wasm/WasmRasteriser").then((wasm) => {
    // // Create the two rasterisers
    rasterisers[0] = new __WEBPACK_IMPORTED_MODULE_4__rasteriser_NativeRasteriser__["a" /* default */]();
    rasterisers[1] = new __WEBPACK_IMPORTED_MODULE_5__rasteriser_WasmRasteriser__["a" /* default */](wasm);
    // Load the texture here because the WASM instance is needed for SharedMem
    let t = new __WEBPACK_IMPORTED_MODULE_2__memory_Texture__["a" /* default */](wasm, "./img/radicrate.jpg");
    box.textures.push(t);
    // The 'device' calls the rasterisers and handles the Canvas
    let device = new __WEBPACK_IMPORTED_MODULE_6__Device__["a" /* default */](SCR_WIDTH, SCR_HEIGHT, rasterisers[currentraster]);
    device.create();
    // device.switchrasteriser(wraster)
    stats = new __WEBPACK_IMPORTED_MODULE_3__util_StatsGraph__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3__util_StatsGraph__["b" /* StatsMode */].MS, device.container, () => {
        currentraster = 1 - currentraster;
        device.use(rasterisers[currentraster]);
        // let title = currentraster ? "WebAssembly / C:" : "JavaScript:";
        stats.setview(currentraster);
    });
    requestAnimationFrame(render);
    var ang = 360;
    // Main render loop
    function render() {
        stats.begin();
        box.setrotation([0, (ang -= 2) % 360, 0]);
        device.clear();
        device.render(box, mtransform);
        device.flip();
        stats.end();
        // if (ang < 10)
        requestAnimationFrame(render);
    }
});
/*
// One of a few performance tests I ran. This one to test memory read/write.
// Had others but didn't keep the code, don't cry.
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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Clip.ts
//        Crusty old JS line routine I had lying around, cba to port to TS properly
//        Therein lies a strength/weakness with TS ... cos I don't have to.
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