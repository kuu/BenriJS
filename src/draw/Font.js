/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.draw.Font = Font;

  /**
   * A class holding font info.
   * All geometric values are represented in the em square coordinates.
   * @class
   * @constructor
   */
  function Font() {

    /**
     * Name of this font.
     * @type {string}
     */
    this.name = '';

    /**
     * The size of the glyph's imaginary square, e.g. EM square.
     * @type {number}
     */
    this.dimension = 1024;

    /**
     * Font ascent.
     * @type {number}
     */
    this.ascent = 0;

    /**
     * Font descent.
     * @type {number}
     */
    this.descent = 0;

    /**
     * Font leading.
     * @type {number}
     */
    this.leading = 0;

    /**
     * Character to glyph mapping.
     * @type {Object}
     * @private
     */
    this._glyph = {};

    /**
     * Whether this is an italic font.
     * @type {bool}
     */
    this.italic = false;

    /**
     * Whether this is a bold font.
     * @type {bool}
     */
    this.bold = false;

    /**
     * Whether this is a system font.
     * @type {bool}
     */
    this.system = false;
  }

  /**
   * Sets the glyph data for a character.
   * @param {number} pCharCode Character code.
   * @param {benri.draw.Glyph} pGlyph The glyph data.
   */
  Font.prototype.setGlyph = function(pCharCode, pGlyph) {
    this._glyph[pCharCode + ''] = pGlyph;
  };

  /**
   * Retrieve the glyph data for a character.
   * @param {number} pCharCode The character code.
   * @return {benri.draw.Glyph} The glyph data.
   */
  Font.prototype.getGlyph = function(pCharCode) {
    return this._glyph[pCharCode + ''];
  };

}(this));
