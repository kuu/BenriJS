/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A shader that will transform all colours being drawn.
   * @class
   * @extends {benri.draw.Shader}
   */
  var ColorTransformShader = (function(pSuper) {
    /**
     * @constructor
     * @param {number} pRedMult   The amount to multiply red by.
     * @param {number} pGreenMult The amount to multiply green by.
     * @param {number} pBlueMult  The amount to multiply blue by.
     * @param {number} pAlphaMult The amount to multiply alpha by.
     * @param {number} pRedAdd    The amount to add to red.
     * @param {number} pGreenAdd  The amount to add to green.
     * @param {number} pBlueAdd   The amount to add to blue.
     * @param {number} pAlphaAdd  The amount to add to alpha.
     */
    function ColorTransformShader(pRedMult, pGreenMult, pBlueMult, pAlphaMult, pRedAdd, pGreenAdd, pBlueAdd, pAlphaAdd) {
      pSuper.call(this);

      /**
       * The amount to multiply red by.
       * @type {number}
       */
      this.redMultiplier = pRedMult;

      /**
       * The amount to multiply green by.
       * @type {number}
       */
      this.greenMultiplier = pGreenMult;

      /**
       * The amount to multiply blue by.
       * @type {number}
       */
      this.blueMultiplier = pBlueMult;

      /**
       * The amount to multiply alpha by.
       * @type {number}
       */
      this.alphaMultiplier = pAlphaMult;

      /**
       * The amount to add to red.
       * @type {number}
       */
      this.redAdd = pRedAdd;

      /**
       * The amount to add to green.
       * @type {number}
       */
      this.greenAdd = pGreenAdd;

      /**
       * The amount to add to blue.
       * @type {number}
       */
      this.blueAdd = pBlueAdd;

      /**
       * The amount to add to alpha.
       * @type {number}
       */
      this.alphaAdd = pAlphaAdd;
    }

    ColorTransformShader.prototype = Object.create(pSuper.prototype);
    ColorTransformShader.prototype.constructor = ColorTransformShader;

    return ColorTransformShader;
  })(benri.draw.Shader);

  benri.draw.ColorTransformShader = ColorTransformShader;

}(this));