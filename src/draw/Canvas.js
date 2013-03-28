/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Matrix2D = benri.geometry.Matrix2D;
  var Path = benri.geometry.Path;
  var Point = benri.geometry.Point;
  var Rect = benri.geometry.Rect;
  var Style = benri.draw.Style;
  var StrokeStyle = benri.draw.StrokeStyle;
  var TextStyle = benri.draw.TextStyle;
  var Records = benri.draw.Records;

  benri.draw.Canvas = Canvas;

  /**
   * A class for drawing 2D bitmaps on to a surface.
   * @class
   * @constructor
   * @param {number} pWidth  The width of the canvas.
   * @param {number} pHeight The height of the canvas.
   */
  function Canvas(pWidth, pHeight) {
    // Finalizes the matrix support.
    Matrix2D.initExtention(this);

    /**
     * The width of this Canvas in pixels.
     * @type {number}
     */
    this.width = pWidth;

    /**
     * The height of this Canvas in pixels.
     * @type {number}
     */
    this.height = pHeight;

    /**
     * The stack used in save and restore calls.
     * @private
     * @type {Array}
     */
    this._stack = [];

    /**
     * The current draw command records that have
     * yet to be flushed to the surface.
     * @type {Array}
     */
    this.records = [];

    /**
     * The Surface of this Canvas.
     * @type {benri.draw.Surface}
     */
    this.surface = null;

    /**
     * Holds the last used matrix.
     * @private
     * @type {benri.geometry.Matrix2D}
     */
    this._lastMatrix = this.matrix.clone();

    /**
     * Holds the states of each layer in the Canvas.
     * @private
     * @type {Array}
     */
    this._layerStates = [];
  }

  /**
   * The defaultSurface class to be used
   * when a specific surface was not specified
   * to be used.
   * @type {function(new:benri.draw.Surface)}
   */
  Canvas.defaultSurface = null;

  // Extends this Canvas to support Matrix functions.
  Matrix2D.extend(Canvas.prototype);

  /**
   * Sets the surface for this Canvas
   * @param {benri.draw.Surface} pSurface The Surface.
   */
  Canvas.prototype.setSurface = function(pSurface) {
    this.surface = pSurface;
  };

  /**
   * Copies records from one array to the other.
   */
  function copyRecords(pSrc, pDest) {
    for (var i = 0, il = pSrc.length; i < il; i++) {
      pDest.push(pSrc[i]);
    }
  }

  /**
   * Returns true if the this Canvas is dirty and needs to be flushed.
   * @return {boolean}
   */
  Canvas.prototype.isDirty = function() {
    return this.records.length !== 0;
  };

  /**
   * If the current matrix has not yet been
   * added as a record for the surface, add it now.
   * @private
   */
  Canvas.prototype._syncMatrix = function() {
    if (!this.matrix.equals(this._lastMatrix)) {
      this.records.push({
        type: 'matrix',
        matrix: this.matrix.clone()
      });

      this._lastMatrix = this.matrix.clone();
    }
  };

  /**
   * Fill the given Path with the given Style.
   * @param  {benri.geometry.Path} pPath  The Path to fill.
   * @param  {benri.draw.Style} pStyle The Style to use to fill.
   */
  Canvas.prototype.fillPath = function(pPath, pStyle) {
    var tRecords = this.records;

    this._syncMatrix();

    tRecords.push({
      type: 'path'
    });

    copyRecords(pPath.records, tRecords);

    tRecords.push({
      type: 'fill',
      style: pStyle || new Style()
    });
  };

  /**
   * Stroke the given Path with the given StrokeStyle.
   * @param  {benri.geometry.Path} pPath The Path to stroke.
   * @param  {benri.draw.StrokeStyle} pStrokeStyle The StrokeStyle to use to stroke.
   */
  Canvas.prototype.strokePath = function(pPath, pStrokeStyle) {
    var tRecords = this.records;

    this._syncMatrix();

    tRecords.push({
      type: 'path'
    });

    copyRecords(pPath.records, tRecords);

    tRecords.push({
      type: 'stroke',
      style: pStrokeStyle || new StrokeStyle()
    });
  };

  /**
   * Fill the given Rect with the given Style.
   * @param  {benri.geometry.Rect} pRect  The Rect to fill.
   * @param  {benri.draw.Style} pStyle The Style to use to fill.
   */
  Canvas.prototype.fillRect = function(pRect, pStyle) {
    this.fillPath(pRect.getPath(), pStyle);
  };

  /**
   * Stroke the given Rect with the given StrokeStyle.
   * @param  {benri.geometry.Rect} pRect  The Rect to stroke.
   * @param  {benri.draw.StrokeStyle} pStrokeStyle The StrokeStyle to use to stroke.
   */
  Canvas.prototype.strokeRect = function(pRect, pStrokeStyle) {
    this.strokePath(pRect.getPath(), pStrokeStyle);
  };

  /**
   * Draws the given bitmap to this Canvas using the given Style
   * @param  {object} pBitmap The bitmap to draw.
   * @param  {number=0} pDestX  The x coordinate to start the draw at.
   * @param  {number=0} pDestY  The y coordinate to start the draw at.
   * @param  {benri.draw.Style} pStyle  The Style to use to draw the bitmap.
   */
  Canvas.prototype.drawBitmap = function(pBitmap, pDestX, pDestY, pStyle) {
    this._syncMatrix();
    this.records.push({
      type: 'fastBitmap',
      bitmap: pBitmap,
      point: new Point(pDestX || 0, pDestY || 0),
      style: pStyle || new Style()
    });
  };

  /**
   * Draws the given bitmap to this Canvas using the given Style
   * at the given position.
   * @param  {object} pBitmap The bitmap to draw.
   * @param  {benri.geometry.Rect} pDestRect  The destination on this Canvas to draw to.
   * @param  {benri.geometry.Rect} pSourceRect  The source rect to sample from to draw to the Canvas.
   * @param  {benri.draw.Style} pStyle  The Style to use to draw the bitmap.
   */
  Canvas.prototype.drawBitmapWithRects = function(pBitmap, pDestRect, pSourceRect, pStyle) {
    this._syncMatrix();
    this.records.push({
      type: 'bitmap',
      bitmap: pBitmap,
      destRect: pDestRect,
      srcRect: pSourceRect,
      style: pStyle
    });
  };

  /**
   * Draws text to the Canvas.
   * @param  {string} pText The text to draw.
   * @param  {benri.draw.TextStyle} pStyle  The Style to use to draw the text.
   */
  Canvas.prototype.drawText = function(pText, pStyle) {
    this._syncMatrix();
    var tFont = pStyle.font;

    if (tFont.system) {
      // Draw using system font.
      this.records.push({
          type: 'text',
          text: pText,
          style: pStyle
        });
    } else {
      // Draw using glyph data.
      var tCharCode, tGlyph, tRecords,
          tFontScale = pStyle.fontHeight / tFont.dimension,
          tXPos = pStyle.leftMargin, tYPos = pStyle.topMargin, tInitialXPos,
          tTextColor = pStyle.getColor(),
          tTextColorValue = tTextColor.valueOf(),
          tThisRecords = new Records(this.records);

      // Adjust the alignment
      if (pStyle.align === 'center') {
        tXPos = (pStyle.maxWidth -  pStyle.textWidth) / 2;
      } else if (pStyle.align === 'right') {
        tXPos = pStyle.maxWidth -  pStyle.textWidth;
      }
      tXPos = tXPos < 0 ? 0 : tXPos;
      tInitialXPos = tXPos;

      // Iterate on each char.
      for (var i = 0, il = pText.length; i < il; i++) {
        tCharCode = pText.charCodeAt(i);
        if (tCharCode === 10 || tCharCode === 13) {
          tXPos = tInitialXPos;
          tYPos += pStyle.fontHeight + (tFont.leading ? tFont.leading * tFontScale : 0);
          continue;
        }
        tGlyph = tFont.getGlyph(tCharCode);
        if (!tGlyph) continue;
        tRecords = tGlyph.data;
        // Applying patch to the glyph data.
        tRecords.filter('matrix', function (pRecord) {
            // Update transform matrix.
            pRecord.matrix.fill([tFontScale, 0, 0, tFontScale, tXPos, tYPos]);
          });
        tRecords.filter('fill stroke', function (pRecord) {
            // Update color.
            var tGlyphColor = pRecord.style.getColor();
            if (tGlyphColor.valueOf() !== tTextColorValue) {
              pRecord.style.setColor(tTextColor);
            }
          });
        // Append the glyph data to this.record
        tRecords = tRecords.deepCopy();
        tThisRecords.concat(tRecords);
        // Calculate the glyph's position.
        tXPos += Math.floor(tGlyph.advance * tFontScale);
      }
    }
  };

  /**
   * Clears the Canvas with the given Color.
   * @param  {benri.draw.Color} pColor The Color to clear with.
   */
  Canvas.prototype.clear = function(pColor) {
    if (this.surface !== null) {
      this.surface.clearRecords();
    }

    this.records.length = 0;

    this._syncMatrix();

    this.records.push({
      type: 'clearColor',
      color: pColor
    });
  };

  /**
   * Flush the drawing records of this Canvas to the underlying Surface.
   */
  Canvas.prototype.flush = function() {
    var tSurface = this.surface;

    if (!tSurface) {
      if (benri.draw.Canvas.defaultSurface !== null) {
        tSurface = this.surface = new benri.draw.Canvas.defaultSurface(this.width, this.height);
      } else {
        return;
      }
    }

    if (!this.isDirty()) {
      return;
    }

    tSurface.addRecords(this.records);

    this.records.length = 0;
  };

  /**
   * Gets a bitmap representation of this Canvas.
   * When this is called, all draw commands must
   * be flushed first so that the bitmap returned
   * is a representation of the current draw records.
   * @return {object} The bitmap.
   */
  Canvas.prototype.getBitmap = function() {
    this.flush();

    if (this.surface === null) {
      return null;
    }

    return this.surface.getBitmap();
  };

  /**
   * Saves the current state of this Canvas.
   * Currently this only saves the current matrix.
   */
  Canvas.prototype.save = function() {
    this._stack.push({
      matrix: this.matrix.clone()
    });
  };

  /**
   * Enter a new layer in this Canvas.
   * A layer will give you a clean Canvas to work with
   * with the same matrix applied to it.
   * When you want to draw this layer to the main
   * Canvas or a parent layer, call leaveLayer.
   * @param  {benri.geometry.Rect=} pRect The size and position of the layer.
   */
  Canvas.prototype.enterLayer = function(pRect) {
    this._syncMatrix();

    this._layerStates.push({
      matrix: this.matrix.clone(),
      lastMatrix: this._lastMatrix.clone()
    });

    this.matrix.identity();
    this._lastMatrix.identity();

    // TODO: Not handling this Rect yet. Need to implement 100%.

    this.records.push({
      type: 'layer',
      rect: pRect || new Rect(new Point(0, 0), this.width, this.height)
    });
  };

  /**
   * Leaves the current layer and draws it to the
   * parent layer or actual Canvas.
   */
  Canvas.prototype.leaveLayer = function() {
    var tState = this._layerStates.pop();
    this.matrix = tState.matrix;
    this._lastMatrix = tState.lastMatrix;

    this.records.push({
      type: 'endLayer'
    });
  };

  /**
   * Restores a state previously saved by a call to save.
   */
  Canvas.prototype.restore = function() {
    var tState = this._stack.pop();
    this.matrix = tState.matrix;
  };

  /**
   * Returns benri.draw.Records object.
   */
  Canvas.prototype.getRecords = function(pDontCopy) {
    if (pDontCopy) {
      return new Records(this.records);
    } else {
      return new Records(this.records).deepCopy();
    }
  };

  /**
   * Destroys this Canvas and all resources associated with it.
   * Do not use this Canvas after calling this function.
   */
  Canvas.prototype.destroy = function() {
    var tSurface = this.surface;

    this.records = null;
    this.matrix = null;

    if (tSurface !== null) {
      tSurface.destroy();
      this.surface = null;
    }
  };

}(this));
