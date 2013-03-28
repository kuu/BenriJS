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
  var ColorTransformShader = benri.draw.ColorTransformShader;

  function Impl(pShader) {
    var tStyle = this.style = new Style();
    tStyle.shader = new ColorTransformShader(
      pShader.redMultiplier,
      pShader.greenMultiplier,
      pShader.blueMultiplier,
      pShader.alphaMultiplier,
      pShader.redAdd,
      pShader.greenAdd,
      pShader.blueAdd,
      pShader.alphaAdd
    );
  }

  mShaders.FragmentShader.addImplementation(
    mShaders.ColorTransformShader,
    mRender.platform.canvas.CanvasRenderContext,
    Impl
  );

}(this));