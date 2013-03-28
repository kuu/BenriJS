/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * A shader that simply colours what is being drawn.
 * @class
 * @extends {benri.draw.Shader}
 */
benri.draw.ColorShader = (function(pSuper) {
  /**
   * @constructor
   * @param {benri.draw.Color} pColor The Color to shade with.
   */
  function ColorShader(pColor) {
    pSuper.call(this);

    /**
     * The Color to shade with
     * @type {benri.draw.Color}
     */
    this.color = pColor;
  }

  ColorShader.prototype = Object.create(pSuper.prototype);
  ColorShader.prototype.constructor = ColorShader;

  return ColorShader;
})(benri.draw.Shader);
