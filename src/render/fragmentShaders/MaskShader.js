/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var mShaders = global.benri.render.fragmentShaders;

  /**
   * @class
   * @extends {benri.render.fragmentShaders.FragmentShader}
   */
  var MaskShader = (function(pSuper) {
    function MaskShader(pRenderContext, pTexture) {
      this.texture = pTexture;
      pSuper.call(this, pRenderContext);
    }

    MaskShader.prototype = Object.create(pSuper.prototype);
    MaskShader.prototype.constructor = MaskShader;

    return MaskShader;
  })(mShaders.FragmentShader);

  mShaders.MaskShader = MaskShader;

}(this));