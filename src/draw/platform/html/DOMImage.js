/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {benri.draw.Image}
   */
  var DOMImage = (function(pSuper) {
    /**
     * @constructor
     */
    function DOMImage(pImage) {
      pSuper.call(this);
      this._domImage = pImage;
    }
  
    DOMImage.prototype = Object.create(pSuper.prototype);
    DOMImage.prototype.constructor = DOMImage;
  
    return DOMImage;
  })(benri.draw.Image);

  global.benri.draw.platform.html.DOMImage = DOMImage;

}(this));