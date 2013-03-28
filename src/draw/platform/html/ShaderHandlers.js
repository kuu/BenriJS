/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  var HTMLCanvasSurface = benri.draw.platform.html.HTMLCanvasSurface;

  function handleShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tContext;

    if (pStyleMode === 'bitmap') {
      return;
    }

    // Do nothing. Set to transparent.
    if (pCompiledMode) {
      pCode.push('c.' + pStyleMode + 'Style = \'rgba(0,0,0,0)\';');
    } else {
      tContext = pSurface.context;
      tContext[pStyleMode + 'Style'] = 'rgba(0,0,0,0)';
    }

    pFunction(pSurface, pRecord, pCompiledMode, pCode);
  }

  function handleColorShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tContext;

    if (pStyleMode === 'bitmap') {
      return;
    }

    // Do nothing. Set to transparent.
    if (pCompiledMode) {
      pCode.push('c.' + pStyleMode + 'Style = \'' + pShader.color.toCSSString() + '\';');
    } else {
      tContext = pSurface.context;
      tContext[pStyleMode + 'Style'] = pShader.color.toCSSString();
    }

    pFunction(pSurface, pRecord, pCompiledMode, pCode);
  }

  function handleLinearGradientShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tContext;

    if (pStyleMode === 'bitmap') {
      return;
    }

    var tStartPoint = pShader.startPoint;
    var tEndPoint = pShader.endPoint;
    var tPositions = pShader.positions;
    var tColors = pShader.colors;
    var tMatrix = pShader.matrix;
    var tGradient;
    var i, il;

    if (pCompiledMode) {
      pCode.push('var tGradient = c.createLinearGradient(' + tStartPoint.x + ',' + tStartPoint.y + ',' + tEndPoint.x + ',' + tEndPoint.y + ');');

      for (i = 0, il = tPositions.length; i < il; i++) {
        pCode.push('tGradient.addColorStop(' + tPositions[i] + ',\'' + tColors[i].toCSSString() + '\');');
      }

      pCode.push('c.' + pStyleMode + 'Style = tGradient;');
      pCode.push('c.setTransform(' +
        tMatrix.a + ',' +
        tMatrix.b + ',' +
        tMatrix.c + ',' +
        tMatrix.d + ',' +
        tMatrix.e + ',' +
        tMatrix.f + ');'
      );
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
    } else {
      tContext = pSurface.context;
      tContext.save();
      tContext.setTransform(1, 0, 0, 1, 0, 0);
      tGradient = tContext.createLinearGradient(tStartPoint.x, tStartPoint.y, tEndPoint.x, tEndPoint.y);

      for (i = 0, il = tPositions.length; i < il; i++) {
        tGradient.addColorStop(tPositions[i], tColors[i].toCSSString());
      }

      tContext[pStyleMode + 'Style'] = tGradient;
      tContext.setTransform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
      tContext.restore();
    }

  }

  function handleRadialGradientShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tContext;

    if (pStyleMode === 'bitmap') {
      return;
    }

    var tStartPoint = pShader.startPoint;
    var tX = tStartPoint.x;
    var tY = tStartPoint.y;
    var tRadius = pShader.radius;
    var tPositions = pShader.positions;
    var tColors = pShader.colors;
    var tMatrix = pShader.matrix;
    var tGradient;
    var i, il;

    if (pCompiledMode) {
      pCode.push('var tGradient = c.createRadialGradient(' + tX + ',' + tY + ',0,' + tX + ',' + tY + ',' + tRadius + ');');

      for (i = 0, il = tPositions.length; i < il; i++) {
        pCode.push('tGradient.addColorStop(' + tPositions[i] + ',\'' + tColors[i].toCSSString() + '\');');
      }

      pCode.push('c.' + pStyleMode + 'Style = tGradient;');
      pCode.push('c.setTransform(' +
        tMatrix.a + ',' +
        tMatrix.b + ',' +
        tMatrix.c + ',' +
        tMatrix.d + ',' +
        tMatrix.e + ',' +
        tMatrix.f + ');'
      );
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
    } else {
      tContext = pSurface.context;
      tContext.save();
      tContext.setTransform(1, 0, 0, 1, 0, 0);
      tGradient = tContext.createRadialGradient(tX, tY, 0, tX, tY, tRadius);

      for (i = 0, il = tPositions.length; i < il; i++) {
        tGradient.addColorStop(tPositions[i], tColors[i].toCSSString());
      }

      tContext[pStyleMode + 'Style'] = tGradient;
      tContext.setTransform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
      tContext.restore();
    }
  }

  function handleBitmapShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tContext;

    if (pStyleMode === 'bitmap') {
      return;
    }

    var tMatrix = pShader.matrix;
    var tRepeat = pShader.tileMode === 'none' ? 'no-repeat' : 'repeat';
    var tBitmap = pShader.bitmap;

    if (pCompiledMode) {
      pCode.push('c.' + pStyleMode + 'Style = c.createPattern(' + pSurface.resource(tBitmap) + ', \'' + tRepeat + '\')');
      pCode.push('c.setTransform(' +
        tMatrix.a + ',' +
        tMatrix.b + ',' +
        tMatrix.c + ',' +
        tMatrix.d + ',' +
        tMatrix.e + ',' +
        tMatrix.f + ');'
      );
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
    } else {
      tContext = pSurface.context;
      tContext.save();
      tContext.setTransform(1, 0, 0, 1, 0, 0);
      tContext[pStyleMode + 'Style'] = tContext.createPattern(tBitmap, tRepeat);
      tContext.setTransform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
      tContext.restore();
    }
  }

  function handleColorTransformShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tContext;
    var tGlobalAlpha;

    if (pStyleMode !== 'bitmap') {
      return;
    }

    var tBitmap = pRecord.bitmap;
    var tBitmapWidth = tBitmap.width;
    var tBitmapHeight = tBitmap.height;

    // TODO: This needs to support more record types... Right now its only fastbitmap
    // with an origin of 0,0. (Except for alpha only)

    var tAlphaAdd = pShader.alphaAdd;
    var tAlphaMultiplier = pShader.alphaMultiplier;
    var tRedAdd = pShader.redAdd;
    var tRedMultiplier = pShader.redMultiplier;
    var tGreenAdd = pShader.greenAdd;
    var tGreenMultiplier = pShader.greenMultiplier;
    var tBlueAdd = pShader.blueAdd;
    var tBlueMultiplier = pShader.blueMultiplier;

    var tHasAlpha = !!(tAlphaAdd !== 0 || tAlphaMultiplier !== 1);
    var tHasRed = !!(tRedAdd !== 0 || tRedMultiplier !== 1);
    var tHasGreen = !!(tGreenAdd !== 0 || tGreenMultiplier !== 1);
    var tHasBlue = !!(tBlueAdd !== 0 || tBlueMultiplier !== 1);

    if (tHasRed || tHasGreen || tHasBlue) {
      if (pCompiledMode) {
        pCode.push('var tc = document.createElement(\'canvas\').getContext(\'2d\');');
        pCode.push('tc.canvas.width = ' + tBitmapWidth + ';');
        pCode.push('tc.canvas.height = ' + tBitmapHeight + ';');
        pCode.push('tc.drawImage(' + pSurface.resource(tBitmap) + ', 0, 0);');
        pCode.push('var tImageData = tc.getImageData(0,0,' + tBitmapWidth + ',' + tBitmapHeight + ');');
        pCode.push('var tPixels = tImageData.data;');
        pCode.push('for (var i = 0, il = tPixels.length; i < il; i += 4) {');
        pCode.push('if (tPixels[i + 3] === 0) continue;');

        if (tHasRed) {
          pCode.push('tPixels[i] = ((((tPixels[i] * ' + tRedMultiplier + ') / 256) + ' + tRedAdd + ') * 255) | 0');
        }

        if (tHasGreen) {
          pCode.push('tPixels[i + 1] = ((((tPixels[i + 1] * ' + tGreenMultiplier + ') / 256) + ' + tGreenAdd + ') * 255) | 0');
        }

        if (tHasBlue) {
          pCode.push('tPixels[i + 2] = ((((tPixels[i + 2] * ' + tBlueMultiplier + ') / 256) + ' + tBlueAdd + ') * 255) | 0');
        }

        pCode.push('}');

        pCode.push('tc.putImageData(tImageData, 0, 0);');

        if (tHasAlpha) {
          pCode.push('var tGlobalAlpha = c.globalAlpha;');
          pCode.push('c.globalAlpha = ' + (tAlphaMultiplier + tAlphaAdd) + ';');
          pCode.push('c.drawImage(tc.canvas, 0, 0);');
          pCode.push('c.globalAlpha = tGlobalAlpha;');
        } else {
          pCode.push('c.drawImage(tc.canvas, 0, 0);');
        }

        pCode.push('tc = null;');
      } else {
        var tTransformedWrapper = pSurface.requestCanvasWrapper(tBitmapWidth, tBitmapHeight);
        var tTransformedC = tTransformedWrapper.context;

        tTransformedC.drawImage(tBitmap, 0, 0);

        var tImageData = tTransformedC.getImageData(0, 0, tBitmapWidth, tBitmapHeight);
        var tPixels = tImageData.data;

        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          if (tPixels[i + 3] === 0) continue;

          if (tHasRed) {
            tPixels[i] = ((((tPixels[i] * tRedMultiplier) / 256) + tRedAdd) * 255) | 0;
          }

          if (tHasGreen) {
            tPixels[i + 1] = ((((tPixels[i + 1] * tGreenMultiplier) / 256) + tGreenAdd) * 255) | 0;
          }

          if (tHasBlue) {
            tPixels[i + 2] = ((((tPixels[i + 2] * tBlueMultiplier) / 256) + tBlueAdd) * 255) | 0;
          }
        }

        tTransformedC.putImageData(tImageData, 0, 0);

        if (tHasAlpha) {
          tContext = pSurface.context;
          tGlobalAlpha = tContext.globalAlpha;
          tContext.globalAlpha = tAlphaMultiplier + tAlphaAdd;
          tTransformedWrapper.drawTo(tContext);
          tContext.globalAlpha = tGlobalAlpha;
        } else {
          tTransformedWrapper.drawTo(pSurface.context);
        }

        tTransformedWrapper.release();
      }
    } else if (tHasAlpha) {
      if (pCompiledMode) {
        pCode.push('var tGlobalAlpha = c.globalAlpha;');
        pCode.push('c.globalAlpha = ' + (tAlphaMultiplier + tAlphaAdd) + ';');
        pFunction(pSurface, pRecord, pCompiledMode, pCode);
        pCode.push('c.globalAlpha = tGlobalAlpha;');
      } else {
        tContext = pSurface.context;
        tGlobalAlpha = tContext.globalAlpha;
        tContext.globalAlpha = tAlphaMultiplier + tAlphaAdd;
        pFunction(pSurface, pRecord, pCompiledMode, pCode);
        tContext.globalAlpha = tGlobalAlpha;
      }
    } else {
      pFunction(pSurface, pRecord, pCompiledMode, pCode);
    }
  }

  function handleMaskShader(pSurface, pShader, pRecord, pStyleMode, pFunction, pCompiledMode, pCode) {
    var tBitmap;

    if (pStyleMode !== 'bitmap') {
      return;
    }

    tBitmap = pRecord.bitmap;

    if (pCompiledMode) {
      pCode.push('var tc = document.createElement(\'canvas\').getContext(\'2d\');');
      pCode.push('tc.canvas.width = ' + tBitmap.width + ';');
      pCode.push('tc.canvas.height = ' + tBitmap.height + ';');
      pCode.push('tc.drawImage(' + pSurface.resource(tBitmap) + ',0,0);');
      pCode.push('tc.globalCompositeOperation = \'destination-in\';');
      pCode.push('tc.drawImage(' + pSurface.resource(pShader.bitmap) + ',0,0);');
      pCode.push('c.drawImage(tc.canvas,0,0);');
      pCode.push('tc = null;');
    } else {
      var tTransformedWrapper = pSurface.requestCanvasWrapper(tBitmap.width, tBitmap.height);
      var tCompositeContext = tTransformedWrapper.context;
      tCompositeContext.drawImage(tBitmap, 0, 0);
      tCompositeContext.globalCompositeOperation = 'destination-in';
      tCompositeContext.drawImage(pShader.bitmap, 0, 0);
      tTransformedWrapper.drawTo(pSurface.context);
      tTransformedWrapper.release();
    }
  }

  HTMLCanvasSurface.addShaderHandler(benri.draw.Shader, handleShader);
  HTMLCanvasSurface.addShaderHandler(benri.draw.ColorShader, handleColorShader);
  HTMLCanvasSurface.addShaderHandler(benri.draw.LinearGradientShader, handleLinearGradientShader);
  HTMLCanvasSurface.addShaderHandler(benri.draw.RadialGradientShader, handleRadialGradientShader);
  HTMLCanvasSurface.addShaderHandler(benri.draw.BitmapShader, handleBitmapShader);
  HTMLCanvasSurface.addShaderHandler(benri.draw.ColorTransformShader, handleColorTransformShader);
  HTMLCanvasSurface.addShaderHandler(benri.draw.MaskShader, handleMaskShader);

}(this));