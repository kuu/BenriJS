/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var ColorShader = global.benri.draw.ColorShader;

  /**
   * A base class for all styles that Canvas uses.
   * @class
   */
  function Style() {
    /**
     * The shader currently in effect on this Style.
     * @type {benri.draw.Shader=}
     */
    this.shader = null;

    /**
     * The composition mode for this Style.
     * The only modes gurunteed to be supported are:
     *   * source-over
     *   * source-in
     *   * source-out
     *   * source-atop
     *   * destination-over
     *   * destination-in
     *   * destination-out
     *   * destination-atop
     *   * copy
     *   * xor
     * @type {string="source-over"}
     */
    this.compositor = 'source-over';
  }

  /**
   * Sets the colour of this Style.
   * In reality this is setting a ColorShader
   * to the shader property.
   * Therefore any shader applied currently
   * will be overridden.
   * @param {benri.draw.Color} pColor The Color to set.
   */
  Style.prototype.setColor = function(pColor) {
    this.shader = new ColorShader(pColor);
  };

  /**
   * Gets teh colour of this Style.
   * @return {benri.draw.Color|null} The Color if the shader is a ColorShader. Null otherwise
   */
  Style.prototype.getColor = function() {
    if (this.shader.constructor !== ColorShader) {
      return null;
    }

    return this.shader.color.clone();
  }

  /**
   * Gets the copy of this Style.
   * @return {benri.draw.Style} Copy object
   */
  Style.prototype.clone = function() {
    var tCopy = new Style();
    tCopy.setColor(this.getColor());
    tCopy.compositor = this.compositor;
    return tCopy;
  }

  global.benri.draw.Style = Style;

}(this));
