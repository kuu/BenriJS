/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var mShaders = global.benri.render.fragmentShaders;

  /**
   * @class
   * @extends {benri.render.fragmentShaders.FragmentShader}
   */
  var ColorTransformShader = (function(pSuper) {
    function ColorTransformShader(pRenderContext, pRedMult, pGreenMult, pBlueMult, pAlphaMult, pRedAdd, pGreenAdd, pBlueAdd, pAlphaAdd) {
      this.redMultiplier = pRedMult;
      this.greenMultiplier = pGreenMult;
      this.blueMultiplier = pBlueMult;
      this.alphaMultiplier = pAlphaMult;
      this.redAdd = pRedAdd;
      this.greenAdd = pGreenAdd;
      this.blueAdd = pBlueAdd;
      this.alphaAdd = pAlphaAdd;
      pSuper.call(this, pRenderContext);
    }

    ColorTransformShader.prototype = Object.create(pSuper.prototype);
    ColorTransformShader.prototype.constructor = ColorTransformShader;

    return ColorTransformShader;
  })(mShaders.FragmentShader);

  mShaders.ColorTransformShader = ColorTransformShader;

}(this));
