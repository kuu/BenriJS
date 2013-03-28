/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.render.Renderable = Renderable;

  /**
   * A simple object for helping managing rendering
   * to RenderContexts.
   * @constructor
   */
  function Renderable() {

  }

  Renderable.constructor = Renderable;

  /**
   * Prepares this Renderable in the given RenderContext.
   * @param  {benri.render.RenderContext} pRenderContext The RenderContext to prepare in.
   */
  Renderable.prototype.prepare = function(pRenderContext) {

  };

  /**
   * Renders this Renderable in the given RenderContext.
   * @param  {benri.render.RenderContext} pRenderContext The RenderContext to render in.
   */
  Renderable.prototype.render = function(pRenderContext) {

  };

}(this));