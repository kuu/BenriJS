/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Canvas = benri.draw.Canvas;

  benri.render.platform.canvas = benri.render.platform.canvas || {};

  /**
   * @class
   * @extends {benri.render.RenderContext}
   */
  var CanvasRenderContext = (function(pSuper) {
    function CanvasRenderContext(pWidth, pHeight) {
      pSuper.call(this, pWidth, pHeight);
    }

    CanvasRenderContext.prototype = Object.create(pSuper.prototype);
    CanvasRenderContext.prototype.constructor = CanvasRenderContext;

    CanvasRenderContext.prototype.createBuffer = function(pWidth, pHeight) {
      var tId = pSuper.prototype.createBuffer.call(this, pWidth, pHeight);

      this.buffers[tId].data = {
        canvas: new Canvas(pWidth, pHeight),
        refs: 0,
        released: false
      };

      return tId;
    };

    CanvasRenderContext.prototype.destroyBuffer = function(pId) {
      var tBuffer = this.buffers[pId];

      if (tBuffer !== void 0) {
        if (tBuffer.data.refs === 0) {
          tBuffer.data.canvas.destroy();
        } else {
          tBuffer.data.released = true;
        }
      }

      pSuper.prototype.destroyBuffer.call(this, pId);
    };

    CanvasRenderContext.prototype.setCanvas = function(pCanvas) {
      this.buffers[this.activeBuffer].data.canvas = pCanvas;
    };

    CanvasRenderContext.prototype.renderTexture = function(pTexture, pSourceRect, pDestRect, pShader) {
      var tCanvas = this.buffers[this.activeBuffer].data.canvas;
      var tStyle = pShader ? pShader.impl.style : null;
      tCanvas.matrix = this.matrix.clone();

      if (pSourceRect) {
        if (pDestRect) {
          tCanvas.drawBitmapWithRect(
            pTexture.bitmap,
            pDestRect,
            pSourceRect,
            tStyle
          );
        } else {
          tCanvas.drawBitmapWithRect(
            pTexture.bitmap,
            new Rect(new Point(0, 0), tCanvas.width, tCanvas.height),
            pSourceRect,
            tStyle
          );
        }
      } else if (pDestRect) {
        tCanvas.drawBitmapWithRect(
          pTexture.bitmap,
          pDestRect,
          new Rect(new Point(0, 0), tCanvas.width, tCanvas.height),
          tStyle
        );
      } else {
        tCanvas.drawBitmap(pTexture.bitmap, void 0, void 0, tStyle);
      }
    };

    CanvasRenderContext.prototype.renderToTexture = function(pTexture, pShader) {
      if (!pTexture) {
        pTexture = this.createEmptyTexture(this.width, this.height);
      }

      var tCanvas = this.buffers[this.activeBuffer].data.canvas;

      var tCompositeCanvas = new Canvas(pTexture.width, pTexture.height);
      tCompositeCanvas.drawBitmap(tCanvas.getBitmap(), 0, 0, pShader ? pShader.impl.style : null);
      pTexture.bitmap = tCompositeCanvas.getBitmap();
      //tCompositeCanvas.destroy();

      return pTexture;
    };

    CanvasRenderContext.prototype.renderBuffer = function(pId, pShader) {
      var tBuffer = this.buffers[pId];
      var tData = tBuffer.data;

      if (tBuffer === void 0) {
        return;
      }

      var tCanvas = this.buffers[this.activeBuffer].data.canvas;
      tCanvas.matrix = this.matrix.clone();

      tData.refs++;

      var getBitmapBackup = tCanvas.getBitmap;

      tCanvas.getBitmap = function() {
        var tBitmap = getBitmapBackup.call(this);

        if (--tData.refs === 0 && tData.released === true) {
          tData.canvas.destroy();
        }

        tCanvas.getBitmap = getBitmapBackup;

        return tBitmap;
      };

      tCanvas.drawBitmap(
        tData.canvas.getBitmap(),
        void 0,
        void 0,
        pShader ? pShader.impl.style : null
      );
    };

    CanvasRenderContext.prototype.clear = function() {
      this.buffers[this.activeBuffer].data.canvas.matrix = this.matrix.clone();
      this.buffers[this.activeBuffer].data.canvas.clear(this.backgroundColor);
    };

    CanvasRenderContext.prototype.flush = function() {
      this.buffers[this.activeBuffer].data.canvas.getBitmap();
    };

    return CanvasRenderContext;
  })(benri.render.RenderContext);

  benri.render.platform.canvas.CanvasRenderContext = CanvasRenderContext;

}(this));