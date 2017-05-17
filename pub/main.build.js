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

	"use strict";
	
	var _WasmLoader = __webpack_require__(1);
	
	var _WasmLoader2 = _interopRequireDefault(_WasmLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var w = new _WasmLoader2.default();
	
	w.load("./wasm/test").then(function (wasm) {
	
	  // // fill heap
	  // for (let t=0; t< 100; t++)
	  // {
	  //   wasm.HEAP32[t] = t;
	  // }
	
	  var INT32_SIZE = 4;
	  var numInt32 = 5;
	
	  var testArray = new Int32Array([10, 11, 12, 13, 14]);
	
	  var ptr = wasm._malloc(numInt32 * INT32_SIZE);
	
	  wasm.HEAP32.set(testArray, ptr / INT32_SIZE);
	
	  //console.log("Module...", Module);
	
	  wasm._addOne(ptr);
	});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTE4YTg2N2VlYzUxNjlmZmE4ZjIiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9XYXNtTG9hZGVyLmpzIl0sIm5hbWVzIjpbInciLCJsb2FkIiwidGhlbiIsIndhc20iLCJJTlQzMl9TSVpFIiwibnVtSW50MzIiLCJ0ZXN0QXJyYXkiLCJJbnQzMkFycmF5IiwicHRyIiwiX21hbGxvYyIsIkhFQVAzMiIsInNldCIsIl9hZGRPbmUiLCJ3aW5kb3ciLCJNb2R1bGUiLCJXYXNtTG9hZGVyIiwiX3dhc20iLCJfaW1wb3J0cyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29uc29sZSIsImxvZyIsImZldGNoIiwicmVzcG9uc2UiLCJhcnJheUJ1ZmZlciIsIndhc21CaW5hcnkiLCJidWZmZXIiLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJkb25lRXZlbnQiLCJFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJib2R5IiwiYXBwZW5kQ2hpbGQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7Ozs7OztBQUVBLEtBQUlBLElBQUksMEJBQVI7O0FBRUFBLEdBQUVDLElBQUYsQ0FBTyxhQUFQLEVBQXNCQyxJQUF0QixDQUEyQixVQUFDQyxJQUFELEVBQVU7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTUMsYUFBYSxDQUFuQjtBQUNBLE9BQUlDLFdBQVcsQ0FBZjs7QUFFQSxPQUFJQyxZQUFZLElBQUlDLFVBQUosQ0FBZSxDQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFVLEVBQVYsRUFBYSxFQUFiLENBQWYsQ0FBaEI7O0FBRUEsT0FBSUMsTUFBTUwsS0FBS00sT0FBTCxDQUFhSixXQUFXRCxVQUF4QixDQUFWOztBQUVBRCxRQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0JMLFNBQWhCLEVBQTJCRSxNQUFNSixVQUFqQzs7QUFFQTs7QUFFQUQsUUFBS1MsT0FBTCxDQUFhSixHQUFiO0FBRUQsRUFyQkQsRTs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBSyxRQUFPQyxNQUFQLEdBQWdCLEVBQWhCOztLQUVxQkMsVTtBQUVuQix5QkFDQTtBQUFBO0FBRUM7Ozs7MEJBRUlaLEksRUFDTDtBQUNFLFdBQUlhLFFBQVFiLE9BQU8sT0FBbkI7QUFDQSxXQUFJYyxXQUFXZCxPQUFPLEtBQXRCOztBQUVBLGNBQU8sSUFBSWUsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjs7QUFFdEM7QUFDQSxhQUFJLEVBQUUsaUJBQWlCUCxNQUFuQixDQUFKLEVBQ0E7QUFDRVEsbUJBQVFDLEdBQVIsQ0FBWSxxQkFBWjtBQUNBLGtCQUFPRixPQUFPTixNQUFQLENBQVA7QUFDRDs7QUFFRFMsZUFBTVAsS0FBTixFQUFhZCxJQUFiLENBQW1CLG9CQUFZO0FBQzdCLGtCQUFPc0IsU0FBU0MsV0FBVCxFQUFQO0FBQ0QsVUFGRCxFQUdDdkIsSUFIRCxDQUdNLGtCQUFVOztBQUVkWSxrQkFBT1ksVUFBUCxHQUFvQkMsTUFBcEI7O0FBRUFkLGtCQUFPZSxNQUFQLEdBQWdCQyxTQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWhCO0FBQ0FqQixrQkFBT2tCLFNBQVAsR0FBbUIsSUFBSUMsS0FBSixDQUFVLE1BQVYsQ0FBbkI7O0FBRUFuQixrQkFBT2UsTUFBUCxDQUFjSyxnQkFBZCxDQUErQixNQUEvQixFQUF1QyxZQUFNO0FBQzNDZCxxQkFBUUwsTUFBUjtBQUNELFlBRkQ7O0FBSUFELGtCQUFPZSxNQUFQLENBQWNNLEdBQWQsR0FBb0IsZ0JBQXBCO0FBQ0FMLG9CQUFTTSxJQUFULENBQWNDLFdBQWQsQ0FBMEJ2QixPQUFPZSxNQUFqQztBQUVELFVBakJEO0FBbUJELFFBNUJNLENBQVA7QUE4QkQ7Ozs7OzttQkExQ2tCYixVIiwiZmlsZSI6Im1haW4uYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTE4YTg2N2VlYzUxNjlmZmE4ZjIiLCJcbmltcG9ydCBXYXNtTG9hZGVyIGZyb20gJy4vV2FzbUxvYWRlcic7XG5cbmxldCB3ID0gbmV3IFdhc21Mb2FkZXIoKTtcblxudy5sb2FkKFwiLi93YXNtL3Rlc3RcIikudGhlbigod2FzbSkgPT4ge1xuXG4gIC8vIC8vIGZpbGwgaGVhcFxuICAvLyBmb3IgKGxldCB0PTA7IHQ8IDEwMDsgdCsrKVxuICAvLyB7XG4gIC8vICAgd2FzbS5IRUFQMzJbdF0gPSB0O1xuICAvLyB9XG5cbiAgY29uc3QgSU5UMzJfU0laRSA9IDQ7XG4gIGxldCBudW1JbnQzMiA9IDU7XG5cbiAgbGV0IHRlc3RBcnJheSA9IG5ldyBJbnQzMkFycmF5KFsxMCwxMSwxMiwxMywxNF0pO1xuXG4gIGxldCBwdHIgPSB3YXNtLl9tYWxsb2MobnVtSW50MzIgKiBJTlQzMl9TSVpFKTtcblxuICB3YXNtLkhFQVAzMi5zZXQodGVzdEFycmF5LCBwdHIgLyBJTlQzMl9TSVpFKTtcblxuICAvL2NvbnNvbGUubG9nKFwiTW9kdWxlLi4uXCIsIE1vZHVsZSk7XG5cbiAgd2FzbS5fYWRkT25lKHB0cik7XG5cbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbWFpbi5qcyIsIlxuXG53aW5kb3cuTW9kdWxlID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhc21Mb2FkZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG5cbiAgfVxuXG4gIGxvYWQod2FzbSlcbiAge1xuICAgIGxldCBfd2FzbSA9IHdhc20gKyBcIi53YXNtXCI7XG4gICAgbGV0IF9pbXBvcnRzID0gd2FzbSArIFwiLmpzXCI7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAvLyBXQVNNIG5vdCBzdXBwb3J0ZWQsIGVuZFxuICAgICAgaWYgKCEoJ1dlYkFzc2VtYmx5JyBpbiB3aW5kb3cpKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvYWQgV0FTTScpO1xuICAgICAgICByZXR1cm4gcmVqZWN0KE1vZHVsZSk7XG4gICAgICB9XG5cbiAgICAgIGZldGNoKF93YXNtKS50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGJ1ZmZlciA9PiB7XG5cbiAgICAgICAgTW9kdWxlLndhc21CaW5hcnkgPSBidWZmZXI7XG5cbiAgICAgICAgd2luZG93LnNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICB3aW5kb3cuZG9uZUV2ZW50ID0gbmV3IEV2ZW50KCdkb25lJyk7XG5cbiAgICAgICAgd2luZG93LnNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdkb25lJywgKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoTW9kdWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LnNjcmlwdC5zcmMgPSAnLi93YXNtL3Rlc3QuanMnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdpbmRvdy5zY3JpcHQpO1xuXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vV2FzbUxvYWRlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=