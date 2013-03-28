/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.render.platform.webgl = benri.render.platform.webgl || {};

  /**
   * @class
   * @extends {benri.render.RenderContext}
   */
  var WebGLRenderContext = (function(pSuper) {
    function WebGLRenderContext(pWidth, pHeight) {
      pSuper.call(this, pWidth, pHeight);
      this.webglCanvas = null;
    }

    WebGLRenderContext.prototype = Object.create(pSuper.prototype);
    WebGLRenderContext.prototype.constructor = WebGLRenderContext;

    return WebGLRenderContext;
  })(benri.render.RenderContext);

  benri.render.platform.webgl.WebGLRenderContext = WebGLRenderContext;

}(this));