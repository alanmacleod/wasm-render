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
	
	var _BootLoader = __webpack_require__(1);
	
	var _BootLoader2 = _interopRequireDefault(_BootLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var b = new _BootLoader2.default();
	
	b.load("./wasm/test").then(function (wasm) {
	
	  wasm._addOne(1);
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
	
	var BootLoader = function () {
	  function BootLoader() {
	    _classCallCheck(this, BootLoader);
	  }
	
	  _createClass(BootLoader, [{
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
	
	  return BootLoader;
	}();
	
	exports.default = BootLoader;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzY0YzNhZmUyM2QxOGM0NzExZjIiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9Cb290TG9hZGVyLmpzIl0sIm5hbWVzIjpbImIiLCJsb2FkIiwidGhlbiIsIndhc20iLCJfYWRkT25lIiwid2luZG93IiwiTW9kdWxlIiwiQm9vdExvYWRlciIsIl93YXNtIiwiX2ltcG9ydHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaCIsInJlc3BvbnNlIiwiYXJyYXlCdWZmZXIiLCJ3YXNtQmluYXJ5IiwiYnVmZmVyIiwic2NyaXB0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZG9uZUV2ZW50IiwiRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic3JjIiwiYm9keSIsImFwcGVuZENoaWxkIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDckNBOzs7Ozs7QUFFQSxLQUFJQSxJQUFJLDBCQUFSOztBQUVBQSxHQUFFQyxJQUFGLENBQU8sYUFBUCxFQUFzQkMsSUFBdEIsQ0FBMkIsVUFBQ0MsSUFBRCxFQUFVOztBQUVuQ0EsUUFBS0MsT0FBTCxDQUFhLENBQWI7QUFFRCxFQUpELEU7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQUMsUUFBT0MsTUFBUCxHQUFnQixFQUFoQjs7S0FFcUJDLFU7QUFFbkIseUJBQ0E7QUFBQTtBQUVDOzs7OzBCQUVJSixJLEVBQ0w7QUFDRSxXQUFJSyxRQUFRTCxPQUFPLE9BQW5CO0FBQ0EsV0FBSU0sV0FBV04sT0FBTyxLQUF0Qjs7QUFFQSxjQUFPLElBQUlPLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7O0FBRXRDO0FBQ0EsYUFBSSxFQUFFLGlCQUFpQlAsTUFBbkIsQ0FBSixFQUNBO0FBQ0VRLG1CQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDQSxrQkFBT0YsT0FBT04sTUFBUCxDQUFQO0FBQ0Q7O0FBRURTLGVBQU1QLEtBQU4sRUFBYU4sSUFBYixDQUFtQixvQkFBWTtBQUM3QixrQkFBT2MsU0FBU0MsV0FBVCxFQUFQO0FBQ0QsVUFGRCxFQUdDZixJQUhELENBR00sa0JBQVU7O0FBRWRJLGtCQUFPWSxVQUFQLEdBQW9CQyxNQUFwQjs7QUFFQWQsa0JBQU9lLE1BQVAsR0FBZ0JDLFNBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEI7QUFDQWpCLGtCQUFPa0IsU0FBUCxHQUFtQixJQUFJQyxLQUFKLENBQVUsTUFBVixDQUFuQjs7QUFFQW5CLGtCQUFPZSxNQUFQLENBQWNLLGdCQUFkLENBQStCLE1BQS9CLEVBQXVDLFlBQU07QUFDM0NkLHFCQUFRTCxNQUFSO0FBQ0QsWUFGRDs7QUFJQUQsa0JBQU9lLE1BQVAsQ0FBY00sR0FBZCxHQUFvQixnQkFBcEI7QUFDQUwsb0JBQVNNLElBQVQsQ0FBY0MsV0FBZCxDQUEwQnZCLE9BQU9lLE1BQWpDO0FBRUQsVUFqQkQ7QUFtQkQsUUE1Qk0sQ0FBUDtBQThCRDs7Ozs7O21CQTFDa0JiLFUiLCJmaWxlIjoibWFpbi5idWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NjRjM2FmZTIzZDE4YzQ3MTFmMiIsIlxuaW1wb3J0IEJvb3RMb2FkZXIgZnJvbSAnLi9Cb290TG9hZGVyJztcblxubGV0IGIgPSBuZXcgQm9vdExvYWRlcigpO1xuXG5iLmxvYWQoXCIuL3dhc20vdGVzdFwiKS50aGVuKCh3YXNtKSA9PiB7XG5cbiAgd2FzbS5fYWRkT25lKDEpO1xuXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCJcblxud2luZG93Lk1vZHVsZSA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb290TG9hZGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuXG4gIH1cblxuICBsb2FkKHdhc20pXG4gIHtcbiAgICBsZXQgX3dhc20gPSB3YXNtICsgXCIud2FzbVwiO1xuICAgIGxldCBfaW1wb3J0cyA9IHdhc20gKyBcIi5qc1wiO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgLy8gV0FTTSBub3Qgc3VwcG9ydGVkLCBlbmRcbiAgICAgIGlmICghKCdXZWJBc3NlbWJseScgaW4gd2luZG93KSlcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2FkIFdBU00nKTtcbiAgICAgICAgcmV0dXJuIHJlamVjdChNb2R1bGUpO1xuICAgICAgfVxuXG4gICAgICBmZXRjaChfd2FzbSkudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihidWZmZXIgPT4ge1xuXG4gICAgICAgIE1vZHVsZS53YXNtQmluYXJ5ID0gYnVmZmVyO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgd2luZG93LmRvbmVFdmVudCA9IG5ldyBFdmVudCgnZG9uZScpO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZG9uZScsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKE1vZHVsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5zY3JpcHQuc3JjID0gJy4vd2FzbS90ZXN0LmpzJztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3aW5kb3cuc2NyaXB0KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0Jvb3RMb2FkZXIuanMiXSwic291cmNlUm9vdCI6IiJ9