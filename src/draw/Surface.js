/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.draw.Surface = Surface;

  /**
   * A class for processing drawing records.
   * Each implementation of this class should be an implementation
   * for a particular platform or format (HTML Canvas, SVG, OpenGL, PNG, etc...)
   * @class
   * @param {number} pWidth  The width of the surface.
   * @param {number} pHeight The height of the surface.
   */
  function Surface(pWidth, pHeight) {
    /**
     * The width of this surface.
     * @type {number}
     */
    this.width = pWidth;

    /**
     * The height of this surface
     * @type {number}
     */
    this.height = pHeight;
  }

  /**
   * Sets the dimentions of this surface.
   * @param {number} pWidth  The width.
   * @param {number} pHeight The height.
   */
  Surface.prototype.setSize = function(pWidth, pHeight) {
    this.width = pWidth;
    this.height = pHeight;
  };

  /**
   * Adds drawing records to this surface to be processed.
   * @param {Array.<object>} pRecords The records to add.
   */
  Surface.prototype.addRecords = function(pRecords) {

  };

  /**
   * Clears all drawing records from this surface.
   * This also means all cache and bitmaps accociated
   * with the old records should be deleted.
   */
  Surface.prototype.clearRecords = function() {

  };

  /**
   * Flush all drawing commands.
   * What this means is implementation dependent.
   */
  Surface.prototype.flush = function() {

  };

  /**
   * Gets a bitmap representation of this surface.
   * When this is called, all draw commands must
   * be flushed first so that the bitmap returned
   * is a representation of the current draw records.
   * @return {object} The bitmap.
   */
  Surface.prototype.getBitmap = function() {
    this.flush();

    return null;
  };

}(this));