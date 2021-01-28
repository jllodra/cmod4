// var performance = {};
// performance.now = Date.now;

// var crypto;

// const crypto = { getRandomValues: () => (Math.random()*256)|0 };

const crypto = {
  getRandomValues: (array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = (Math.random() * 256) | 0;
    }
  }
};

/////

// (function () {
//   'use strict';
//
//   function createCommonjsModule(fn, module) {
//     return module = { exports: {} }, fn(module, module.exports), module.exports;
//   }
//
//   var jschacha20 = createCommonjsModule(function (module) {
//     /*
//      * Copyright (c) 2017, Bubelich Mykola
//      * https, 0x//www.bubelich.com
//      *
//      * (｡◕‿‿◕｡)
//      *
//      * All rights reserved.
//      *
//      * Redistribution and use in source and binary forms, with or without
//      * modification, are permitted provided that the following conditions are met, 0x
//      *
//      * Redistributions of source code must retain the above copyright notice,
//      * this list of conditions and the following disclaimer.
//      *
//      * Redistributions in binary form must reproduce the above copyright notice,
//      * this list of conditions and the following disclaimer in the documentation
//      * and/or other materials provided with the distribution.
//      *
//      * Neither the name of the copyright holder nor the names of its contributors
//      * may be used to endorse or promote products derived from this software without
//      * specific prior written permission.
//      *
//      * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND CONTRIBUTORS "AS IS"
//      * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//      * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//      * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
//      * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//      * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//      * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//      * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//      * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//      * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//      * POSSIBILITY OF SUCH DAMAGE.
//      *
//      * ChaCha20 is a stream cipher designed by D. J. Bernstein.
//      * It is a refinement of the Salsa20 algorithm, and it uses a 256-bit key.
//      *
//      * ChaCha20 successively calls the ChaCha20 block function, with the same key and nonce, and with successively increasing block counter parameters.
//      * ChaCha20 then serializes the resulting state by writing the numbers in little-endian order, creating a keystream block.
//      *
//      * Concatenating the keystream blocks from the successive blocks forms a keystream.
//      * The ChaCha20 function then performs an XOR of this keystream with the plaintext.
//      * Alternatively, each keystream block can be XORed with a plaintext block before proceeding to create the next block, saving some memory.
//      * There is no requirement for the plaintext to be an integral multiple of 512 bits.  If there is extra keystream from the last block, it is discarded.
//      *
//      * The inputs to ChaCha20 are
//      * - 256-bit key
//      * - 32-bit initial counter
//      * - 96-bit nonce.  In some protocols, this is known as the Initialization Vector
//      * - Arbitrary-length plaintext
//      *
//      * Implementation derived from chacha-ref.c version 20080118
//      * See for details, 0x http, 0x//cr.yp.to/chacha/chacha-20080128.pdf
//      */
//
//     /**
//      *
//      * @param {Uint8Array} key
//      * @param {Uint8Array} nonce
//      * @param {number} counter
//      * @throws {Error}
//      *
//      * @constructor
//      */
//     var JSChaCha20 = function (key, nonce, counter) {
//       if (typeof counter === 'undefined') {
//         counter = 0;
//       }
//
//       if (!(key instanceof Uint8Array) || key.length !== 32) {
//         throw new Error('Key should be 32 byte array!')
//       }
//
//       if (!(nonce instanceof Uint8Array) || nonce.length !== 12) {
//         throw new Error('Nonce should be 12 byte array!')
//       }
//
//       this._rounds = 20;
//       // Constants
//       this._sigma = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];
//
//       // param construction
//       this._param = [
//         this._sigma[0],
//         this._sigma[1],
//         this._sigma[2],
//         this._sigma[3],
//         // key
//         this._get32(key, 0),
//         this._get32(key, 4),
//         this._get32(key, 8),
//         this._get32(key, 12),
//         this._get32(key, 16),
//         this._get32(key, 20),
//         this._get32(key, 24),
//         this._get32(key, 28),
//         // counter
//         counter,
//         // nonce
//         this._get32(nonce, 0),
//         this._get32(nonce, 4),
//         this._get32(nonce, 8)
//       ];
//
//       // init 64 byte keystream block //
//       this._keystream = [
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
//       ];
//
//       // internal byte counter //
//       this._byteCounter = 0;
//     };
//
//     JSChaCha20.prototype._chacha = function () {
//       var mix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//       var i = 0;
//       var b = 0;
//
//       // copy param array to mix //
//       for (i = 0; i < 16; i++) {
//         mix[i] = this._param[i];
//       }
//
//       // mix rounds //
//       for (i = 0; i < this._rounds; i += 2) {
//         this._quarterround(mix, 0, 4, 8, 12);
//         this._quarterround(mix, 1, 5, 9, 13);
//         this._quarterround(mix, 2, 6, 10, 14);
//         this._quarterround(mix, 3, 7, 11, 15);
//
//         this._quarterround(mix, 0, 5, 10, 15);
//         this._quarterround(mix, 1, 6, 11, 12);
//         this._quarterround(mix, 2, 7, 8, 13);
//         this._quarterround(mix, 3, 4, 9, 14);
//       }
//
//       for (i = 0; i < 16; i++) {
//         // add
//         mix[i] += this._param[i];
//
//         // store keystream
//         this._keystream[b++] = mix[i] & 0xFF;
//         this._keystream[b++] = (mix[i] >>> 8) & 0xFF;
//         this._keystream[b++] = (mix[i] >>> 16) & 0xFF;
//         this._keystream[b++] = (mix[i] >>> 24) & 0xFF;
//       }
//     };
//
//     /**
//      * The basic operation of the ChaCha algorithm is the quarter round.
//      * It operates on four 32-bit unsigned integers, denoted a, b, c, and d.
//      *
//      * @param {Array} output
//      * @param {number} a
//      * @param {number} b
//      * @param {number} c
//      * @param {number} d
//      * @private
//      */
//     JSChaCha20.prototype._quarterround = function (output, a, b, c, d) {
//       output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 16);
//       output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 12);
//       output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 8);
//       output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 7);
//
//       // JavaScript hack to make UINT32 :) //
//       output[a] >>>= 0;
//       output[b] >>>= 0;
//       output[c] >>>= 0;
//       output[d] >>>= 0;
//     };
//
//     /**
//      * Little-endian to uint 32 bytes
//      *
//      * @param {Uint8Array|[number]} data
//      * @param {number} index
//      * @return {number}
//      * @private
//      */
//     JSChaCha20.prototype._get32 = function (data, index) {
//       return data[index++] ^ (data[index++] << 8) ^ (data[index++] << 16) ^ (data[index] << 24)
//     };
//
//     /**
//      * Cyclic left rotation
//      *
//      * @param {number} data
//      * @param {number} shift
//      * @return {number}
//      * @private
//      */
//     JSChaCha20.prototype._rotl = function (data, shift) {
//       return ((data << shift) | (data >>> (32 - shift)))
//     };
//
//     /**
//      *  Encrypt data with key and nonce
//      *
//      * @param {Uint8Array} data
//      * @return {Uint8Array}
//      */
//     JSChaCha20.prototype.encrypt = function (data) {
//       return this._update(data)
//     };
//
//     /**
//      *  Decrypt data with key and nonce
//      *
//      * @param {Uint8Array} data
//      * @return {Uint8Array}
//      */
//     JSChaCha20.prototype.decrypt = function (data) {
//       return this._update(data)
//     };
//
//     /**
//      *  Encrypt or Decrypt data with key and nonce
//      *
//      * @param {Uint8Array} data
//      * @return {Uint8Array}
//      * @private
//      */
//     JSChaCha20.prototype._update = function (data) {
//       if (!(data instanceof Uint8Array) || data.length === 0) {
//         throw new Error('Data should be type of bytes (Uint8Array) and not empty!')
//       }
//
//       var output = new Uint8Array(data.length);
//
//       // core function, build block and xor with input data //
//       for (var i = 0; i < data.length; i++) {
//         if (this._byteCounter === 0 || this._byteCounter === 64) {
//           // generate new block //
//
//           this._chacha();
//           // counter increment //
//           this._param[12]++;
//
//           // reset internal counter //
//           this._byteCounter = 0;
//         }
//
//         output[i] = data[i] ^ this._keystream[this._byteCounter++];
//       }
//
//       return output
//     };
//
//     // EXPORT //
//     if (module.exports) {
//       module.exports = JSChaCha20;
//     }
//   });
//
//   // if (typeof window.crypto == "undefined") {
//     const rand = makeRand();
//     crypto = {
//       getRandomValues(typedArray) {
//         for (let i = 0; i < typedArray.length; i++) {
//           typedArray[i] = rand(typedArray.BYTES_PER_ELEMENT);
//         }
//       }
//     };
//   // }
//
//   function makeRand() {
//     // weakRand is used to generate start values.
//     // The don't have to be "securely" random, but merely unpredictable.
//     function weakRand(size) {
//       let buf = new Uint8Array(size);
//       for (let i = 0; i < size; i++) {
//         buf[i] = Math.round(Math.random() * 256);
//       }
//       return buf;
//     }
//     const key = weakRand(32);
//     const nonce = weakRand(12);
//     const counter = 1;
//     const chacha = new jschacha20(key, nonce, counter);
//
//     // We will use the same buffer for keeping pre-generated bytes.
//     // Start with a buffer of simply anything, as it will be turned into noise anyway.
//     let buffer = new Uint8Array(Array(64).fill(1));
//
//     // Pos is the number of invalid buffer bytes.
//     let pos = buffer.length;
//
//     // Returns a new random byte.
//     function getByte() {
//       // If all bytes in the buffer have been invalidated, generate a new one.
//       if (pos >= buffer.length) {
//         buffer = chacha.encrypt(buffer);
//         pos = 0;
//       }
//       return buffer[pos++];
//     }
//
//     // Returns a new random integer of the given size in bytes.
//     return function(size) {
//       if (size < 1 || size > 16) {
//         throw new Error("Invalid size argument: " + size);
//       }
//       let result = 0;
//       while (size > 0) {
//         size--;
//         result = (result << 8) | getByte();
//       }
//       return result;
//     };
//   }
//
// }());


/////

