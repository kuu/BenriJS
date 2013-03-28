/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Texture = benri.render.Texture;

  /**
   * @class
   * @extends {benri.render.Renderable}
   */
  var CanvasRenderable = (function(pSuper) {
    /**
     * @constructor
     * @param {benri.draw.Canvas} pCanvas The Canvas to render.
     */
    function CanvasRenderable(pCanvas) {
      pSuper.call(this);
      this.canvas = pCanvas;
      this.texture = null;
    }

    CanvasRenderable.prototype = Object.create(pSuper.prototype);
    CanvasRenderable.prototype.constructor = CanvasRenderable;

    /**
     * @inheritDoc
     */
    CanvasRenderable.prototype.prepare = function(pRenderContext) {
      var tWasDirty = this.canvas.isDirty();
      var tTexture = this.texture;

      this.canvas.flush();

      if (tTexture === null) {
        this.texture = pRenderContext.createTexture(this.canvas.getBitmap(), 'none', 'none');
      } else if (tWasDirty === true) {
        tTexture.bitmap = this.canvas.getBitmap();
        tTexture.width = tTexture.bitmap.width;
        tTexture.height = tTexture.bitmap.height;

        pRenderContext.updateTexture(tTexture);
      }
    };

    /**
     * @inheritDoc
     */
    CanvasRenderable.prototype.render = function(pRenderContext) {
      if (this.texture === null || this.canvas.isDirty() === true) {
        this.prepare(pRenderContext);
      }

      pRenderContext.renderTexture(this.texture);
    };

    return CanvasRenderable;
  })(benri.render.Renderable);

  benri.render.CanvasRenderable = CanvasRenderable;

}(this));