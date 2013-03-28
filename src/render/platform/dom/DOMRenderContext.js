/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.render.platform.dom = benri.render.platform.dom || {};

  /**
   * @class
   * @extends {benri.render.RenderContext}
   */
  var DOMRenderContext = (function(pSuper) {
    /**
     * @constructor
     */
    function DOMRenderContext(pWidth, pHeight) {
      pSuper.call(this, pWidth, pHeight);

    }

    DOMRenderContext.prototype = Object.create(pSuper.prototype);
    DOMRenderContext.prototype.constructor = DOMRenderContext;

    return DOMRenderContext;
  })(benri.render.RenderContext);

  benri.render.platform.dom.DOMRenderContext = DOMRenderContext;

}(this));