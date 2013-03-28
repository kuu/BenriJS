/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A shader that will mask the contents being rendered
   * using the bitmap supplied in the constructor
   * @class
   * @extends {benri.draw.Shader}
   */
  var MaskShader = (function(pSuper) {
    /**
     * @constructor
     * @param {object} pBitmap The bitmap to use as the mask
     */
    function MaskShader(pBitmap) {
      pSuper.call(this);

      /**
       * The bitmap to use as the mask.
       * @type {object}
       */
      this.bitmap = pBitmap;
    }

    MaskShader.prototype = Object.create(pSuper.prototype);
    MaskShader.prototype.constructor = MaskShader;

    return MaskShader;
  })(benri.draw.Shader);

  benri.draw.MaskShader = MaskShader;

}(this));
