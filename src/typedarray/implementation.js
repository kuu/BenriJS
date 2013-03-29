/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var typedarray = global.benri.typedarray;

  global.ArrayBuffer = typedarray.ArrayBuffer = ArrayBuffer;

  global.Int8Array = typedarray.Int8Array = Int8Array || Int8Array;
  global.Uint8Array = typedarray.Uint8Array = Uint8Array || Uint8Array;
  typedarray.Uint8ClampedArray = Uint8ClampedArray || Uint8ClampedArray;
  global.Int16Array = typedarray.Int16Array = Int16Array || Int16Array;
  global.Uint16Array = typedarray.Uint16Array = Uint16Array || Uint16Array;
  global.Int32Array = typedarray.Int32Array = Int32Array || Int32Array;
  global.Uint32Array = typedarray.Uint32Array = Uint32Array || Uint32Array;
  typedarray.Float32Array = Float32Array || Float32Array;
  typedarray.Float64Array = Float64Array || Float64Array;

  typedarray.DataView = DataView || DataView;

  function createIndicies(pObject, pLength, pGetter, pSetter) {
    for (var i = 0; i < pLength; i++) {
      Object.defineProperty(pObject, i, {
        get: (function(pIndex) {
          return function() {
            return pGetter(pIndex);
          }
        }(i)),
        set: (function(pIndex) {
          return function(pValue) {
            return pSetter(pIndex, pValue);
          }
        }(i)),
        enumerable: true,
        configurable: false
      });
    }
  }

  function ArrayBuffer(pByteLength) {
    var tBuffer = new Array(pByteLength);
    var tNumOfIndicies = pByteLength - 1;

    for (var i = 0; i < pByteLength; i++) {
      tBuffer[i] = 0;
    }

    Object.defineProperty(this, 'byteLength', {
      get: function() {
        return pByteLength;
      }
    });

    function getter(pIndex) {
      return tBuffer[pIndex];
    }

    function setter(pIndex, pValue) {
      if (pIndex > tNumOfIndicies) {
        throw new Error('INVALID_INDEX');
      }
      tBuffer[pIndex] = pValue;
    }

    createIndicies(this, pByteLength, getter, setter);
  }

  ArrayBuffer.prototype.slice = function(pBegin, pEnd) {
    var tBuffer = new ArrayBuffer(pEnd - pBegin);

    for (var i = 0; pBegin <= pEnd; i++, pBegin++) {
      tBuffer[i] = this[pBegin];
    }

    return tBuffer;
  };



  function ArrayBufferView(pBuffer, pByteOffset, pByteLength) {
    Object.defineProperty(this, 'buffer', {
      get: function() {
        return pBuffer;
      }
    });
    
    Object.defineProperty(this, 'byteOffset', {
      get: function() {
        return pByteOffset;
      }
    });

    Object.defineProperty(this, 'byteLength', {
      get: function() {
        return pByteLength;
      }
    });
  }

  ArrayBufferView.prototype.constructor = null;



  function TypedArray(pLengthOrArrayOrBuffer, pByteOffset, pLength, pIsSigned) {
    var tBuffer;
    var tByteOffset;
    var tByteLength;
    var tLength;
    var tBytesPerElement = this.constructor.BYTES_PER_ELEMENT;

    if (pLengthOrArrayOrBuffer instanceof ArrayBuffer) {
      tBuffer = pLengthOrArrayOrBuffer;
      
      if (typeof pByteOffset === 'number') {
        tByteOffset = pByteOffset;
      } else {
        tByteOffset = 0;
      }

      if (tByteOffset % tBytesPerElement !== 0) {
        throw new Error('Bad byte offset');
      }

      if (typeof pLength === 'number') {
        tLength = pLength;
        tByteLength = pLength * tBytesPerElement;
      } else {
        tByteLength = tBuffer.byteLength;
        tLength = tByteLength - tByteOffset;

        if (tLength % tBytesPerElement !== 0) {
          throw new Error('Bad length');
        }

        tLength /= tBytesPerElement;
      }

      if (tByteOffset + tByteLength > tBuffer.byteLength) {
        throw new Error('Out of range');
      }

    } else if (pLengthOrArrayOrBuffer instanceof ArrayBufferView || pLengthOrArrayOrBuffer instanceof Array) {
      tLength = pLengthOrArrayOrBuffer.length;
      tByteLength = tLength * tBytesPerElement;
      tBuffer = new ArrayBuffer(tByteLength);
      tByteOffset = 0;

      this.set(pLengthOrArrayOrBuffer, 0);
    } else if (typeof pLengthOrArrayOrBuffer === 'number') {
      tByteLength = pLengthOrArrayOrBuffer * tBytesPerElement;
      tBuffer = new ArrayBuffer(tByteLength);
      tByteOffset = 0;
      tLength = pLengthOrArrayOrBuffer;
    } else {
      throw new Error('Invalid constructor');
    }

    Object.defineProperty(this, 'length', {
      get: function() {
        return tLength;
      }
    });

    function getter(pIndex) {
      var tArrayBuffer = tBuffer;
      pIndex = pIndex * tBytesPerElement + tByteOffset;

      if (pIndex > tByteLength) {
        throw new Error('Out of range');
      }

      var tValue = 0;

      for (var tLength = pIndex + tBytesPerElement; pIndex < tLength; pIndex++) {
        tValue = (tValue << 8) | tArrayBuffer[pIndex];
      }

      if (!pIsSigned) {
        tValue = tValue >>> 0;
      }

      return tValue;
    }

    function setter(pIndex, pValue) {
      var tArrayBuffer = tBuffer;
      pIndex = pIndex * tBytesPerElement + tByteOffset;

      if (pIndex > tByteLength) {
        throw new Error('Out of range');
      }

      for (var tIndex = pIndex + tBytesPerElement - 1; tIndex >= pIndex; tIndex--) {
        tArrayBuffer[tIndex] = pValue & 0xFF;
        pValue = pValue >> 8;
      }

      if (pIsSigned) {
        console.warn('Need to support setting signed data.');
      }
    }

    createIndicies(this, tByteLength, getter, setter);

    return {
      buffer: tBuffer,
      byteOffset: tByteOffset,
      byteLength: tByteLength
    }
  }

  var TypedArraySet = function set(pArray, pOffset) {
    pOffset = pOffset || 0;

    if (pOffset + pArray.byteLength > this.byteLength) {
      throw new Error('Out of range');
    }

    for (var i = 0, tLength = pArray.length; pOffset < tLength; i++, pOffset++) {
      this[pOffset] = pArray[i];
    }
  };

  var TypedArraySubarray = function subarray(pBegin, pEnd) {
    var tLength = this.length;
    pBegin = pBegin || 0;
    pEnd = pEnd || tLength - 1;

    if (pBegin < 0) {
      pBegin = tLength + pBegin;
    }

    if (pEnd < 0) {
      pEnd = tLength + pEnd;
    }

    var tView = new this.constructor(this.buffer, pBegin * this.constructor.BYTES_PER_ELEMENT, pEnd + 1);
  };

  function setup(pClass, pBytes) {
    pClass.prototype = Object.create(ArrayBufferView.prototype);
    pClass.prototype.constructor = pClass;
    pClass.prototype.set = TypedArraySet;
    pClass.prototype.subarray = TypedArraySubarray;

    pClass.BYTES_PER_ELEMENT = pBytes;
  }


  function Int8Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, true);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Int8Array, 1);

  function Uint8Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, false);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Uint8Array, 1);

  function Uint8ClampedArray(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, false);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Uint8ClampedArray, 1);

  function Int16Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, true);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Int16Array, 2);

  function Uint16Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, false);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Uint16Array, 2);

  function Int32Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, true);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Int32Array, 4);

  function Uint32Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, false);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  setup(Uint32Array, 4);

  function Float32Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    throw new Error('Not implemented');
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, true);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  //setup(Float32Array, 4);

  function Float64Array(pLengthOrArrayOrBuffer, pByteOffset, pByteLength) {
    throw new Error('Not implemented');
    var tData = TypedArray.call(this, pLengthOrArrayOrBuffer, pByteOffset, pByteLength, true);
    ArrayBufferView.call(this, tData.buffer, tData.byteOffset, tData.byteLength);
  }
  //setup(Float64Array, 8);



  function DataView(pBuffer, pByteOffset, pByteLength) {

  }


}(this));