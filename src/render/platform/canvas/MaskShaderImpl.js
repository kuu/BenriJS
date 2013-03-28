/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var mRender = benri.render;
  var mShaders = mRender.fragmentShaders;
  var Style = benri.draw.Style;
  var MaskShader = benri.draw.MaskShader;

  function Impl(pShader) {
    var tStyle = this.style = new Style();
    tStyle.shader = new MaskShader(pShader.texture.bitmap);
  }

  mShaders.FragmentShader.addImplementation(
    mShaders.MaskShader,
    mRender.platform.canvas.CanvasRenderContext,
    Impl
  );

}(this));