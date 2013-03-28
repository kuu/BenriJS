/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  function Image() {

  }

  Image.prototype.getRaw = function() {
  	return null;
  };

  Image.prototype.setRaw = function() {

  };

  Image.prototype.getWidth = function() {
    if (this._width) {
      return this._width;
    }

    return 0;
  };

  Image.prototype.getHeight = function() {
    if (this._height) {
      return this._height;
    }

    return 0;
  };

  Image.prototype.getBytes = function(pX, pY, pWidth, pHeight, pStride) {
    if (this._bytes) {
      return this._bytes.slice(0);
    }

    return null;
  };

  Image.prototype.setBytes = function(pBytes, pX, pY, pWidth, pHeight, pStride) {
    if (!this._bytes) {
      
    }
  };

  global.benri.draw.Image = Image;

}(this));