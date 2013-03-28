/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A class to work with colours easily.
   * @class
   * @extends {Number}
   */
  var Color = (function(pSuper) {
    /**
     * @constructor
     * @param {number} pRed   Red value from 0 to 255.
     * @param {number} pGreen Green value from 0 to 255.
     * @param {number} pBlue  Blue value from 0 to 255.
     * @param {number} pAlpha Alpha value from 0 to 255.
     */
    function Color(pRed, pGreen, pBlue, pAlpha) {
      /**
       * The colour itself is stored as a single number.
       * @type {number}
       */
      this.value =
        ((pRed ? pRed << 24 : 0) +
        (pGreen ? pGreen << 16 : 0) +
        (pBlue ? pBlue << 8 : 0) +
        (pAlpha ? pAlpha : 0)) >>> 0;
    }

    Color.prototype = Object.create(pSuper.prototype);
    Color.prototype.constructor = Color;

    /**
     * @inheritDoc
     */
    Color.prototype.valueOf = function() {
      return this.value;
    };

    /**
     * @inheritDoc
     */
    Color.prototype.toString = function() {
      return pSuper.prototype.toString.apply(this.value, arguments);
    }

    /**
     * Get the CSS String representation of this colour.
     * @return {string} The CSS String representation of this colour.
     */
    Color.prototype.toCSSString = function() {
      var tValue = this.value;
      return 'rgba(' +
        (tValue >>> 24 & 0xFF) + ',' +
        (tValue >>> 16 & 0xFF) + ',' +
        (tValue >>> 8 & 0xFF) + ',' +
        ((tValue & 0xFF) / 255) + ')';
    };

    /**
     * Sets this Color to the specified values.
     * @param {number} pRed   The red value.
     * @param {number} pGreen The green value.
     * @param {number} pBlue  The blue value.
     * @param {number} pAlpha The alpha value.
     */
    Color.prototype.setRGBA = function(pRed, pGreen, pBlue, pAlpha) {
      this.value =
        ((pRed ? pRed << 24 : 0) +
        (pGreen ? pGreen << 16 : 0) +
        (pBlue ? pBlue << 8 : 0) +
        (pAlpha ? pAlpha : 0)) >>> 0;
    };

    /**
     * Gets the red, green, blue and alpha components of
     * this Color separately.
     * @return {Array.<number>} An array of size 4 that contains each of the colour channels.
     */
    Color.prototype.getRGBA = function() {
      var tValue = this.value;
      return [
        tValue >>> 24 & 0xFF,
        tValue >>> 16 & 0xFF,
        tValue >>> 8 & 0xFF,
        tValue & 0xFF
      ];
    };

    /**
     * Gets the copy of this object.
     * @return {benri.draw.Color} The copy object.
     */
    Color.prototype.clone = function() {
      var tCopy = new Color(0, 0, 0, 0);
      tCopy.value = this.value;
      return tCopy;
    };

    return Color;
  })(Number);

  global.benri.draw.Color = Color;

}(this));
