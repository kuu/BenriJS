/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.geometry.Point = Point;

  /**
   * A class that holds an x and y position.
   * @class
   * @constructor
   * @param {number} pX X
   * @param {number} pY Y
   */
  function Point(pX, pY) {
    this.x = pX;
    this.y = pY;
  }

  /**
   * Transform this Point by the given matrix.
   * @param  {benri.geometry.Matrix2D} pMatrix The matrix to transform by.
   */
  Point.prototype.transform = function(pMatrix) {
    var tNewPoint = pMatrix.getPoint(this.x, this.y);
    this.x = tNewPoint.x;
    this.y = tNewPoint.y;

    return this;
  };

  /**
   * Get a clone of this Point.
   * @return {benri.geometry.Point} The clone.
   */
  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  };

  /**
   * Creates an array of Point objects
   * from the list of arguments.
   * The arguments must be in the format
   *   x0, y0, x1, y1, x2, y2, etc...
   * @return {Array.<benri.geometry.Point>}
   */
  Point.array = function() {
    var tArguments = arguments;
    var i, il = tArguments.length;
    var tCounter;
    var tArray = new Array(il / 2);

    for (i = 0, tCounter = 0; i < il; i += 2, tCounter++) {
      tArray[tCounter] = new Point(tArguments[i], tArguments[i + 1]);
    }

    return tArray;
  }

}(this));