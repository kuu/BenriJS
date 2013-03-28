/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Matrix2D = benri.geometry.Matrix2D;

  /**
   * A shader that allows to you use a bitmap
   * as a pattern over a shape when drawing.
   * @class
   * @extends {benri.draw.Shader}
   */
  var BitmapShader = (function(pSuper) {
    /**
     * @constructor
     * @param {object} pBitmap The bitmap to use for drawing.
     */
    function BitmapShader(pBitmap) {
      pSuper.call(this);

      /**
       * The bitmap to use for drawing.
       * @type {object}
       */
      this.bitmap = pBitmap;

      /**
       * A transformation matrix to apply to the bitmap while drawing.
       * @type {benri.geometry.Matrix2D}
       */
      this.matrix = new Matrix2D();
    }

    BitmapShader.prototype = Object.create(pSuper.prototype);
    BitmapShader.prototype.constructor = BitmapShader;

    return BitmapShader;
  })(benri.draw.Shader);

  benri.draw.BitmapShader = BitmapShader;

}(this));