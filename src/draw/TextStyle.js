/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A class to use when styling texts.
   * All geometric values are represented in the display coordinates.
   * @class
   * @extends {benri.draw.Style}
   */
  var TextStyle = (function(pSuper) {
    function TextStyle(pFont) {
      pSuper.call(this);

      /**
       * Color
       * @type {benri.draw.Font}
       */
      this.font = pFont;

      /**
       * Font
       * @type {benri.draw.Font}
       */
      this.font = pFont;

      /**
       * Font height.
       * @type {number}
       */
      this.fontHeight = 0;

      /**
       * Left margin.
       * @type {number}
       */
      this.leftMargin = 0;

      /**
       * Max width.
       * @type {number}
       */
      this.maxWidth = 0;

      /**
       * Actual text width (for glyphs)
       * @type {number}
       */
      this.textWidth = 0;

      /**
       * Top margin.
       * @type {number}
       */
      this.topMargin = 0;

      /**
       * Max height.
       * @type {number}
       */
      this.maxHeight = 0;

      /**
       * Align.
       * @type {string} 'left'/'right'/'center'
       */
      this.align = '';

      /**
       * Wrap.
       * True if the text wraps automatically when the end of line is reached.
       * @type {bool}
       */
      this.wrap = false;

      /**
       * Multiline.
       * True if the text field is multi-line.
       * @type {bool}
       */
      this.multiline = false;
    }

    TextStyle.prototype = Object.create(pSuper.prototype);
    TextStyle.prototype.constructor = TextStyle;

    return TextStyle;
  })(global.benri.draw.Style);

  global.benri.draw.TextStyle = TextStyle;

}(this));
