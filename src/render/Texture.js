/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.render.Texture = Texture;

  /**
   * A simple class to represent a texture.
   * @class
   * @param {object} pBitmap The bitmap to use in this texture.
   * @param {string="none"} pWrapS How to wrap on the S axis.
   * @param {string="none"} pWrapT How to wrap on the Y axis.
   */
  function Texture(pBitmap, pWrapS, pWrapT) {
    this.id = -1;
    this.bitmap = pBitmap;
    // Types are repeat, mirror, clamp, none
    this.wrapS = pWrapS || 'none';
    this.wrapT = pWrapT || 'none';

    if (pBitmap) {
      this.width = pBitmap.width;
      this.height = pBitmap.height;
    }
  }

}(this));