var libopenmpt = (function () {
  var _scriptDir = import.meta.url;

  return (
    function (libopenmpt) {
      libopenmpt = libopenmpt || {};

      var Module = typeof libopenmpt !== "undefined" ? libopenmpt : {};
      var readyPromiseResolve, readyPromiseReject;
      Module["ready"] = new Promise(function (resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject
      });
      var moduleOverrides = {};
      var key;
      for (key in Module) {
        if (Module.hasOwnProperty(key)) {
          moduleOverrides[key] = Module[key]
        }
      }
      var arguments_ = [];
      var thisProgram = "./this.program";
      var quit_ = function (status, toThrow) {
        throw toThrow
      };
      var ENVIRONMENT_IS_WEB = false;
      var ENVIRONMENT_IS_WORKER = false;
      var ENVIRONMENT_IS_NODE = false;
      var ENVIRONMENT_IS_SHELL = false;
      ENVIRONMENT_IS_WEB = typeof window === "object";
      ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
      ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
      ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
      var scriptDirectory = "";

      function locateFile(path) {
        if (Module["locateFile"]) {
          return Module["locateFile"](path, scriptDirectory)
        }
        return scriptDirectory + path
      }

      var read_, readAsync, readBinary, setWindowTitle;
      var nodeFS;
      var nodePath;
      if (ENVIRONMENT_IS_NODE) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = require("path").dirname(scriptDirectory) + "/"
        } else {
          scriptDirectory = __dirname + "/"
        }
        read_ = function shell_read(filename, binary) {
          var ret = tryParseAsDataURI(filename);
          if (ret) {
            return binary ? ret : ret.toString()
          }
          if (!nodeFS) nodeFS = require("fs");
          if (!nodePath) nodePath = require("path");
          filename = nodePath["normalize"](filename);
          return nodeFS["readFileSync"](filename, binary ? null : "utf8")
        };
        readBinary = function readBinary(filename) {
          var ret = read_(filename, true);
          if (!ret.buffer) {
            ret = new Uint8Array(ret)
          }
          assert(ret.buffer);
          return ret
        };
        if (process["argv"].length > 1) {
          thisProgram = process["argv"][1].replace(/\\/g, "/")
        }
        arguments_ = process["argv"].slice(2);
        process["on"]("uncaughtException", function (ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex
          }
        });
        process["on"]("unhandledRejection", abort);
        quit_ = function (status) {
          process["exit"](status)
        };
        Module["inspect"] = function () {
          return "[Emscripten Module object]"
        }
      } else if (ENVIRONMENT_IS_SHELL) {
        if (typeof read != "undefined") {
          read_ = function shell_read(f) {
            var data = tryParseAsDataURI(f);
            if (data) {
              return intArrayToString(data)
            }
            return read(f)
          }
        }
        readBinary = function readBinary(f) {
          var data;
          data = tryParseAsDataURI(f);
          if (data) {
            return data
          }
          if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f))
          }
          data = read(f, "binary");
          assert(typeof data === "object");
          return data
        };
        if (typeof scriptArgs != "undefined") {
          arguments_ = scriptArgs
        } else if (typeof arguments != "undefined") {
          arguments_ = arguments
        }
        if (typeof quit === "function") {
          quit_ = function (status) {
            quit(status)
          }
        }
        if (typeof print !== "undefined") {
          if (typeof console === "undefined") console = {};
          console.log = print;
          console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
        }
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href
        } else if (typeof document !== "undefined" && document.currentScript) {
          scriptDirectory = document.currentScript.src
        }
        if (_scriptDir) {
          scriptDirectory = _scriptDir
        }
        if (scriptDirectory.indexOf("blob:") !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
        } else {
          scriptDirectory = ""
        }
        {
          read_ = function (url) {
            try {
              var xhr = new XMLHttpRequest;
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText
            } catch (err) {
              var data = tryParseAsDataURI(url);
              if (data) {
                return intArrayToString(data)
              }
              throw err
            }
          };
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = function (url) {
              try {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response)
              } catch (err) {
                var data = tryParseAsDataURI(url);
                if (data) {
                  return data
                }
                throw err
              }
            }
          }
          readAsync = function (url, onload, onerror) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function () {
              if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return
              }
              var data = tryParseAsDataURI(url);
              if (data) {
                onload(data.buffer);
                return
              }
              onerror()
            };
            xhr.onerror = onerror;
            xhr.send(null)
          }
        }
        setWindowTitle = function (title) {
          document.title = title
        }
      } else {
      }
      var out = Module["print"] || console.log.bind(console);
      var err = Module["printErr"] || console.warn.bind(console);
      for (key in moduleOverrides) {
        if (moduleOverrides.hasOwnProperty(key)) {
          Module[key] = moduleOverrides[key]
        }
      }
      moduleOverrides = null;
      if (Module["arguments"]) arguments_ = Module["arguments"];
      if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
      if (Module["quit"]) quit_ = Module["quit"];
      var STACK_ALIGN = 16;

      function alignMemory(size, factor) {
        if (!factor) factor = STACK_ALIGN;
        return Math.ceil(size / factor) * factor
      }

      var tempRet0 = 0;
      var setTempRet0 = function (value) {
        tempRet0 = value
      };
      var getTempRet0 = function () {
        return tempRet0
      };
      var wasmBinary;
      if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
      var noExitRuntime;
      if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
      if (typeof WebAssembly !== "object") {
        abort("no native wasm support detected")
      }
      var wasmMemory;
      var ABORT = false;
      var EXITSTATUS;

      function assert(condition, text) {
        if (!condition) {
          abort("Assertion failed: " + text)
        }
      }

      var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

      function UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
          return UTF8Decoder.decode(heap.subarray(idx, endPtr))
        } else {
          var str = "";
          while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0)
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
          }
        }
        return str
      }

      function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
      }

      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
          }
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
          } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
          }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx
      }

      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
      }

      function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
          if (u <= 127) ++len; else if (u <= 2047) len += 2; else if (u <= 65535) len += 3; else len += 4
        }
        return len
      }

      function writeArrayToMemory(array, buffer) {
        HEAP8.set(array, buffer)
      }

      function writeAsciiToMemory(str, buffer, dontAddNull) {
        for (var i = 0; i < str.length; ++i) {
          HEAP8[buffer++ >> 0] = str.charCodeAt(i)
        }
        if (!dontAddNull) HEAP8[buffer >> 0] = 0
      }

      function alignUp(x, multiple) {
        if (x % multiple > 0) {
          x += multiple - x % multiple
        }
        return x
      }

      var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module["HEAP8"] = HEAP8 = new Int8Array(buf);
        Module["HEAP16"] = HEAP16 = new Int16Array(buf);
        Module["HEAP32"] = HEAP32 = new Int32Array(buf);
        Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
        Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
        Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
        Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
        Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
      }

      var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
      var wasmTable;
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATMAIN__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      __ATINIT__.push({
        func: function () {
          ___wasm_call_ctors()
        }
      });

      function preRun() {
        if (Module["preRun"]) {
          if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
          while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
          }
        }
        callRuntimeCallbacks(__ATPRERUN__)
      }

      function initRuntime() {
        runtimeInitialized = true;
        if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
        TTY.init();
        callRuntimeCallbacks(__ATINIT__)
      }

      function preMain() {
        FS.ignorePermissions = false;
        callRuntimeCallbacks(__ATMAIN__)
      }

      function postRun() {
        if (Module["postRun"]) {
          if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
          while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__)
      }

      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb)
      }

      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb)
      }

      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;

      function getUniqueRunDependency(id) {
        return id
      }

      function addRunDependency(id) {
        runDependencies++;
        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies)
        }
      }

      function removeRunDependency(id) {
        runDependencies--;
        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies)
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
          }
        }
      }

      Module["preloadedImages"] = {};
      Module["preloadedAudios"] = {};

      function abort(what) {
        if (Module["onAbort"]) {
          Module["onAbort"](what)
        }
        what += "";
        err(what);
        ABORT = true;
        EXITSTATUS = 1;
        what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e
      }

      function hasPrefix(str, prefix) {
        return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
      }

      var dataURIPrefix = "data:application/octet-stream;base64,";

      function isDataURI(filename) {
        return hasPrefix(filename, dataURIPrefix)
      }

      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile)
      }

      function getBinary(file) {
        try {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary)
          }
          var binary = tryParseAsDataURI(file);
          if (binary) {
            return binary
          }
          if (readBinary) {
            return readBinary(file)
          } else {
            throw"sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)"
          }
        } catch (err) {
          abort(err)
        }
      }

      function instantiateSync(file, info) {
        var instance;
        var module;
        var binary;
        try {
          binary = getBinary(file);
          module = new WebAssembly.Module(binary);
          instance = new WebAssembly.Instance(module, info)
        } catch (e) {
          var str = e.toString();
          err("failed to compile wasm module: " + str);
          if (str.indexOf("imported Memory") >= 0 || str.indexOf("memory import") >= 0) {
            err("Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time).")
          }
          throw e
        }
        return [instance, module]
      }

      function createWasm() {
        var info = {"a": asmLibraryArg};

        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module["asm"] = exports;
          wasmMemory = Module["asm"]["wa"];
          updateGlobalBufferAndViews(wasmMemory.buffer);
          wasmTable = Module["asm"]["xa"];
          removeRunDependency("wasm-instantiate")
        }

        addRunDependency("wasm-instantiate");
        if (Module["instantiateWasm"]) {
          try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports
          } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
          }
        }
        var result = instantiateSync(wasmBinaryFile, info);
        receiveInstance(result[0], result[1]);
        return Module["asm"]
      }

      var tempDouble;
      var tempI64;

      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback == "function") {
            callback(Module);
            continue
          }
          var func = callback.func;
          if (typeof func === "number") {
            if (callback.arg === undefined) {
              wasmTable.get(func)()
            } else {
              wasmTable.get(func)(callback.arg)
            }
          } else {
            func(callback.arg === undefined ? null : callback.arg)
          }
        }
      }

      function ___assert_fail(condition, filename, line, func) {
        abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
      }

      var ExceptionInfoAttrs = {
        DESTRUCTOR_OFFSET: 0,
        REFCOUNT_OFFSET: 4,
        TYPE_OFFSET: 8,
        CAUGHT_OFFSET: 12,
        RETHROWN_OFFSET: 13,
        SIZE: 16
      };

      function ___cxa_allocate_exception(size) {
        return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE
      }

      function ExceptionInfo(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
        this.set_type = function (type) {
          HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2] = type
        };
        this.get_type = function () {
          return HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2]
        };
        this.set_destructor = function (destructor) {
          HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2] = destructor
        };
        this.get_destructor = function () {
          return HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2]
        };
        this.set_refcount = function (refcount) {
          HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = refcount
        };
        this.set_caught = function (caught) {
          caught = caught ? 1 : 0;
          HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] = caught
        };
        this.get_caught = function () {
          return HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] != 0
        };
        this.set_rethrown = function (rethrown) {
          rethrown = rethrown ? 1 : 0;
          HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] = rethrown
        };
        this.get_rethrown = function () {
          return HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] != 0
        };
        this.init = function (type, destructor) {
          this.set_type(type);
          this.set_destructor(destructor);
          this.set_refcount(0);
          this.set_caught(false);
          this.set_rethrown(false)
        };
        this.add_ref = function () {
          var value = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
          HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = value + 1
        };
        this.release_ref = function () {
          var prev = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
          HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = prev - 1;
          return prev === 1
        }
      }

      function CatchInfo(ptr) {
        this.free = function () {
          _free(this.ptr);
          this.ptr = 0
        };
        this.set_base_ptr = function (basePtr) {
          HEAP32[this.ptr >> 2] = basePtr
        };
        this.get_base_ptr = function () {
          return HEAP32[this.ptr >> 2]
        };
        this.set_adjusted_ptr = function (adjustedPtr) {
          var ptrSize = 4;
          HEAP32[this.ptr + ptrSize >> 2] = adjustedPtr
        };
        this.get_adjusted_ptr = function () {
          var ptrSize = 4;
          return HEAP32[this.ptr + ptrSize >> 2]
        };
        this.get_exception_ptr = function () {
          var isPointer = ___cxa_is_pointer_type(this.get_exception_info().get_type());
          if (isPointer) {
            return HEAP32[this.get_base_ptr() >> 2]
          }
          var adjusted = this.get_adjusted_ptr();
          if (adjusted !== 0) return adjusted;
          return this.get_base_ptr()
        };
        this.get_exception_info = function () {
          return new ExceptionInfo(this.get_base_ptr())
        };
        if (ptr === undefined) {
          this.ptr = _malloc(8);
          this.set_adjusted_ptr(0)
        } else {
          this.ptr = ptr
        }
      }

      var exceptionCaught = [];

      function exception_addRef(info) {
        info.add_ref()
      }

      var uncaughtExceptionCount = 0;

      function ___cxa_begin_catch(ptr) {
        var catchInfo = new CatchInfo(ptr);
        var info = catchInfo.get_exception_info();
        if (!info.get_caught()) {
          info.set_caught(true);
          uncaughtExceptionCount--
        }
        info.set_rethrown(false);
        exceptionCaught.push(catchInfo);
        exception_addRef(info);
        return catchInfo.get_exception_ptr()
      }

      var exceptionLast = 0;

      function ___cxa_free_exception(ptr) {
        return _free(new ExceptionInfo(ptr).ptr)
      }

      function exception_decRef(info) {
        if (info.release_ref() && !info.get_rethrown()) {
          var destructor = info.get_destructor();
          if (destructor) {
            wasmTable.get(destructor)(info.excPtr)
          }
          ___cxa_free_exception(info.excPtr)
        }
      }

      function ___cxa_end_catch() {
        _setThrew(0);
        var catchInfo = exceptionCaught.pop();
        exception_decRef(catchInfo.get_exception_info());
        catchInfo.free();
        exceptionLast = 0
      }

      function ___resumeException(catchInfoPtr) {
        var catchInfo = new CatchInfo(catchInfoPtr);
        var ptr = catchInfo.get_base_ptr();
        if (!exceptionLast) {
          exceptionLast = ptr
        }
        catchInfo.free();
        throw ptr
      }

      function ___cxa_find_matching_catch_17() {
        var thrown = exceptionLast;
        if (!thrown) {
          setTempRet0(0 | 0);
          return 0 | 0
        }
        var info = new ExceptionInfo(thrown);
        var thrownType = info.get_type();
        var catchInfo = new CatchInfo;
        catchInfo.set_base_ptr(thrown);
        if (!thrownType) {
          setTempRet0(0 | 0);
          return catchInfo.ptr | 0
        }
        var typeArray = Array.prototype.slice.call(arguments);
        var stackTop = stackSave();
        var exceptionThrowBuf = stackAlloc(4);
        HEAP32[exceptionThrowBuf >> 2] = thrown;
        for (var i = 0; i < typeArray.length; i++) {
          var caughtType = typeArray[i];
          if (caughtType === 0 || caughtType === thrownType) {
            break
          }
          if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
            var adjusted = HEAP32[exceptionThrowBuf >> 2];
            if (thrown !== adjusted) {
              catchInfo.set_adjusted_ptr(adjusted)
            }
            setTempRet0(caughtType | 0);
            return catchInfo.ptr | 0
          }
        }
        stackRestore(stackTop);
        setTempRet0(thrownType | 0);
        return catchInfo.ptr | 0
      }

      function ___cxa_find_matching_catch_2() {
        var thrown = exceptionLast;
        if (!thrown) {
          setTempRet0(0 | 0);
          return 0 | 0
        }
        var info = new ExceptionInfo(thrown);
        var thrownType = info.get_type();
        var catchInfo = new CatchInfo;
        catchInfo.set_base_ptr(thrown);
        if (!thrownType) {
          setTempRet0(0 | 0);
          return catchInfo.ptr | 0
        }
        var typeArray = Array.prototype.slice.call(arguments);
        var stackTop = stackSave();
        var exceptionThrowBuf = stackAlloc(4);
        HEAP32[exceptionThrowBuf >> 2] = thrown;
        for (var i = 0; i < typeArray.length; i++) {
          var caughtType = typeArray[i];
          if (caughtType === 0 || caughtType === thrownType) {
            break
          }
          if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
            var adjusted = HEAP32[exceptionThrowBuf >> 2];
            if (thrown !== adjusted) {
              catchInfo.set_adjusted_ptr(adjusted)
            }
            setTempRet0(caughtType | 0);
            return catchInfo.ptr | 0
          }
        }
        stackRestore(stackTop);
        setTempRet0(thrownType | 0);
        return catchInfo.ptr | 0
      }

      function ___cxa_find_matching_catch_3() {
        var thrown = exceptionLast;
        if (!thrown) {
          setTempRet0(0 | 0);
          return 0 | 0
        }
        var info = new ExceptionInfo(thrown);
        var thrownType = info.get_type();
        var catchInfo = new CatchInfo;
        catchInfo.set_base_ptr(thrown);
        if (!thrownType) {
          setTempRet0(0 | 0);
          return catchInfo.ptr | 0
        }
        var typeArray = Array.prototype.slice.call(arguments);
        var stackTop = stackSave();
        var exceptionThrowBuf = stackAlloc(4);
        HEAP32[exceptionThrowBuf >> 2] = thrown;
        for (var i = 0; i < typeArray.length; i++) {
          var caughtType = typeArray[i];
          if (caughtType === 0 || caughtType === thrownType) {
            break
          }
          if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
            var adjusted = HEAP32[exceptionThrowBuf >> 2];
            if (thrown !== adjusted) {
              catchInfo.set_adjusted_ptr(adjusted)
            }
            setTempRet0(caughtType | 0);
            return catchInfo.ptr | 0
          }
        }
        stackRestore(stackTop);
        setTempRet0(thrownType | 0);
        return catchInfo.ptr | 0
      }

      function ___cxa_find_matching_catch_4() {
        var thrown = exceptionLast;
        if (!thrown) {
          setTempRet0(0 | 0);
          return 0 | 0
        }
        var info = new ExceptionInfo(thrown);
        var thrownType = info.get_type();
        var catchInfo = new CatchInfo;
        catchInfo.set_base_ptr(thrown);
        if (!thrownType) {
          setTempRet0(0 | 0);
          return catchInfo.ptr | 0
        }
        var typeArray = Array.prototype.slice.call(arguments);
        var stackTop = stackSave();
        var exceptionThrowBuf = stackAlloc(4);
        HEAP32[exceptionThrowBuf >> 2] = thrown;
        for (var i = 0; i < typeArray.length; i++) {
          var caughtType = typeArray[i];
          if (caughtType === 0 || caughtType === thrownType) {
            break
          }
          if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
            var adjusted = HEAP32[exceptionThrowBuf >> 2];
            if (thrown !== adjusted) {
              catchInfo.set_adjusted_ptr(adjusted)
            }
            setTempRet0(caughtType | 0);
            return catchInfo.ptr | 0
          }
        }
        stackRestore(stackTop);
        setTempRet0(thrownType | 0);
        return catchInfo.ptr | 0
      }

      function ___cxa_find_matching_catch_6() {
        var thrown = exceptionLast;
        if (!thrown) {
          setTempRet0(0 | 0);
          return 0 | 0
        }
        var info = new ExceptionInfo(thrown);
        var thrownType = info.get_type();
        var catchInfo = new CatchInfo;
        catchInfo.set_base_ptr(thrown);
        if (!thrownType) {
          setTempRet0(0 | 0);
          return catchInfo.ptr | 0
        }
        var typeArray = Array.prototype.slice.call(arguments);
        var stackTop = stackSave();
        var exceptionThrowBuf = stackAlloc(4);
        HEAP32[exceptionThrowBuf >> 2] = thrown;
        for (var i = 0; i < typeArray.length; i++) {
          var caughtType = typeArray[i];
          if (caughtType === 0 || caughtType === thrownType) {
            break
          }
          if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
            var adjusted = HEAP32[exceptionThrowBuf >> 2];
            if (thrown !== adjusted) {
              catchInfo.set_adjusted_ptr(adjusted)
            }
            setTempRet0(caughtType | 0);
            return catchInfo.ptr | 0
          }
        }
        stackRestore(stackTop);
        setTempRet0(thrownType | 0);
        return catchInfo.ptr | 0
      }

      function ___cxa_rethrow() {
        var catchInfo = exceptionCaught.pop();
        if (!catchInfo) {
          abort("no exception to throw")
        }
        var info = catchInfo.get_exception_info();
        var ptr = catchInfo.get_base_ptr();
        if (!info.get_rethrown()) {
          exceptionCaught.push(catchInfo);
          info.set_rethrown(true);
          info.set_caught(false);
          uncaughtExceptionCount++
        } else {
          catchInfo.free()
        }
        exceptionLast = ptr;
        throw ptr
      }

      function ___cxa_throw(ptr, type, destructor) {
        var info = new ExceptionInfo(ptr);
        info.init(type, destructor);
        exceptionLast = ptr;
        uncaughtExceptionCount++;
        throw ptr
      }

      function ___cxa_uncaught_exceptions() {
        return uncaughtExceptionCount
      }

      function _abort() {
        abort()
      }

      var _emscripten_get_now;
      if (ENVIRONMENT_IS_NODE) {
        _emscripten_get_now = function () {
          var t = process["hrtime"]();
          return t[0] * 1e3 + t[1] / 1e6
        }
      } else if (typeof dateNow !== "undefined") {
        _emscripten_get_now = dateNow
      } else _emscripten_get_now = function () {
        return performance.now()
      };
      var _emscripten_get_now_is_monotonic = true;

      function setErrNo(value) {
        HEAP32[___errno_location() >> 2] = value;
        return value
      }

      function _clock_gettime(clk_id, tp) {
        var now;
        if (clk_id === 0) {
          now = Date.now()
        } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
          now = _emscripten_get_now()
        } else {
          setErrNo(28);
          return -1
        }
        HEAP32[tp >> 2] = now / 1e3 | 0;
        HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
        return 0
      }

      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num)
      }

      function _emscripten_get_heap_size() {
        return HEAPU8.length
      }

      function emscripten_realloc_buffer(size) {
        try {
          wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
          updateGlobalBufferAndViews(wasmMemory.buffer);
          return 1
        } catch (e) {
        }
      }

      function _emscripten_resize_heap(requestedSize) {
        requestedSize = requestedSize >>> 0;
        var oldSize = _emscripten_get_heap_size();
        var maxHeapSize = 2147483648;
        if (requestedSize > maxHeapSize) {
          return false
        }
        var minHeapSize = 16777216;
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), 65536));
          var replacement = emscripten_realloc_buffer(newSize);
          if (replacement) {
            return true
          }
        }
        return false
      }

      var ENV = {};

      function getExecutableName() {
        return thisProgram || "./this.program"
      }

      function getEnvStrings() {
        if (!getEnvStrings.strings) {
          var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
          var env = {
            "USER": "web_user",
            "LOGNAME": "web_user",
            "PATH": "/",
            "PWD": "/",
            "HOME": "/home/web_user",
            "LANG": lang,
            "_": getExecutableName()
          };
          for (var x in ENV) {
            env[x] = ENV[x]
          }
          var strings = [];
          for (var x in env) {
            strings.push(x + "=" + env[x])
          }
          getEnvStrings.strings = strings
        }
        return getEnvStrings.strings
      }

      var PATH = {
        splitPath: function (filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1)
        }, normalizeArray: function (parts, allowAboveRoot) {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1)
            } else if (last === "..") {
              parts.splice(i, 1);
              up++
            } else if (up) {
              parts.splice(i, 1);
              up--
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..")
            }
          }
          return parts
        }, normalize: function (path) {
          var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter(function (p) {
            return !!p
          }), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = "."
          }
          if (path && trailingSlash) {
            path += "/"
          }
          return (isAbsolute ? "/" : "") + path
        }, dirname: function (path) {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) {
            return "."
          }
          if (dir) {
            dir = dir.substr(0, dir.length - 1)
          }
          return root + dir
        }, basename: function (path) {
          if (path === "/") return "/";
          path = PATH.normalize(path);
          path = path.replace(/\/$/, "");
          var lastSlash = path.lastIndexOf("/");
          if (lastSlash === -1) return path;
          return path.substr(lastSlash + 1)
        }, extname: function (path) {
          return PATH.splitPath(path)[3]
        }, join: function () {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join("/"))
        }, join2: function (l, r) {
          return PATH.normalize(l + "/" + r)
        }
      };

      function getRandomDevice() {
        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
          var randomBuffer = new Uint8Array(1);
          return function () {
            return crypto.getRandomValues(randomBuffer);
            return randomBuffer[0]
          }
        } else if (ENVIRONMENT_IS_NODE) {
          try {
            var crypto_module = require("crypto");
            return function () {
              return crypto_module["randomBytes"](1)[0]
            }
          } catch (e) {
          }
        }
        return function () {
          abort("randomDevice")
        }
      }

      var PATH_FS = {
        resolve: function () {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
              throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
              return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function (p) {
            return !!p
          }), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
        }, relative: function (from, to) {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);

          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
          }

          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/")
        }
      };
      var TTY = {
        ttys: [], init: function () {
        }, shutdown: function () {
        }, register: function (dev, ops) {
          TTY.ttys[dev] = {input: [], output: [], ops: ops};
          FS.registerDevice(dev, TTY.stream_ops)
        }, stream_ops: {
          open: function (stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
              throw new FS.ErrnoError(43)
            }
            stream.tty = tty;
            stream.seekable = false
          }, close: function (stream) {
            stream.tty.ops.flush(stream.tty)
          }, flush: function (stream) {
            stream.tty.ops.flush(stream.tty)
          }, read: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
              throw new FS.ErrnoError(60)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = stream.tty.ops.get_char(stream.tty)
              } catch (e) {
                throw new FS.ErrnoError(29)
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6)
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now()
            }
            return bytesRead
          }, write: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
              throw new FS.ErrnoError(60)
            }
            try {
              for (var i = 0; i < length; i++) {
                stream.tty.ops.put_char(stream.tty, buffer[offset + i])
              }
            } catch (e) {
              throw new FS.ErrnoError(29)
            }
            if (length) {
              stream.node.timestamp = Date.now()
            }
            return i
          }
        }, default_tty_ops: {
          get_char: function (tty) {
            if (!tty.input.length) {
              var result = null;
              if (ENVIRONMENT_IS_NODE) {
                var BUFSIZE = 256;
                var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
                var bytesRead = 0;
                try {
                  bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null)
                } catch (e) {
                  if (e.toString().indexOf("EOF") != -1) bytesRead = 0; else throw e
                }
                if (bytesRead > 0) {
                  result = buf.slice(0, bytesRead).toString("utf-8")
                } else {
                  result = null
                }
              } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                result = window.prompt("Input: ");
                if (result !== null) {
                  result += "\n"
                }
              } else if (typeof readline == "function") {
                result = readline();
                if (result !== null) {
                  result += "\n"
                }
              }
              if (!result) {
                return null
              }
              tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
          }, put_char: function (tty, val) {
            if (val === null || val === 10) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            } else {
              if (val != 0) tty.output.push(val)
            }
          }, flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            }
          }
        }, default_tty1_ops: {
          put_char: function (tty, val) {
            if (val === null || val === 10) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            } else {
              if (val != 0) tty.output.push(val)
            }
          }, flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            }
          }
        }
      };

      function mmapAlloc(size) {
        var alignedSize = alignMemory(size, 16384);
        var ptr = _malloc(alignedSize);
        while (size < alignedSize) HEAP8[ptr + size++] = 0;
        return ptr
      }

      var MEMFS = {
        ops_table: null, mount: function (mount) {
          return MEMFS.createNode(null, "/", 16384 | 511, 0)
        }, createNode: function (parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63)
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                }, stream: {llseek: MEMFS.stream_ops.llseek}
              },
              file: {
                node: {getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr},
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                }, stream: {}
              },
              chrdev: {
                node: {getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr},
                stream: FS.chrdev_stream_ops
              }
            }
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
          }
          node.timestamp = Date.now();
          if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp
          }
          return node
        }, getFileDataAsRegularArray: function (node) {
          if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
            return arr
          }
          return node.contents
        }, getFileDataAsTypedArray: function (node) {
          if (!node.contents) return new Uint8Array(0);
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
          return new Uint8Array(node.contents)
        }, expandFileStorage: function (node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return;
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity);
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          return
        }, resizeFileStorage: function (node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return
          }
          if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize;
            return
          }
          if (!node.contents) node.contents = [];
          if (node.contents.length > newSize) node.contents.length = newSize; else while (node.contents.length < newSize) node.contents.push(0);
          node.usedBytes = newSize
        }, node_ops: {
          getattr: function (node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
              attr.size = 4096
            } else if (FS.isFile(node.mode)) {
              attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
              attr.size = node.link.length
            } else {
              attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
          }, setattr: function (node, attr) {
            if (attr.mode !== undefined) {
              node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
              node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
              MEMFS.resizeFileStorage(node, attr.size)
            }
          }, lookup: function (parent, name) {
            throw FS.genericErrors[44]
          }, mknod: function (parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
          }, rename: function (old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name)
              } catch (e) {
              }
              if (new_node) {
                for (var i in new_node.contents) {
                  throw new FS.ErrnoError(55)
                }
              }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now();
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
            old_node.parent = new_dir
          }, unlink: function (parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now()
          }, rmdir: function (parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
              throw new FS.ErrnoError(55)
            }
            delete parent.contents[name];
            parent.timestamp = Date.now()
          }, readdir: function (node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
              if (!node.contents.hasOwnProperty(key)) {
                continue
              }
              entries.push(key)
            }
            return entries
          }, symlink: function (parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
          }, readlink: function (node) {
            if (!FS.isLink(node.mode)) {
              throw new FS.ErrnoError(28)
            }
            return node.link
          }
        }, stream_ops: {
          read: function (stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            if (size > 8 && contents.subarray) {
              buffer.set(contents.subarray(position, position + size), offset)
            } else {
              for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
          }, write: function (stream, buffer, offset, length, position, canOwn) {
            if (buffer.buffer === HEAP8.buffer) {
              canOwn = false
            }
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
              if (canOwn) {
                node.contents = buffer.subarray(offset, offset + length);
                node.usedBytes = length;
                return length
              } else if (node.usedBytes === 0 && position === 0) {
                node.contents = buffer.slice(offset, offset + length);
                node.usedBytes = length;
                return length
              } else if (position + length <= node.usedBytes) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
                return length
              }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
              node.contents.set(buffer.subarray(offset, offset + length), position)
            } else {
              for (var i = 0; i < length; i++) {
                node.contents[position + i] = buffer[offset + i]
              }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
          }, llseek: function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
              position += stream.position
            } else if (whence === 2) {
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.usedBytes
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(28)
            }
            return position
          }, allocate: function (stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
          }, mmap: function (stream, address, length, position, prot, flags) {
            if (address !== 0) {
              throw new FS.ErrnoError(28)
            }
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents.buffer === buffer) {
              allocated = false;
              ptr = contents.byteOffset
            } else {
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length)
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length)
                }
              }
              allocated = true;
              ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48)
              }
              HEAP8.set(contents, ptr)
            }
            return {ptr: ptr, allocated: allocated}
          }, msync: function (stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43)
            }
            if (mmapFlags & 2) {
              return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
          }
        }
      };
      var FS = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: false,
        ignorePermissions: true,
        trackingDelegate: {},
        tracking: {openFlags: {READ: 1, WRITE: 2}},
        ErrnoError: null,
        genericErrors: {},
        filesystems: null,
        syncFSRequests: 0,
        lookupPath: function (path, opts) {
          path = PATH_FS.resolve(FS.cwd(), path);
          opts = opts || {};
          if (!path) return {path: "", node: null};
          var defaults = {follow_mount: true, recurse_count: 0};
          for (var key in defaults) {
            if (opts[key] === undefined) {
              opts[key] = defaults[key]
            }
          }
          if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32)
          }
          var parts = PATH.normalizeArray(path.split("/").filter(function (p) {
            return !!p
          }), false);
          var current = FS.root;
          var current_path = "/";
          for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
              break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
              if (!islast || islast && opts.follow_mount) {
                current = current.mounted.root
              }
            }
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                var lookup = FS.lookupPath(current_path, {recurse_count: opts.recurse_count});
                current = lookup.node;
                if (count++ > 40) {
                  throw new FS.ErrnoError(32)
                }
              }
            }
          }
          return {path: current_path, node: current}
        },
        getPath: function (node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
          }
        },
        hashName: function (parentid, name) {
          var hash = 0;
          for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
          }
          return (parentid + hash >>> 0) % FS.nameTable.length
        },
        hashAddNode: function (node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node
        },
        hashRemoveNode: function (node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break
              }
              current = current.name_next
            }
          }
        },
        lookupNode: function (parent, name) {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode, parent)
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node
            }
          }
          return FS.lookup(parent, name)
        },
        createNode: function (parent, name, mode, rdev) {
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node
        },
        destroyNode: function (node) {
          FS.hashRemoveNode(node)
        },
        isRoot: function (node) {
          return node === node.parent
        },
        isMountpoint: function (node) {
          return !!node.mounted
        },
        isFile: function (mode) {
          return (mode & 61440) === 32768
        },
        isDir: function (mode) {
          return (mode & 61440) === 16384
        },
        isLink: function (mode) {
          return (mode & 61440) === 40960
        },
        isChrdev: function (mode) {
          return (mode & 61440) === 8192
        },
        isBlkdev: function (mode) {
          return (mode & 61440) === 24576
        },
        isFIFO: function (mode) {
          return (mode & 61440) === 4096
        },
        isSocket: function (mode) {
          return (mode & 49152) === 49152
        },
        flagModes: {"r": 0, "r+": 2, "w": 577, "w+": 578, "a": 1089, "a+": 1090},
        modeStringToFlags: function (str) {
          var flags = FS.flagModes[str];
          if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
          }
          return flags
        },
        flagsToPermissionString: function (flag) {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) {
            perms += "w"
          }
          return perms
        },
        nodePermissions: function (node, perms) {
          if (FS.ignorePermissions) {
            return 0
          }
          if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return 2
          } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return 2
          } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return 2
          }
          return 0
        },
        mayLookup: function (dir) {
          var errCode = FS.nodePermissions(dir, "x");
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0
        },
        mayCreate: function (dir, name) {
          try {
            var node = FS.lookupNode(dir, name);
            return 20
          } catch (e) {
          }
          return FS.nodePermissions(dir, "wx")
        },
        mayDelete: function (dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name)
          } catch (e) {
            return e.errno
          }
          var errCode = FS.nodePermissions(dir, "wx");
          if (errCode) {
            return errCode
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 31
            }
          }
          return 0
        },
        mayOpen: function (node, flags) {
          if (!node) {
            return 44
          }
          if (FS.isLink(node.mode)) {
            return 32
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
              return 31
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
        },
        MAX_OPEN_FDS: 4096,
        nextfd: function (fd_start, fd_end) {
          fd_start = fd_start || 0;
          fd_end = fd_end || FS.MAX_OPEN_FDS;
          for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
              return fd
            }
          }
          throw new FS.ErrnoError(33)
        },
        getStream: function (fd) {
          return FS.streams[fd]
        },
        createStream: function (stream, fd_start, fd_end) {
          if (!FS.FSStream) {
            FS.FSStream = function () {
            };
            FS.FSStream.prototype = {
              object: {
                get: function () {
                  return this.node
                }, set: function (val) {
                  this.node = val
                }
              }, isRead: {
                get: function () {
                  return (this.flags & 2097155) !== 1
                }
              }, isWrite: {
                get: function () {
                  return (this.flags & 2097155) !== 0
                }
              }, isAppend: {
                get: function () {
                  return this.flags & 1024
                }
              }
            }
          }
          var newStream = new FS.FSStream;
          for (var p in stream) {
            newStream[p] = stream[p]
          }
          stream = newStream;
          var fd = FS.nextfd(fd_start, fd_end);
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream
        },
        closeStream: function (fd) {
          FS.streams[fd] = null
        },
        chrdev_stream_ops: {
          open: function (stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream)
            }
          }, llseek: function () {
            throw new FS.ErrnoError(70)
          }
        },
        major: function (dev) {
          return dev >> 8
        },
        minor: function (dev) {
          return dev & 255
        },
        makedev: function (ma, mi) {
          return ma << 8 | mi
        },
        registerDevice: function (dev, ops) {
          FS.devices[dev] = {stream_ops: ops}
        },
        getDevice: function (dev) {
          return FS.devices[dev]
        },
        getMounts: function (mount) {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
          }
          return mounts
        },
        syncfs: function (populate, callback) {
          if (typeof populate === "function") {
            callback = populate;
            populate = false
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) {
            err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
          }
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;

          function doCallback(errCode) {
            FS.syncFSRequests--;
            return callback(errCode)
          }

          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode)
              }
              return
            }
            if (++completed >= mounts.length) {
              doCallback(null)
            }
          }

          mounts.forEach(function (mount) {
            if (!mount.type.syncfs) {
              return done(null)
            }
            mount.type.syncfs(mount, populate, done)
          })
        },
        mount: function (type, opts, mountpoint) {
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) {
            throw new FS.ErrnoError(10)
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10)
            }
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54)
            }
          }
          var mount = {type: type, opts: opts, mountpoint: mountpoint, mounts: []};
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) {
            FS.root = mountRoot
          } else if (node) {
            node.mounted = mount;
            if (node.mount) {
              node.mount.mounts.push(mount)
            }
          }
          return mountRoot
        },
        unmount: function (mountpoint) {
          var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28)
          }
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          Object.keys(FS.nameTable).forEach(function (hash) {
            var current = FS.nameTable[hash];
            while (current) {
              var next = current.name_next;
              if (mounts.indexOf(current.mount) !== -1) {
                FS.destroyNode(current)
              }
              current = next
            }
          });
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          node.mount.mounts.splice(idx, 1)
        },
        lookup: function (parent, name) {
          return parent.node_ops.lookup(parent, name)
        },
        mknod: function (path, mode, dev) {
          var lookup = FS.lookupPath(path, {parent: true});
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28)
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63)
          }
          return parent.node_ops.mknod(parent, name, mode, dev)
        },
        create: function (path, mode) {
          mode = mode !== undefined ? mode : 438;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0)
        },
        mkdir: function (path, mode) {
          mode = mode !== undefined ? mode : 511;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0)
        },
        mkdirTree: function (path, mode) {
          var dirs = path.split("/");
          var d = "";
          for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
              FS.mkdir(d, mode)
            } catch (e) {
              if (e.errno != 20) throw e
            }
          }
        },
        mkdev: function (path, mode, dev) {
          if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev)
        },
        symlink: function (oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44)
          }
          var lookup = FS.lookupPath(newpath, {parent: true});
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44)
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63)
          }
          return parent.node_ops.symlink(parent, newname, oldpath)
        },
        rename: function (old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          lookup = FS.lookupPath(old_path, {parent: true});
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, {parent: true});
          new_dir = lookup.node;
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75)
          }
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28)
          }
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55)
          }
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name)
          } catch (e) {
          }
          if (old_node === new_node) {
            return
          }
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10)
          }
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode)
            }
          }
          try {
            if (FS.trackingDelegate["willMovePath"]) {
              FS.trackingDelegate["willMovePath"](old_path, new_path)
            }
          } catch (e) {
            err("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
          } catch (e) {
            throw e
          } finally {
            FS.hashAddNode(old_node)
          }
          try {
            if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path)
          } catch (e) {
            err("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
          }
        },
        rmdir: function (path) {
          var lookup = FS.lookupPath(path, {parent: true});
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
          }
          try {
            if (FS.trackingDelegate["willDeletePath"]) {
              FS.trackingDelegate["willDeletePath"](path)
            }
          } catch (e) {
            err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
          try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
          } catch (e) {
            err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
          }
        },
        readdir: function (path) {
          var lookup = FS.lookupPath(path, {follow: true});
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54)
          }
          return node.node_ops.readdir(node)
        },
        unlink: function (path) {
          var lookup = FS.lookupPath(path, {parent: true});
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
          }
          try {
            if (FS.trackingDelegate["willDeletePath"]) {
              FS.trackingDelegate["willDeletePath"](path)
            }
          } catch (e) {
            err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
          try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
          } catch (e) {
            err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
          }
        },
        readlink: function (path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44)
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28)
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
        },
        stat: function (path, dontFollow) {
          var lookup = FS.lookupPath(path, {follow: !dontFollow});
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(44)
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63)
          }
          return node.node_ops.getattr(node)
        },
        lstat: function (path) {
          return FS.stat(path, true)
        },
        chmod: function (path, mode, dontFollow) {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {follow: !dontFollow});
            node = lookup.node
          } else {
            node = path
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
          }
          node.node_ops.setattr(node, {mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now()})
        },
        lchmod: function (path, mode) {
          FS.chmod(path, mode, true)
        },
        fchmod: function (fd, mode) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8)
          }
          FS.chmod(stream.node, mode)
        },
        chown: function (path, uid, gid, dontFollow) {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {follow: !dontFollow});
            node = lookup.node
          } else {
            node = path
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
          }
          node.node_ops.setattr(node, {timestamp: Date.now()})
        },
        lchown: function (path, uid, gid) {
          FS.chown(path, uid, gid, true)
        },
        fchown: function (fd, uid, gid) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8)
          }
          FS.chown(stream.node, uid, gid)
        },
        truncate: function (path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(28)
          }
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {follow: true});
            node = lookup.node
          } else {
            node = path
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31)
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28)
          }
          var errCode = FS.nodePermissions(node, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          node.node_ops.setattr(node, {size: len, timestamp: Date.now()})
        },
        ftruncate: function (fd, len) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8)
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28)
          }
          FS.truncate(stream.node, len)
        },
        utime: function (path, atime, mtime) {
          var lookup = FS.lookupPath(path, {follow: true});
          var node = lookup.node;
          node.node_ops.setattr(node, {timestamp: Math.max(atime, mtime)})
        },
        open: function (path, flags, mode, fd_start, fd_end) {
          if (path === "") {
            throw new FS.ErrnoError(44)
          }
          flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
          mode = typeof mode === "undefined" ? 438 : mode;
          if (flags & 64) {
            mode = mode & 4095 | 32768
          } else {
            mode = 0
          }
          var node;
          if (typeof path === "object") {
            node = path
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, {follow: !(flags & 131072)});
              node = lookup.node
            } catch (e) {
            }
          }
          var created = false;
          if (flags & 64) {
            if (node) {
              if (flags & 128) {
                throw new FS.ErrnoError(20)
              }
            } else {
              node = FS.mknod(path, mode, 0);
              created = true
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44)
          }
          if (FS.isChrdev(node.mode)) {
            flags &= ~512
          }
          if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
          }
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode)
            }
          }
          if (flags & 512) {
            FS.truncate(node, 0)
          }
          flags &= ~(128 | 512 | 131072);
          var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
          }, fd_start, fd_end);
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
          }
          if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
              err("FS.trackingDelegate error on read file: " + path)
            }
          }
          try {
            if (FS.trackingDelegate["onOpenFile"]) {
              var trackingFlags = 0;
              if ((flags & 2097155) !== 1) {
                trackingFlags |= FS.tracking.openFlags.READ
              }
              if ((flags & 2097155) !== 0) {
                trackingFlags |= FS.tracking.openFlags.WRITE
              }
              FS.trackingDelegate["onOpenFile"](path, trackingFlags)
            }
          } catch (e) {
            err("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
          }
          return stream
        },
        close: function (stream) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if (stream.getdents) stream.getdents = null;
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream)
            }
          } catch (e) {
            throw e
          } finally {
            FS.closeStream(stream.fd)
          }
          stream.fd = null
        },
        isClosed: function (stream) {
          return stream.fd === null
        },
        llseek: function (stream, offset, whence) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70)
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28)
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position
        },
        read: function (stream, buffer, offset, length, position) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8)
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28)
          }
          var seeking = typeof position !== "undefined";
          if (!seeking) {
            position = stream.position
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead
        },
        write: function (stream, buffer, offset, length, position, canOwn) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28)
          }
          if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
          }
          var seeking = typeof position !== "undefined";
          if (!seeking) {
            position = stream.position
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path)
          } catch (e) {
            err("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message)
          }
          return bytesWritten
        },
        allocate: function (stream, offset, length) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28)
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43)
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138)
          }
          stream.stream_ops.allocate(stream, offset, length)
        },
        mmap: function (stream, address, length, position, prot, flags) {
          if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2)
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2)
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43)
          }
          return stream.stream_ops.mmap(stream, address, length, position, prot, flags)
        },
        msync: function (stream, buffer, offset, length, mmapFlags) {
          if (!stream || !stream.stream_ops.msync) {
            return 0
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
        },
        munmap: function (stream) {
          return 0
        },
        ioctl: function (stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59)
          }
          return stream.stream_ops.ioctl(stream, cmd, arg)
        },
        readFile: function (path, opts) {
          opts = opts || {};
          opts.flags = opts.flags || 0;
          opts.encoding = opts.encoding || "binary";
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
          } else if (opts.encoding === "binary") {
            ret = buf
          }
          FS.close(stream);
          return ret
        },
        writeFile: function (path, data, opts) {
          opts = opts || {};
          opts.flags = opts.flags || 577;
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
          } else {
            throw new Error("Unsupported data type")
          }
          FS.close(stream)
        },
        cwd: function () {
          return FS.currentPath
        },
        chdir: function (path) {
          var lookup = FS.lookupPath(path, {follow: true});
          if (lookup.node === null) {
            throw new FS.ErrnoError(44)
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54)
          }
          var errCode = FS.nodePermissions(lookup.node, "x");
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          FS.currentPath = lookup.path
        },
        createDefaultDirectories: function () {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user")
        },
        createDefaultDevices: function () {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), {
            read: function () {
              return 0
            }, write: function (stream, buffer, offset, length, pos) {
              return length
            }
          });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var random_device = getRandomDevice();
          FS.createDevice("/dev", "random", random_device);
          FS.createDevice("/dev", "urandom", random_device);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp")
        },
        createSpecialDirectories: function () {
          FS.mkdir("/proc");
          var proc_self = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({
            mount: function () {
              var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
              node.node_ops = {
                lookup: function (parent, name) {
                  var fd = +name;
                  var stream = FS.getStream(fd);
                  if (!stream) throw new FS.ErrnoError(8);
                  var ret = {
                    parent: null, mount: {mountpoint: "fake"}, node_ops: {
                      readlink: function () {
                        return stream.path
                      }
                    }
                  };
                  ret.parent = ret;
                  return ret
                }
              };
              return node
            }
          }, {}, "/proc/self/fd")
        },
        createStandardStreams: function () {
          if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
          } else {
            FS.symlink("/dev/tty", "/dev/stdin")
          }
          if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
          } else {
            FS.symlink("/dev/tty", "/dev/stdout")
          }
          if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
          } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
          }
          var stdin = FS.open("/dev/stdin", 0);
          var stdout = FS.open("/dev/stdout", 1);
          var stderr = FS.open("/dev/stderr", 1)
        },
        ensureErrnoError: function () {
          if (FS.ErrnoError) return;
          FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function (errno) {
              this.errno = errno
            };
            this.setErrno(errno);
            this.message = "FS error"
          };
          FS.ErrnoError.prototype = new Error;
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          [44].forEach(function (code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
          })
        },
        staticInit: function () {
          FS.ensureErrnoError();
          FS.nameTable = new Array(4096);
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
          FS.filesystems = {"MEMFS": MEMFS}
        },
        init: function (input, output, error) {
          FS.init.initialized = true;
          FS.ensureErrnoError();
          Module["stdin"] = input || Module["stdin"];
          Module["stdout"] = output || Module["stdout"];
          Module["stderr"] = error || Module["stderr"];
          FS.createStandardStreams()
        },
        quit: function () {
          FS.init.initialized = false;
          var fflush = Module["_fflush"];
          if (fflush) fflush(0);
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue
            }
            FS.close(stream)
          }
        },
        getMode: function (canRead, canWrite) {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode
        },
        findObject: function (path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (ret.exists) {
            return ret.object
          } else {
            return null
          }
        },
        analyzePath: function (path, dontResolveLastLink) {
          try {
            var lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
            path = lookup.path
          } catch (e) {
          }
          var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
          };
          try {
            var lookup = FS.lookupPath(path, {parent: true});
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
          } catch (e) {
            ret.error = e.errno
          }
          return ret
        },
        createPath: function (parent, path, canRead, canWrite) {
          parent = typeof parent === "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current)
            } catch (e) {
            }
            parent = current
          }
          return current
        },
        createFile: function (parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.create(path, mode)
        },
        createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
          var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
          var mode = FS.getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data === "string") {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
          }
          return node
        },
        createDevice: function (parent, name, input, output) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, {
            open: function (stream) {
              stream.seekable = false
            }, close: function (stream) {
              if (output && output.buffer && output.buffer.length) {
                output(10)
              }
            }, read: function (stream, buffer, offset, length, pos) {
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = input()
                } catch (e) {
                  throw new FS.ErrnoError(29)
                }
                if (result === undefined && bytesRead === 0) {
                  throw new FS.ErrnoError(6)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now()
              }
              return bytesRead
            }, write: function (stream, buffer, offset, length, pos) {
              for (var i = 0; i < length; i++) {
                try {
                  output(buffer[offset + i])
                } catch (e) {
                  throw new FS.ErrnoError(29)
                }
              }
              if (length) {
                stream.node.timestamp = Date.now()
              }
              return i
            }
          });
          return FS.mkdev(path, mode, dev)
        },
        forceLoadFile: function (obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
          } else if (read_) {
            try {
              obj.contents = intArrayFromString(read_(obj.url), true);
              obj.usedBytes = obj.contents.length
            } catch (e) {
              throw new FS.ErrnoError(29)
            }
          } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
          }
        },
        createLazyFile: function (parent, name, url, canRead, canWrite) {
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
          }

          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
          };
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
          };
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = function (from, to) {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
              var xhr = new XMLHttpRequest;
              xhr.open("GET", url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
              if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined")
              }
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || [])
              } else {
                return intArrayFromString(xhr.responseText || "", true)
              }
            };
            var lazyArray = this;
            lazyArray.setDataGetter(function (chunkNum) {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end)
              }
              if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
              return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
          };
          if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
              length: {
                get: function () {
                  if (!this.lengthKnown) {
                    this.cacheLength()
                  }
                  return this._length
                }
              }, chunkSize: {
                get: function () {
                  if (!this.lengthKnown) {
                    this.cacheLength()
                  }
                  return this._chunkSize
                }
              }
            });
            var properties = {isDevice: false, contents: lazyArray}
          } else {
            var properties = {isDevice: false, url: url}
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) {
            node.contents = properties.contents
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
          }
          Object.defineProperties(node, {
            usedBytes: {
              get: function () {
                return this.contents.length
              }
            }
          });
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach(function (key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
              FS.forceLoadFile(node);
              return fn.apply(null, arguments)
            }
          });
          stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            FS.forceLoadFile(node);
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i]
              }
            } else {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents.get(position + i)
              }
            }
            return size
          };
          node.stream_ops = stream_ops;
          return node
        },
        createPreloadedFile: function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
          Browser.init();
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency("cp " + fullname);

          function processData(byteArray) {
            function finish(byteArray) {
              if (preFinish) preFinish();
              if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
              }
              if (onload) onload();
              removeRunDependency(dep)
            }

            var handled = false;
            Module["preloadPlugins"].forEach(function (plugin) {
              if (handled) return;
              if (plugin["canHandle"](fullname)) {
                plugin["handle"](byteArray, fullname, finish, function () {
                  if (onerror) onerror();
                  removeRunDependency(dep)
                });
                handled = true
              }
            });
            if (!handled) finish(byteArray)
          }

          addRunDependency(dep);
          if (typeof url == "string") {
            Browser.asyncLoad(url, function (byteArray) {
              processData(byteArray)
            }, onerror)
          } else {
            processData(url)
          }
        },
        indexedDB: function () {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        },
        DB_NAME: function () {
          return "EM_FS_" + window.location.pathname
        },
        DB_VERSION: 20,
        DB_STORE_NAME: "FILE_DATA",
        saveFilesToDB: function (paths, onload, onerror) {
          onload = onload || function () {
          };
          onerror = onerror || function () {
          };
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
          } catch (e) {
            return onerror(e)
          }
          openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            out("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
          };
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;

            function finish() {
              if (fail == 0) onload(); else onerror()
            }

            paths.forEach(function (path) {
              var putRequest = files.put(FS.analyzePath(path).object.contents, path);
              putRequest.onsuccess = function putRequest_onsuccess() {
                ok++;
                if (ok + fail == total) finish()
              };
              putRequest.onerror = function putRequest_onerror() {
                fail++;
                if (ok + fail == total) finish()
              }
            });
            transaction.onerror = onerror
          };
          openRequest.onerror = onerror
        },
        loadFilesFromDB: function (paths, onload, onerror) {
          onload = onload || function () {
          };
          onerror = onerror || function () {
          };
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
          } catch (e) {
            return onerror(e)
          }
          openRequest.onupgradeneeded = onerror;
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
              var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
              onerror(e);
              return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;

            function finish() {
              if (fail == 0) onload(); else onerror()
            }

            paths.forEach(function (path) {
              var getRequest = files.get(path);
              getRequest.onsuccess = function getRequest_onsuccess() {
                if (FS.analyzePath(path).exists) {
                  FS.unlink(path)
                }
                FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                ok++;
                if (ok + fail == total) finish()
              };
              getRequest.onerror = function getRequest_onerror() {
                fail++;
                if (ok + fail == total) finish()
              }
            });
            transaction.onerror = onerror
          };
          openRequest.onerror = onerror
        }
      };
      var SYSCALLS = {
        mappings: {}, DEFAULT_POLLMASK: 5, umask: 511, calculateAt: function (dirfd, path) {
          if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd()
            } else {
              var dirstream = FS.getStream(dirfd);
              if (!dirstream) throw new FS.ErrnoError(8);
              dir = dirstream.path
            }
            path = PATH.join2(dir, path)
          }
          return path
        }, doStat: function (func, path, buf) {
          try {
            var stat = func(path)
          } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
              return -54
            }
            throw e
          }
          HEAP32[buf >> 2] = stat.dev;
          HEAP32[buf + 4 >> 2] = 0;
          HEAP32[buf + 8 >> 2] = stat.ino;
          HEAP32[buf + 12 >> 2] = stat.mode;
          HEAP32[buf + 16 >> 2] = stat.nlink;
          HEAP32[buf + 20 >> 2] = stat.uid;
          HEAP32[buf + 24 >> 2] = stat.gid;
          HEAP32[buf + 28 >> 2] = stat.rdev;
          HEAP32[buf + 32 >> 2] = 0;
          tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
          HEAP32[buf + 48 >> 2] = 4096;
          HEAP32[buf + 52 >> 2] = stat.blocks;
          HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
          HEAP32[buf + 60 >> 2] = 0;
          HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
          HEAP32[buf + 68 >> 2] = 0;
          HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
          HEAP32[buf + 76 >> 2] = 0;
          tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
          return 0
        }, doMsync: function (addr, stream, len, flags, offset) {
          var buffer = HEAPU8.slice(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags)
        }, doMkdir: function (path, mode) {
          path = PATH.normalize(path);
          if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
          FS.mkdir(path, mode, 0);
          return 0
        }, doMknod: function (path, mode, dev) {
          switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;
            default:
              return -28
          }
          FS.mknod(path, mode, dev);
          return 0
        }, doReadlink: function (path, buf, bufsize) {
          if (bufsize <= 0) return -28;
          var ret = FS.readlink(path);
          var len = Math.min(bufsize, lengthBytesUTF8(ret));
          var endChar = HEAP8[buf + len];
          stringToUTF8(ret, buf, bufsize + 1);
          HEAP8[buf + len] = endChar;
          return len
        }, doAccess: function (path, amode) {
          if (amode & ~7) {
            return -28
          }
          var node;
          var lookup = FS.lookupPath(path, {follow: true});
          node = lookup.node;
          if (!node) {
            return -44
          }
          var perms = "";
          if (amode & 4) perms += "r";
          if (amode & 2) perms += "w";
          if (amode & 1) perms += "x";
          if (perms && FS.nodePermissions(node, perms)) {
            return -2
          }
          return 0
        }, doDup: function (path, flags, suggestFD) {
          var suggest = FS.getStream(suggestFD);
          if (suggest) FS.close(suggest);
          return FS.open(path, flags, 0, suggestFD, suggestFD).fd
        }, doReadv: function (stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break
          }
          return ret
        }, doWritev: function (stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr
          }
          return ret
        }, varargs: undefined, get: function () {
          SYSCALLS.varargs += 4;
          var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret
        }, getStr: function (ptr) {
          var ret = UTF8ToString(ptr);
          return ret
        }, getStreamFromFD: function (fd) {
          var stream = FS.getStream(fd);
          if (!stream) throw new FS.ErrnoError(8);
          return stream
        }, get64: function (low, high) {
          return low
        }
      };

      function _environ_get(__environ, environ_buf) {
        try {
          var bufSize = 0;
          getEnvStrings().forEach(function (string, i) {
            var ptr = environ_buf + bufSize;
            HEAP32[__environ + i * 4 >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1
          });
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return e.errno
        }
      }

      function _environ_sizes_get(penviron_count, penviron_buf_size) {
        try {
          var strings = getEnvStrings();
          HEAP32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          strings.forEach(function (string) {
            bufSize += string.length + 1
          });
          HEAP32[penviron_buf_size >> 2] = bufSize;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return e.errno
        }
      }

      function _fd_close(fd) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          FS.close(stream);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return e.errno
        }
      }

      function _fd_read(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doReadv(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return e.errno
        }
      }

      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var HIGH_OFFSET = 4294967296;
          var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
          var DOUBLE_LIMIT = 9007199254740992;
          if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
            return -61
          }
          FS.llseek(stream, offset, whence);
          tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
          if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return e.errno
        }
      }

      function _fd_write(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doWritev(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return e.errno
        }
      }

      function _getTempRet0() {
        return getTempRet0() | 0
      }

      function _getentropy(buffer, size) {
        if (!_getentropy.randomDevice) {
          _getentropy.randomDevice = getRandomDevice()
        }
        for (var i = 0; i < size; i++) {
          HEAP8[buffer + i >> 0] = _getentropy.randomDevice()
        }
        return 0
      }

      function _llvm_eh_typeid_for(type) {
        return type
      }

      function _setTempRet0($i) {
        setTempRet0($i | 0)
      }

      function __isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
      }

      function __arraySum(array, index) {
        var sum = 0;
        for (var i = 0; i <= index; sum += array[i++]) {
        }
        return sum
      }

      var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      function __addDays(date, days) {
        var newDate = new Date(date.getTime());
        while (days > 0) {
          var leap = __isLeapYear(newDate.getFullYear());
          var currentMonth = newDate.getMonth();
          var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
          if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
              newDate.setMonth(currentMonth + 1)
            } else {
              newDate.setMonth(0);
              newDate.setFullYear(newDate.getFullYear() + 1)
            }
          } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
          }
        }
        return newDate
      }

      function _strftime(s, maxsize, format, tm) {
        var tm_zone = HEAP32[tm + 40 >> 2];
        var date = {
          tm_sec: HEAP32[tm >> 2],
          tm_min: HEAP32[tm + 4 >> 2],
          tm_hour: HEAP32[tm + 8 >> 2],
          tm_mday: HEAP32[tm + 12 >> 2],
          tm_mon: HEAP32[tm + 16 >> 2],
          tm_year: HEAP32[tm + 20 >> 2],
          tm_wday: HEAP32[tm + 24 >> 2],
          tm_yday: HEAP32[tm + 28 >> 2],
          tm_isdst: HEAP32[tm + 32 >> 2],
          tm_gmtoff: HEAP32[tm + 36 >> 2],
          tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
        };
        var pattern = UTF8ToString(format);
        var EXPANSION_RULES_1 = {
          "%c": "%a %b %d %H:%M:%S %Y",
          "%D": "%m/%d/%y",
          "%F": "%Y-%m-%d",
          "%h": "%b",
          "%r": "%I:%M:%S %p",
          "%R": "%H:%M",
          "%T": "%H:%M:%S",
          "%x": "%m/%d/%y",
          "%X": "%H:%M:%S",
          "%Ec": "%c",
          "%EC": "%C",
          "%Ex": "%m/%d/%y",
          "%EX": "%H:%M:%S",
          "%Ey": "%y",
          "%EY": "%Y",
          "%Od": "%d",
          "%Oe": "%e",
          "%OH": "%H",
          "%OI": "%I",
          "%Om": "%m",
          "%OM": "%M",
          "%OS": "%S",
          "%Ou": "%u",
          "%OU": "%U",
          "%OV": "%V",
          "%Ow": "%w",
          "%OW": "%W",
          "%Oy": "%y"
        };
        for (var rule in EXPANSION_RULES_1) {
          pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
        }
        var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        function leadingSomething(value, digits, character) {
          var str = typeof value === "number" ? value.toString() : value || "";
          while (str.length < digits) {
            str = character[0] + str
          }
          return str
        }

        function leadingNulls(value, digits) {
          return leadingSomething(value, digits, "0")
        }

        function compareByDay(date1, date2) {
          function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
          }

          var compare;
          if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
              compare = sgn(date1.getDate() - date2.getDate())
            }
          }
          return compare
        }

        function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0:
              return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
              return janFourth;
            case 2:
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
              return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(janFourth.getFullYear() - 1, 11, 30)
          }
        }

        function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear() + 1
            } else {
              return thisDate.getFullYear()
            }
          } else {
            return thisDate.getFullYear() - 1
          }
        }

        var EXPANSION_RULES_2 = {
          "%a": function (date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
          }, "%A": function (date) {
            return WEEKDAYS[date.tm_wday]
          }, "%b": function (date) {
            return MONTHS[date.tm_mon].substring(0, 3)
          }, "%B": function (date) {
            return MONTHS[date.tm_mon]
          }, "%C": function (date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
          }, "%d": function (date) {
            return leadingNulls(date.tm_mday, 2)
          }, "%e": function (date) {
            return leadingSomething(date.tm_mday, 2, " ")
          }, "%g": function (date) {
            return getWeekBasedYear(date).toString().substring(2)
          }, "%G": function (date) {
            return getWeekBasedYear(date)
          }, "%H": function (date) {
            return leadingNulls(date.tm_hour, 2)
          }, "%I": function (date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12; else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
          }, "%j": function (date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
          }, "%m": function (date) {
            return leadingNulls(date.tm_mon + 1, 2)
          }, "%M": function (date) {
            return leadingNulls(date.tm_min, 2)
          }, "%n": function () {
            return "\n"
          }, "%p": function (date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
              return "AM"
            } else {
              return "PM"
            }
          }, "%S": function (date) {
            return leadingNulls(date.tm_sec, 2)
          }, "%t": function () {
            return "\t"
          }, "%u": function (date) {
            return date.tm_wday || 7
          }, "%U": function (date) {
            var janFirst = new Date(date.tm_year + 1900, 0, 1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
              var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
              var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
              return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
          }, "%V": function (date) {
            var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
            var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
              return "53"
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
              return "01"
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
              daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
            } else {
              daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2)
          }, "%w": function (date) {
            return date.tm_wday
          }, "%W": function (date) {
            var janFirst = new Date(date.tm_year, 0, 1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
              var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
              var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
              return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
          }, "%y": function (date) {
            return (date.tm_year + 1900).toString().substring(2)
          }, "%Y": function (date) {
            return date.tm_year + 1900
          }, "%z": function (date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
          }, "%Z": function (date) {
            return date.tm_zone
          }, "%%": function () {
            return "%"
          }
        };
        for (var rule in EXPANSION_RULES_2) {
          if (pattern.indexOf(rule) >= 0) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
          }
        }
        var bytes = intArrayFromString(pattern, false);
        if (bytes.length > maxsize) {
          return 0
        }
        writeArrayToMemory(bytes, s);
        return bytes.length - 1
      }

      function _strftime_l(s, maxsize, format, tm) {
        return _strftime(s, maxsize, format, tm)
      }

      var FSNode = function (parent, name, mode, rdev) {
        if (!parent) {
          parent = this
        }
        this.parent = parent;
        this.mount = parent.mount;
        this.mounted = null;
        this.id = FS.nextInode++;
        this.name = name;
        this.mode = mode;
        this.node_ops = {};
        this.stream_ops = {};
        this.rdev = rdev
      };
      var readMode = 292 | 73;
      var writeMode = 146;
      Object.defineProperties(FSNode.prototype, {
        read: {
          get: function () {
            return (this.mode & readMode) === readMode
          }, set: function (val) {
            val ? this.mode |= readMode : this.mode &= ~readMode
          }
        }, write: {
          get: function () {
            return (this.mode & writeMode) === writeMode
          }, set: function (val) {
            val ? this.mode |= writeMode : this.mode &= ~writeMode
          }
        }, isFolder: {
          get: function () {
            return FS.isDir(this.mode)
          }
        }, isDevice: {
          get: function () {
            return FS.isChrdev(this.mode)
          }
        }
      });
      FS.FSNode = FSNode;
      FS.staticInit();
      var ASSERTIONS = false;

      function intArrayFromString(stringy, dontAddNull, length) {
        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        if (dontAddNull) u8array.length = numBytesWritten;
        return u8array
      }

      function intArrayToString(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
          var chr = array[i];
          if (chr > 255) {
            if (ASSERTIONS) {
              assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.")
            }
            chr &= 255
          }
          ret.push(String.fromCharCode(chr))
        }
        return ret.join("")
      }

      var decodeBase64 = typeof atob === "function" ? atob : function (input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = enc1 << 2 | enc2 >> 4;
          chr2 = (enc2 & 15) << 4 | enc3 >> 2;
          chr3 = (enc3 & 3) << 6 | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2)
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3)
          }
        } while (i < input.length);
        return output
      };

      function intArrayFromBase64(s) {
        if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
          var buf;
          try {
            buf = Buffer.from(s, "base64")
          } catch (_) {
            buf = new Buffer(s, "base64")
          }
          return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"])
        }
        try {
          var decoded = decodeBase64(s);
          var bytes = new Uint8Array(decoded.length);
          for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i)
          }
          return bytes
        } catch (_) {
          throw new Error("Converting base64 string to bytes failed.")
        }
      }

      function tryParseAsDataURI(filename) {
        if (!isDataURI(filename)) {
          return
        }
        return intArrayFromBase64(filename.slice(dataURIPrefix.length))
      }

      var asmLibraryArg = {
        "v": ___assert_fail,
        "p": ___cxa_allocate_exception,
        "m": ___cxa_begin_catch,
        "o": ___cxa_end_catch,
        "oa": ___cxa_find_matching_catch_17,
        "b": ___cxa_find_matching_catch_2,
        "g": ___cxa_find_matching_catch_3,
        "R": ___cxa_find_matching_catch_4,
        "na": ___cxa_find_matching_catch_6,
        "q": ___cxa_free_exception,
        "J": ___cxa_rethrow,
        "w": ___cxa_throw,
        "ea": ___cxa_uncaught_exceptions,
        "e": ___resumeException,
        "ja": _abort,
        "da": _clock_gettime,
        "ba": _emscripten_memcpy_big,
        "ca": _emscripten_resize_heap,
        "ha": _environ_get,
        "ia": _environ_sizes_get,
        "ma": _fd_close,
        "la": _fd_read,
        "T": _fd_seek,
        "L": _fd_write,
        "a": _getTempRet0,
        "fa": _getentropy,
        "va": invoke_dd,
        "z": invoke_di,
        "ta": invoke_did,
        "M": invoke_didi,
        "qa": invoke_dii,
        "C": invoke_diii,
        "P": invoke_fi,
        "D": invoke_fii,
        "K": invoke_fiii,
        "s": invoke_i,
        "O": invoke_id,
        "ua": invoke_if,
        "h": invoke_ii,
        "Q": invoke_iid,
        "c": invoke_iii,
        "i": invoke_iiii,
        "pa": invoke_iiiidd,
        "n": invoke_iiiii,
        "ka": invoke_iiiiid,
        "t": invoke_iiiiii,
        "y": invoke_iiiiiii,
        "I": invoke_iiiiiiii,
        "H": invoke_iiiiiiiiiiii,
        "W": invoke_iji,
        "X": invoke_ijii,
        "Y": invoke_ijiij,
        "_": invoke_ji,
        "S": invoke_jii,
        "V": invoke_jiii,
        "Z": invoke_jiiii,
        "k": invoke_v,
        "l": invoke_vi,
        "F": invoke_vid,
        "d": invoke_vii,
        "ra": invoke_viid,
        "sa": invoke_viidi,
        "N": invoke_viif,
        "f": invoke_viii,
        "j": invoke_viiii,
        "r": invoke_viiiii,
        "A": invoke_viiiiii,
        "x": invoke_viiiiiii,
        "B": invoke_viiiiiiiiii,
        "G": invoke_viiiiiiiiiiiiiii,
        "$": invoke_viiiji,
        "U": invoke_viiji,
        "aa": invoke_viijii,
        "u": _llvm_eh_typeid_for,
        "E": _setTempRet0,
        "ga": _strftime_l
      };
      var asm = createWasm();
      var ___wasm_call_ctors = Module["___wasm_call_ctors"] = asm["ya"];
      var _openmpt_get_library_version = Module["_openmpt_get_library_version"] = asm["za"];
      var _openmpt_get_core_version = Module["_openmpt_get_core_version"] = asm["Aa"];
      var _openmpt_free_string = Module["_openmpt_free_string"] = asm["Ba"];
      var _free = Module["_free"] = asm["Ca"];
      var _openmpt_get_string = Module["_openmpt_get_string"] = asm["Da"];
      var _openmpt_get_supported_extensions = Module["_openmpt_get_supported_extensions"] = asm["Ea"];
      var _openmpt_is_extension_supported = Module["_openmpt_is_extension_supported"] = asm["Fa"];
      var _openmpt_log_func_default = Module["_openmpt_log_func_default"] = asm["Ga"];
      var _openmpt_log_func_silent = Module["_openmpt_log_func_silent"] = asm["Ha"];
      var _openmpt_error_is_transient = Module["_openmpt_error_is_transient"] = asm["Ia"];
      var _openmpt_error_string = Module["_openmpt_error_string"] = asm["Ja"];
      var _openmpt_error_func_default = Module["_openmpt_error_func_default"] = asm["Ka"];
      var _openmpt_error_func_log = Module["_openmpt_error_func_log"] = asm["La"];
      var _openmpt_error_func_store = Module["_openmpt_error_func_store"] = asm["Ma"];
      var _openmpt_error_func_ignore = Module["_openmpt_error_func_ignore"] = asm["Na"];
      var _openmpt_error_func_errno = Module["_openmpt_error_func_errno"] = asm["Oa"];
      var _openmpt_error_func_errno_userdata = Module["_openmpt_error_func_errno_userdata"] = asm["Pa"];
      var _openmpt_could_open_probability = Module["_openmpt_could_open_probability"] = asm["Qa"];
      var _openmpt_could_open_probability2 = Module["_openmpt_could_open_probability2"] = asm["Ra"];
      var _openmpt_could_open_propability = Module["_openmpt_could_open_propability"] = asm["Sa"];
      var _openmpt_probe_file_header_get_recommended_size = Module["_openmpt_probe_file_header_get_recommended_size"] = asm["Ta"];
      var _openmpt_probe_file_header = Module["_openmpt_probe_file_header"] = asm["Ua"];
      var _openmpt_probe_file_header_without_filesize = Module["_openmpt_probe_file_header_without_filesize"] = asm["Va"];
      var _openmpt_probe_file_header_from_stream = Module["_openmpt_probe_file_header_from_stream"] = asm["Wa"];
      var _openmpt_module_create = Module["_openmpt_module_create"] = asm["Xa"];
      var _openmpt_module_create2 = Module["_openmpt_module_create2"] = asm["Ya"];
      var _openmpt_module_create_from_memory = Module["_openmpt_module_create_from_memory"] = asm["Za"];
      var _openmpt_module_create_from_memory2 = Module["_openmpt_module_create_from_memory2"] = asm["_a"];
      var _openmpt_module_destroy = Module["_openmpt_module_destroy"] = asm["$a"];
      var _openmpt_module_set_log_func = Module["_openmpt_module_set_log_func"] = asm["ab"];
      var _openmpt_module_set_error_func = Module["_openmpt_module_set_error_func"] = asm["bb"];
      var _openmpt_module_error_get_last = Module["_openmpt_module_error_get_last"] = asm["cb"];
      var _openmpt_module_error_get_last_message = Module["_openmpt_module_error_get_last_message"] = asm["db"];
      var _openmpt_module_error_set_last = Module["_openmpt_module_error_set_last"] = asm["eb"];
      var _openmpt_module_error_clear = Module["_openmpt_module_error_clear"] = asm["fb"];
      var _openmpt_module_select_subsong = Module["_openmpt_module_select_subsong"] = asm["gb"];
      var _openmpt_module_get_selected_subsong = Module["_openmpt_module_get_selected_subsong"] = asm["hb"];
      var _openmpt_module_set_repeat_count = Module["_openmpt_module_set_repeat_count"] = asm["ib"];
      var _openmpt_module_get_repeat_count = Module["_openmpt_module_get_repeat_count"] = asm["jb"];
      var _openmpt_module_get_duration_seconds = Module["_openmpt_module_get_duration_seconds"] = asm["kb"];
      var _openmpt_module_set_position_seconds = Module["_openmpt_module_set_position_seconds"] = asm["lb"];
      var _openmpt_module_get_position_seconds = Module["_openmpt_module_get_position_seconds"] = asm["mb"];
      var _openmpt_module_set_position_order_row = Module["_openmpt_module_set_position_order_row"] = asm["nb"];
      var _openmpt_module_get_render_param = Module["_openmpt_module_get_render_param"] = asm["ob"];
      var _openmpt_module_set_render_param = Module["_openmpt_module_set_render_param"] = asm["pb"];
      var _openmpt_module_read_mono = Module["_openmpt_module_read_mono"] = asm["qb"];
      var _openmpt_module_read_stereo = Module["_openmpt_module_read_stereo"] = asm["rb"];
      var _openmpt_module_read_quad = Module["_openmpt_module_read_quad"] = asm["sb"];
      var _openmpt_module_read_float_mono = Module["_openmpt_module_read_float_mono"] = asm["tb"];
      var _openmpt_module_read_float_stereo = Module["_openmpt_module_read_float_stereo"] = asm["ub"];
      var _openmpt_module_read_float_quad = Module["_openmpt_module_read_float_quad"] = asm["vb"];
      var _openmpt_module_read_interleaved_stereo = Module["_openmpt_module_read_interleaved_stereo"] = asm["wb"];
      var _openmpt_module_read_interleaved_quad = Module["_openmpt_module_read_interleaved_quad"] = asm["xb"];
      var _openmpt_module_read_interleaved_float_stereo = Module["_openmpt_module_read_interleaved_float_stereo"] = asm["yb"];
      var _openmpt_module_read_interleaved_float_quad = Module["_openmpt_module_read_interleaved_float_quad"] = asm["zb"];
      var _openmpt_module_get_metadata_keys = Module["_openmpt_module_get_metadata_keys"] = asm["Ab"];
      var _openmpt_module_get_metadata = Module["_openmpt_module_get_metadata"] = asm["Bb"];
      var _openmpt_module_get_current_estimated_bpm = Module["_openmpt_module_get_current_estimated_bpm"] = asm["Cb"];
      var _openmpt_module_get_current_speed = Module["_openmpt_module_get_current_speed"] = asm["Db"];
      var _openmpt_module_get_current_tempo = Module["_openmpt_module_get_current_tempo"] = asm["Eb"];
      var _openmpt_module_get_current_order = Module["_openmpt_module_get_current_order"] = asm["Fb"];
      var _openmpt_module_get_current_pattern = Module["_openmpt_module_get_current_pattern"] = asm["Gb"];
      var _openmpt_module_get_current_row = Module["_openmpt_module_get_current_row"] = asm["Hb"];
      var _openmpt_module_get_current_playing_channels = Module["_openmpt_module_get_current_playing_channels"] = asm["Ib"];
      var _openmpt_module_get_current_channel_vu_mono = Module["_openmpt_module_get_current_channel_vu_mono"] = asm["Jb"];
      var _openmpt_module_get_current_channel_vu_left = Module["_openmpt_module_get_current_channel_vu_left"] = asm["Kb"];
      var _openmpt_module_get_current_channel_vu_right = Module["_openmpt_module_get_current_channel_vu_right"] = asm["Lb"];
      var _openmpt_module_get_current_channel_vu_rear_left = Module["_openmpt_module_get_current_channel_vu_rear_left"] = asm["Mb"];
      var _openmpt_module_get_current_channel_vu_rear_right = Module["_openmpt_module_get_current_channel_vu_rear_right"] = asm["Nb"];
      var _openmpt_module_get_num_subsongs = Module["_openmpt_module_get_num_subsongs"] = asm["Ob"];
      var _openmpt_module_get_num_channels = Module["_openmpt_module_get_num_channels"] = asm["Pb"];
      var _openmpt_module_get_num_orders = Module["_openmpt_module_get_num_orders"] = asm["Qb"];
      var _openmpt_module_get_num_patterns = Module["_openmpt_module_get_num_patterns"] = asm["Rb"];
      var _openmpt_module_get_num_instruments = Module["_openmpt_module_get_num_instruments"] = asm["Sb"];
      var _openmpt_module_get_num_samples = Module["_openmpt_module_get_num_samples"] = asm["Tb"];
      var _openmpt_module_get_subsong_name = Module["_openmpt_module_get_subsong_name"] = asm["Ub"];
      var _openmpt_module_get_channel_name = Module["_openmpt_module_get_channel_name"] = asm["Vb"];
      var _openmpt_module_get_order_name = Module["_openmpt_module_get_order_name"] = asm["Wb"];
      var _openmpt_module_get_pattern_name = Module["_openmpt_module_get_pattern_name"] = asm["Xb"];
      var _openmpt_module_get_instrument_name = Module["_openmpt_module_get_instrument_name"] = asm["Yb"];
      var _openmpt_module_get_sample_name = Module["_openmpt_module_get_sample_name"] = asm["Zb"];
      var _openmpt_module_get_order_pattern = Module["_openmpt_module_get_order_pattern"] = asm["_b"];
      var _openmpt_module_get_pattern_num_rows = Module["_openmpt_module_get_pattern_num_rows"] = asm["$b"];
      var _openmpt_module_get_pattern_row_channel_command = Module["_openmpt_module_get_pattern_row_channel_command"] = asm["ac"];
      var _openmpt_module_format_pattern_row_channel_command = Module["_openmpt_module_format_pattern_row_channel_command"] = asm["bc"];
      var _openmpt_module_highlight_pattern_row_channel_command = Module["_openmpt_module_highlight_pattern_row_channel_command"] = asm["cc"];
      var _openmpt_module_format_pattern_row_channel = Module["_openmpt_module_format_pattern_row_channel"] = asm["dc"];
      var _openmpt_module_highlight_pattern_row_channel = Module["_openmpt_module_highlight_pattern_row_channel"] = asm["ec"];
      var _openmpt_module_get_ctls = Module["_openmpt_module_get_ctls"] = asm["fc"];
      var _openmpt_module_ctl_get = Module["_openmpt_module_ctl_get"] = asm["gc"];
      var _openmpt_module_ctl_get_boolean = Module["_openmpt_module_ctl_get_boolean"] = asm["hc"];
      var _openmpt_module_ctl_get_integer = Module["_openmpt_module_ctl_get_integer"] = asm["ic"];
      var _openmpt_module_ctl_get_floatingpoint = Module["_openmpt_module_ctl_get_floatingpoint"] = asm["jc"];
      var _openmpt_module_ctl_get_text = Module["_openmpt_module_ctl_get_text"] = asm["kc"];
      var _openmpt_module_ctl_set = Module["_openmpt_module_ctl_set"] = asm["lc"];
      var _openmpt_module_ctl_set_boolean = Module["_openmpt_module_ctl_set_boolean"] = asm["mc"];
      var _openmpt_module_ctl_set_integer = Module["_openmpt_module_ctl_set_integer"] = asm["nc"];
      var _openmpt_module_ctl_set_floatingpoint = Module["_openmpt_module_ctl_set_floatingpoint"] = asm["oc"];
      var _openmpt_module_ctl_set_text = Module["_openmpt_module_ctl_set_text"] = asm["pc"];
      var _openmpt_module_ext_create = Module["_openmpt_module_ext_create"] = asm["qc"];
      var _openmpt_module_ext_create_from_memory = Module["_openmpt_module_ext_create_from_memory"] = asm["rc"];
      var _openmpt_module_ext_destroy = Module["_openmpt_module_ext_destroy"] = asm["sc"];
      var _openmpt_module_ext_get_module = Module["_openmpt_module_ext_get_module"] = asm["tc"];
      var _openmpt_module_ext_get_interface = Module["_openmpt_module_ext_get_interface"] = asm["uc"];
      var _malloc = Module["_malloc"] = asm["vc"];
      var ___errno_location = Module["___errno_location"] = asm["wc"];
      var stackSave = Module["stackSave"] = asm["xc"];
      var stackRestore = Module["stackRestore"] = asm["yc"];
      var stackAlloc = Module["stackAlloc"] = asm["zc"];
      var _setThrew = Module["_setThrew"] = asm["Ac"];
      var ___cxa_can_catch = Module["___cxa_can_catch"] = asm["Bc"];
      var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = asm["Cc"];
      var dynCall_viiiji = Module["dynCall_viiiji"] = asm["Dc"];
      var dynCall_viijii = Module["dynCall_viijii"] = asm["Ec"];
      var dynCall_ji = Module["dynCall_ji"] = asm["Fc"];
      var dynCall_jiiii = Module["dynCall_jiiii"] = asm["Gc"];
      var dynCall_ijiij = Module["dynCall_ijiij"] = asm["Hc"];
      var dynCall_ijii = Module["dynCall_ijii"] = asm["Ic"];
      var dynCall_iji = Module["dynCall_iji"] = asm["Jc"];
      var dynCall_jiii = Module["dynCall_jiii"] = asm["Kc"];
      var dynCall_viiji = Module["dynCall_viiji"] = asm["Lc"];
      var dynCall_jii = Module["dynCall_jii"] = asm["Mc"];

      function invoke_iiii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iii(index, a1, a2) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_vii(index, a1, a2) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_ii(index, a1) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_vi(index, a1) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_v(index) {
        var sp = stackSave();
        try {
          wasmTable.get(index)()
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_i(index) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)()
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iid(index, a1, a2) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiiii(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4, a5)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4, a5)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_fi(index, a1) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_vid(index, a1, a2) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_di(index, a1) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_id(index, a1) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_dd(index, a1) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_if(index, a1) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viif(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_fii(index, a1, a2) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_didi(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_did(index, a1, a2) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_diii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viidi(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viid(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_dii(index, a1, a2) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiidd(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4, a5)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiid(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4, a5)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_fiii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
        var sp = stackSave();
        try {
          return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
        var sp = stackSave();
        try {
          wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viijii(index, a1, a2, a3, a4, a5, a6) {
        var sp = stackSave();
        try {
          dynCall_viijii(index, a1, a2, a3, a4, a5, a6)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiiji(index, a1, a2, a3, a4, a5, a6) {
        var sp = stackSave();
        try {
          dynCall_viiiji(index, a1, a2, a3, a4, a5, a6)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_ji(index, a1) {
        var sp = stackSave();
        try {
          return dynCall_ji(index, a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_jiiii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          return dynCall_jiiii(index, a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_ijiij(index, a1, a2, a3, a4, a5, a6) {
        var sp = stackSave();
        try {
          return dynCall_ijiij(index, a1, a2, a3, a4, a5, a6)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_ijii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          return dynCall_ijii(index, a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iji(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return dynCall_iji(index, a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_jiii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return dynCall_jiii(index, a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viiji(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          dynCall_viiji(index, a1, a2, a3, a4, a5)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_jii(index, a1, a2) {
        var sp = stackSave();
        try {
          return dynCall_jii(index, a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      var calledRun;

      function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status
      }

      dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller
      };

      function run(args) {
        args = args || arguments_;
        if (runDependencies > 0) {
          return
        }
        preRun();
        if (runDependencies > 0) return;

        function doRun() {
          if (calledRun) return;
          calledRun = true;
          Module["calledRun"] = true;
          if (ABORT) return;
          initRuntime();
          preMain();
          readyPromiseResolve(Module);
          if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
          postRun()
        }

        if (Module["setStatus"]) {
          Module["setStatus"]("Running...");
          setTimeout(function () {
            setTimeout(function () {
              Module["setStatus"]("")
            }, 1);
            doRun()
          }, 1)
        } else {
          doRun()
        }
      }

      Module["run"] = run;
      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
          Module["preInit"].pop()()
        }
      }
      noExitRuntime = true;
      run();

      libopenmpt.UTF8ToString = UTF8ToString;
      libopenmpt.writeAsciiToMemory = writeAsciiToMemory;

      return libopenmpt
    }
  );
})();
export default libopenmpt;