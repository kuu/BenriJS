/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A class to use when styling strokes.
   * @class
   * @extends {benri.draw.Style}
   */
  var StrokeStyle = (function(pSuper) {
    function StrokeStyle(pWidth) {
      pSuper.call(this);

      /**
       * The width of the stroke in pixels.
       * @type {number=1}
       */
      this.width = typeof pWidth === 'number' ? pWidth : 1;

      /**
       * The cap type of this stroke.
       * @type {string="round"}
       */
      this.cap = 'round';

      /**
       * The join type of this stroke.
       * @type {string="round"}
       */
      this.join = 'round';

      /**
       * The miter value of this stroke.
       * Only has an effect if the join is also set to miter.
       * @type {number=10}
       */
      this.miter = 10;
    }

    StrokeStyle.prototype = Object.create(pSuper.prototype);
    StrokeStyle.prototype.constructor = StrokeStyle;

    return StrokeStyle;
  })(global.benri.draw.Style);

  global.benri.draw.StrokeStyle = StrokeStyle;

}(this));