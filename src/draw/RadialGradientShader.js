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
   * @class
   * @extends {benri.draw.Shader}
   */
  benri.draw.RadialGradientShader = (function(pSuper) {
    /**
     * @constructor
     * @param {benri.geometry.Point} pStartPoint The starting point (0.0) of the gradient.
     * @param {number} pRadius   The radius from the centre of this gradient.
     * @param {Array.<number>} pPositions  An array of positions of colour stops ranging from 0 to 1.
     * @param {Array.<Color>} pColors     An array of Colors in tandum with the positions.
     */
    function RadialGradientShader(pStartPoint, pRadius, pPositions, pColors) {
      pSuper.call(this);

      /**
       * The starting point (0.0) of the gradient.
       * @type {benri.geometry.Point}
       */
      this.startPoint = pStartPoint;

      /**
       * The radius from the centre of this gradient.
       * @type {number}
       */
      this.radius = pRadius;

      /**
       * A transformation matrix to apply to this gradient.
       * @type {benri.geometry.Matrix2D}
       */
      this.matrix = new Matrix2D();

      pPositions = pPositions || [];
      pColors = pColors || [];

      if (pPositions.length !== pColors.length) {
        throw new Error('Positions and colors length do not match');
      }

      /**
       * An array of positions of colour stops ranging from 0 to 1.
       * @type {Array.<number>}
       */
      this.positions = pPositions;

      /**
       * An array of Colors in tandum with the positions.
       * @type {Array.<Color>}
       */
      this.colors = pColors;
    }

    RadialGradientShader.prototype = Object.create(pSuper.prototype);
    RadialGradientShader.prototype.constructor = RadialGradientShader;

    /**
     * Adds a new Color at the specified position (0 to 1) of this gradient.
     * @param {number} pPosition The position ranging from 0 to 1.
     * @param {benri.draw.Color} pColor The Color.
     */
    RadialGradientShader.prototype.addStop = function(pPosition, pColor) {
      this.positions.push(pPosition);
      this.colors.push(pColor);
    };

    return RadialGradientShader;
  })(benri.draw.Shader);

}(this));