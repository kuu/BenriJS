/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  var HTMLCanvasSurface = benri.draw.platform.html.HTMLCanvasSurface;

  function handleStyle(pSurface, pStyle, pCompiledMode, pCode) {
    if (pCompiledMode) {
      pCode.push('c.globalCompositeOperation = \'' + pStyle.compositor + '\';');
    } else {
      pSurface.context.globalCompositeOperation = pStyle.compositor;
    }
  }

  function handleStrokeStyle(pSurface, pStyle, pCompiledMode, pCode) {
    var tContext;

    handleStyle(pSurface, pStyle, pCompiledMode, pCode);

    if (pCompiledMode) {
      pCode.push('c.lineWidth = ' + pStyle.width + ';');
      pCode.push('c.lineCap = \'' + pStyle.cap + '\';');
      pCode.push('c.lineJoin = \'' + pStyle.join + '\';');

      if (pStyle.join === 'miter') {
        pCode.push('c.miterLimit = ' + pStyle.miter + ';');
      }
    } else {
      tContext = pSurface.context;
      tContext.lineWidth = pStyle.width;
      tContext.lineCap = pStyle.cap;
      tContext.lineJoin = pStyle.join;

      if (pStyle.join === 'miter') {
        tContext.miterLimit = pStyle.miter;
      }
    }
  }

  function handleTextStyle(pSurface, pStyle, pCompiledMode, pCode) {
    handleStyle(pSurface, pStyle, pCompiledMode, pCode);
  }

  HTMLCanvasSurface.addStyleHandler(benri.draw.Style, handleStyle);
  HTMLCanvasSurface.addStyleHandler(benri.draw.StrokeStyle, handleStrokeStyle);
  HTMLCanvasSurface.addStyleHandler(benri.draw.TextStyle, handleTextStyle);

}(this));