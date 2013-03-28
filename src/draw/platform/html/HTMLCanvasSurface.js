/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var document = global.document;
  var benri = global.benri;
  var Uniform = benri.draw.Uniform;

  var mStyleHandlerClasses = [];
  var mStyleHandlers = [];
  var mShaderHandlerClasses = [];
  var mShaderHandlers = [];

  var mMainCanvasPool = {};
  var mCanvasPool = [];

  /**
   * @class
   * @extends {benri.draw.Surface}
   */
  var HTMLCanvasSurface = (function(pSuper) {
    function HTMLCanvasSurface(pWidth, pHeight) {
      pSuper.call(this, pWidth, pHeight);

      var tWrapper = this.canvasWrapper = requestMainCanvasWrapper(pWidth, pHeight);
      this.canvas = tWrapper.canvas;
      this.context = tWrapper.context;
      this.resources = [];

      this.records = [];
      this.drawFunction = null;
      this.hasUniforms = false;
      this.layers = [];
    }

    HTMLCanvasSurface.prototype = Object.create(pSuper.prototype);
    HTMLCanvasSurface.prototype.constructor = HTMLCanvasSurface;

    HTMLCanvasSurface.prototype.setSize = function(pWidth, pHeight) {
      this.width = pWidth;
      this.height = pHeight;

      var tCanvas = this.canvas;
      tCanvas.width = pWidth;
      tCanvas.height = pHeight;
    };

    function checkForUniforms(pRecords) {
      var i, il, k;
      var tRecord;

      for (i = 0, il = pRecords.length; i < il; i++) {
        tRecord = pRecords[i];
        for (k in tRecord) {
          if (tRecord[k] instanceof Uniform) {
            return true;
          }
        }
      }

      return false;
    }

    HTMLCanvasSurface.prototype.addRecords = function(pRecords) {
      if (this.drawFunction !== null) {
        this.drawFunction = null;
      }

      this.hasUniforms = checkForUniforms(pRecords);

      this.records = this.records.concat(pRecords);
    };

    HTMLCanvasSurface.prototype.clearRecords = function() {
      this.records = [];
      this.drawFunction = null;
      this.hasUniforms = false;
      this.resources = [];
    };

    HTMLCanvasSurface.prototype.flush = function() {
      var tRecords;
      var tRecord;
      var tType;
      var i, il;
      var tHandlers;

      if (this.hasUniforms === true) {
        if (this.drawFunction === null) {
          this.generateDrawFunction();
        }

        this.drawFunction(this.context);
      } else {
        tRecords = this.records;
        tHandlers = HTMLCanvasSurface.recordHandlers;
        this.resources = [];

        for (i = 0, il = tRecords.length; i < il; i++) {
          tRecord = tRecords[i];
          tType = tRecord.type;

          if (tType in tHandlers) {
            tHandlers[tType].call(this, tRecord, false, null);
          }
        }
      }
    };

    HTMLCanvasSurface.prototype.getBitmap = function() {
      this.flush();
      return this.canvas;
    };

    HTMLCanvasSurface.prototype.generateDrawFunction = function() {
      var tRecords = this.records;
      var tRecord;
      var tType;
      var tCode = [];
      var i, il;
      var tHandlers = HTMLCanvasSurface.recordHandlers;

      this.resources = [];

      for (i = 0, il = tRecords.length; i < il; i++) {
        tRecord = tRecords[i];
        tType = tRecord.type;

        if (tType in tHandlers) {
          tHandlers[tType].call(this, tRecord, true, tCode);
        }
      }

      this.drawFunction = new Function('c', tCode.join('\n'));
    };

    HTMLCanvasSurface.prototype.resource = function(pResource) {
      var tResources = this.resources;
      var tIndex = tResources.indexOf(pResource);

      if (tIndex === -1) {
        tIndex = tResources.push(pResource) - 1;
      }

      return 'this.resources[' + tIndex + ']';
    };

    HTMLCanvasSurface.prototype.destroy = function() {
      var i, il;
      var tLayers = this.layers;

      this.resources = null;
      this.drawFunction = null;
      this.records = null;
      this.context = null;
      this.canvas = null;

      for (i = 0, il = tLayers.length; i < il; i++) {
        tLayers[i].release();
      }

      this.layers = null;

      this.canvasWrapper.release();
      this.canvasWrapper = null;
    };

    return HTMLCanvasSurface;
  })(benri.draw.Surface);


  HTMLCanvasSurface.recordHandlers = {
    matrix: function(pRecord, pCompiledMode, pCode) {
      var tMatrix = pRecord.matrix;

      if (pCompiledMode) {
        if (tMatrix instanceof Uniform) {
          pCode.push('var m = ' + this.resource(tMatrix) + '.value;');
          pCode.push('c.setTransform(m.a,m.b,m.c,m.d,m.e,m.f);');
        } else {
          pCode.push('c.setTransform(' +
            tMatrix.a + ',' +
            tMatrix.b + ',' +
            tMatrix.c + ',' +
            tMatrix.d + ',' +
            tMatrix.e + ',' +
            tMatrix.f + ');'
          );
        }
      } else {
        this.context.setTransform(
          tMatrix.a,
          tMatrix.b,
          tMatrix.c,
          tMatrix.d,
          tMatrix.e,
          tMatrix.f
        );
      }
    },

    move: function(pRecord, pCompiledMode, pCode) {
      var tPoint = pRecord.point;

      if (pCompiledMode) {
        if (tPoint instanceof Uniform) {
          pCode.push('var p = ' + this.resource(tPoint) + '.value;');
          pCode.push('c.moveTo(p.x, p.y);');
        } else {
          pCode.push('c.moveTo(' + tPoint.x + ',' + tPoint.y + ');');
        }
      } else {
        this.context.moveTo(tPoint.x, tPoint.y);
      }
    },

    line: function(pRecord, pCompiledMode, pCode) {
      var tPoint = pRecord.point;

      if (pCompiledMode) {
        if (tPoint instanceof Uniform) {
          pCode.push('var p = ' + this.resource(tPoint) + '.value;');
          pCode.push('c.lineTo(p.x, p.y);');
        } else {
          pCode.push('c.lineTo(' + tPoint.x + ',' + tPoint.y + ');');
        }
      } else {
        this.context.lineTo(tPoint.x, tPoint.y);
      }
    },

    quadraticCurve: function(pRecord, pCompiledMode, pCode) {
      var tControlPoint = pRecord.controlPoint;
      var tPoint = pRecord.point;

      if (pCompiledMode) {
        if (tPoint instanceof Uniform || tControlPoint instanceof Uniform) {
          pCode.push('var cp = ' + this.resource(tControlPoint) + '.value;');
          pCode.push('var p = ' + this.resource(tPoint) + '.value;');
          pCode.push('c.quadraticCurveTo(cp.x, cp.y, p.x, p.y);');
        } else {
          pCode.push('c.quadraticCurveTo(' + tControlPoint.x + ',' + tControlPoint.y + ',' + tPoint.x + ',' + tPoint.y + ');');
        }
      } else {
        this.context.quadraticCurveTo(tControlPoint.x, tControlPoint.y, tPoint.x, tPoint.y);
      }
    },

    path: function(pRecord, pCompiledMode, pCode) {
      if (pCompiledMode) {
        pCode.push('c.beginPath();');
      } else {
        this.context.beginPath();
      }
    },

    fastBitmap: function(pRecord, pCompiledMode, pCode) {
      handleStyle(this, pRecord.style, pRecord, drawImage, pCompiledMode, pCode);
    },

    bitmap: function(pRecord, pCompiledMode, pCode) {
      throw Error('Not Implemented');
    },

    stroke: function(pRecord, pCompiledMode, pCode) {
      handleStyle(this, pRecord.style, pRecord, stroke, pCompiledMode, pCode);
    },

    fill: function(pRecord, pCompiledMode, pCode) {
      handleStyle(this, pRecord.style, pRecord, fill, pCompiledMode, pCode);
    },

    text: function(pRecord, pCompiledMode, pCode) {
      var tText = pRecord.text;
      var tStyle = pRecord.style;
      var tFont = tStyle.font;
      var tColor = tStyle.getColor();
      var tContext = this.context;
      var tLeading = tFont.leading * tStyle.fontHeight / 1024;
      var tStringList, tString = pRecord.text + '';
      var tFontString = (tFont.italic ? 'italic ' : '') + (tFont.bold ? 'bold ' : '') + tStyle.fontHeight + 'px ' + tFont.name;
      var tYPos = 0, tWidth = tStyle.maxWidth;
      var tXPos = tStyle.leftMargin + (tStyle.align === 'left' ? 0 : (tStyle.align === 'center' ? tWidth / 2 : tWidth));
      var i, il;

      // CnvasRenderingContext2D.fillText() forcibly converts all the spaces into ASCII spaces.
      // However, the space characters are sometimes used for making visual space.
      // So, here we do such the conversion more precise way so that we can preserve the original layout.
      //tContext.save();
      tContext.font = tFontString;
      var tSpaceWidth = tContext.measureText('\u0020').width;
      var tIdeographicSpaceWidth = tContext.measureText('\u3000').width;
      var tSpaceMultRate = (tSpaceWidth && tIdeographicSpaceWidth ? tIdeographicSpaceWidth / tSpaceWidth : 4);

      // This function takes an arbitrary number of the ideographic spaces (U+3000,)
      // and returns how many ASCII spaces (U+0020) are needed for filling the same on-screen area
      // that the ideographic spaces would have ocupied.
      var howManySpaces = function (pString) {
        return Math.round(pString.length * tSpaceMultRate);
      };
      tString = tString.replace(/\u3000+/g, function (pMatched) {
          // Generating sucessive SPACE characters.
          return Array(howManySpaces(pMatched) + 1).join('\u0020');
        });
      //tContext.restore();

      // Fold the text.
      var tCharCode, tStringBuffer = '';
      tStringList = [];
      for (i = 0, il = tString.length; i < il; i++) {
        tCharCode = tString.charCodeAt(i);
        // We take account of line breaks even when TextStyle.multiline is true.
        if (tCharCode === 10 || tCharCode === 13) {
          tStringList.push(tStringBuffer);
          tStringBuffer = '';
          continue;
        }
        tStringBuffer += tString[i];
        if (i === il - 1
          || (tContext.measureText(tStringBuffer + tString[i + 1]).width > tWidth)) {
          tStringList.push(tStringBuffer);
          tStringBuffer = '';
        }
      }

      if (pCompiledMode) {
        pCode.push(
          'c.fillStyle = \'' + tColor.toCSSString() + '\';',
          'c.font = \'' + tFontString + '\';',
          'c.textBaseline = \'top\';',
          'c.textAlign = \'' + tStyle.align + '\';'
        );
        for (i = 0, il = tStringList.length; i < il; i++) {
          tString = tStringList[i].replace(/(?!\\)'/, '\\\'');
          pCode.push(
            'c.fillText(\'' + tString + '\', ' + tXPos + ', ' + tYPos + ', ' + tWidth + ');'
          );
          tYPos += (tLeading + tStyle.fontHeight);
        }
      } else {
        tContext.fillStyle = tColor.toCSSString();
        tContext.font = tFontString;
        tContext.textBaseline = 'top';
        tContext.textAlign = tStyle.align;
        for (i = 0, il = tStringList.length; i < il; i++) {
          tString = tStringList[i];
          tContext.fillText(tString, tXPos, tYPos, tWidth);
          tYPos += (tLeading + tStyle.fontHeight);
        }
      }
    },

    clearColor: function(pRecord, pCompiledMode, pCode) {
      var tWidth = this.width;
      var tHeight = this.height;
      var tColor = pRecord.color;
      var tContext;

      if (pCompiledMode) {
        pCode.push('c.clearRect(0,0,' + this.width + ',' + this.height + ');');

        if (tColor instanceof Uniform) {
          pCode.push('c.fillStyle = ' + this.resource(tColor) + '.value;');
        } else {
          pCode.push('c.fillStyle = "' + tColor.toCSSString() + '";');
        }

        pCode.push('c.fillRect(0,0,' + this.width + ',' + this.height + ');');
      } else {
        tContext = this.context;
        tContext.clearRect(0, 0, tWidth, tHeight);
        tContext.fillStyle = tColor.toCSSString();
        tContext.fillRect(0, 0, tWidth, tHeight);
      }
    },

    layer: function(pRecord, pCompiledMode, pCode) {
      var tMatrix = pRecord.matrix;
      var tContext, tWrapper;

      if (pCompiledMode) {
        pCode.push('this.layers.push(c);');
        pCode.push('c = document.createElement(\'canvas\').getContext(\'2d\');');
        pCode.push('c.canvas.width = this.width;');
        pCode.push('c.canvas.height = this.height;');
      } else {
        this.layers.push(this.canvasWrapper);
        tWrapper = this.canvasWrapper = this.requestCanvasWrapper(this.width, this.height);
        this.context = tWrapper.context;
      }
    },

    endLayer: function(pRecord, pCompiledMode, pCode) {
      if (pCompiledMode) {
        pCode.push('var lc = c;');
        pCode.push('c = this.layers.pop();');
        pCode.push('c.drawImage(lc.canvas, 0, 0);');
        pCode.push('lc = null;');
      } else {
        var tWrapper = this.canvasWrapper;
        this.canvasWrapper = this.layers.pop();
        var tContext = this.context = this.canvasWrapper.context;
        tWrapper.drawTo(tContext);
        tWrapper.release();
      }
    }
  };


  function drawImage(pSurface, pRecord, pCompiledMode, pCode) {
    var tPoint = pRecord.point;
    var tBitmap = pRecord.bitmap;

    if (pCompiledMode) {
      if (tPoint instanceof Uniform || tBitmap instanceof Uniform) {
        pCode.push('var p = ' + this.resource(tPoint) + '.value;');
        pCode.push('c.drawImage(' + this.resource(tBitmap) + '.value,p.x,p.y);');
      } else {
        pCode.push('c.drawImage(' + pSurface.resource(tBitmap) + ',' + tPoint.x + ',' + tPoint.y + ');');
      }
    } else {
      pSurface.context.drawImage(tBitmap, tPoint.x, tPoint.y);
    }
  }

  function fill(pSurface, pRecord, pCompiledMode, pCode) {
    if (pCompiledMode) {
      pCode.push('c.fill();');
    } else {
      pSurface.context.fill();
    }
  }

  function stroke(pSurface, pRecord, pCompiledMode, pCode) {
    if (pCompiledMode) {
      pCode.push('c.stroke();');
    } else {
      pSurface.context.stroke();
    }
  }


  function handleStyle(pSurface, pStyle, pRecord, pFunction, pCompiledMode, pCode) {
    var tShader;
    var tStyleMode;
    var tIndex = mStyleHandlerClasses.indexOf(pStyle.constructor);

    if (tIndex !== -1) {
      mStyleHandlers[tIndex](pSurface, pStyle, pCompiledMode, pCode);
    } else {
      console.warn('No HTMLCanvasSurface handler for style: ' + pStyle);
    }

    if (pFunction === fill) {
      tStyleMode = 'fill';
    } else if (pFunction === stroke) {
      tStyleMode = 'stroke';
    } else {
      tStyleMode = 'bitmap';
    }

    tShader = pStyle.shader;

    if (!tShader) {
      if (pFunction === fill) {
        if (pCompiledMode) {
          pCode.push('c.fillStyle = \'red\';');
        } else {
          pSurface.context.fillStyle = 'red';
        }
      } else if (pFunction === stroke) {
        if (pCompiledMode) {
          pCode.push('c.strokeStyle = \'red\';');
        } else {
          pSurface.context.strokeStyle = 'red';
        }
      }

      pFunction(pSurface, pRecord, pCompiledMode, pCode);

      return;
    }

    tIndex = mShaderHandlerClasses.indexOf(tShader.constructor);

    if (tIndex !== -1) {
      mShaderHandlers[tIndex](pSurface, tShader, pRecord, tStyleMode, pFunction, pCompiledMode, pCode);
    } else {
      console.warn('No HTMLCanvasSurface handler for shader: ' + tShader);
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
    }
  }


  HTMLCanvasSurface.addStyleHandler = function(pStyle, pHandler) {
    mStyleHandlerClasses.push(pStyle);
    mStyleHandlers.push(pHandler);
  };

  HTMLCanvasSurface.removeStyleHandler = function(pStyle, pHandler) {
    for (var i = 0, il = mStyleHandlerClasses.length; i < il; i++) {
      if (mStyleHandlerClasses[i] === pStyle && mStyleHandlers[i] === pHandler) {
        mStyleHandlerClasses.splice(i, 1);
        mStyleHandlers.splice(i, 1);
        return;
      }
    }
  };

  HTMLCanvasSurface.addShaderHandler = function(pShader, pHandler) {
    mShaderHandlerClasses.push(pShader);
    mShaderHandlers.push(pHandler);
  };

  HTMLCanvasSurface.removeShaderHandler = function(pShader, pHandler) {
    for (var i = 0, il = mShaderHandlerClasses.length; i < il; i++) {
      if (mShaderHandlerClasses[i] === pShader && mShaderHandlers[i] === pHandler) {
        mShaderHandlerClasses.splice(i, 1);
        mShaderHandlers.splice(i, 1);
        return;
      }
    }
  };

  // This is faster than doing log(pValue) / log(2)
  function getNumberOfBits(pValue) {
    var tNumOfBits = 0;

    do {
      tNumOfBits++;
      pValue = pValue >> 1;
    } while (pValue > 0);

    return tNumOfBits;
  }

  function CanvasWrapper(pCanvas, pWidth, pHeight, pBits) {
    this.canvas = pCanvas;
    var tContext = this.context = pCanvas.getContext('2d');
    this.width = pWidth;
    this.height = pHeight;
    this.bits = pBits;

    tContext.clearRect(0, 0, pWidth, pHeight);
    tContext.save();
  }

  CanvasWrapper.prototype.drawTo = function(pContext) {
    pContext.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
  };

  CanvasWrapper.prototype.release = function() {
    this.context.restore();

    mCanvasPool[this.bits].push(this.canvas);

    this.canvas = this.context = null;
  };

  CanvasWrapper.prototype.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  function MainCanvasWrapper(pCanvas, pWidth, pHeight) {
    CanvasWrapper.call(this, pCanvas, pWidth, pHeight, 0);
  }

  MainCanvasWrapper.prototype = Object.create(CanvasWrapper.prototype);

  MainCanvasWrapper.prototype.release = function() {
    this.context.restore();

    mMainCanvasPool[this.width + 'x' + this.height].push(this.canvas);

    this.canvas = this.context = null;
  };

  function requestMainCanvasWrapper(pWidth, pHeight) {
    var tKey = pWidth + 'x' + pHeight;
    var tCache = mMainCanvasPool[tKey];
    var tCanvas;

    if (tCache === void 0) {
      tCache = mMainCanvasPool[tKey] = [];
    }

    if (tCache.length > 0) {
      tCanvas = tCache.pop();
    } else {
      tCanvas = document.createElement('canvas');
      tCanvas.width = pWidth;
      tCanvas.height = pHeight;
    }

    return new MainCanvasWrapper(tCanvas, pWidth, pHeight);
  }

  HTMLCanvasSurface.prototype.requestCanvasWrapper = function(pWidth, pHeight) {
    var tMaxBits = Math.max(getNumberOfBits(pWidth), getNumberOfBits(pHeight));
    var tIndex = tMaxBits;
    var tCache = mCanvasPool[tIndex];
    var tCanvas;

    if (tCache === void 0) {
      tCache = mCanvasPool[tIndex] = [];
    }

    if (tCache.length > 0) {
      tCanvas = tCache.pop();
    } else {
      tCanvas = document.createElement('canvas');
      tCanvas.width = tCanvas.height = 1 << tMaxBits;
    }

    return new CanvasWrapper(tCanvas, pWidth, pHeight, tMaxBits);
  };


  benri.draw.platform.html = benri.draw.platform.html || {};

  benri.draw.platform.html.HTMLCanvasSurface = HTMLCanvasSurface;

  benri.draw.Canvas.defaultSurface = HTMLCanvasSurface;

  HTMLCanvasElement.prototype.getBenriJSSurface = function() {
    var tSurface = new HTMLCanvasSurface(0, 0);
    tSurface.canvas = this;
    tSurface.context = this.getContext('2d');
    tSurface.width = this.width;
    tSurface.height = this.height;

    return tSurface;
  };

}(this));
