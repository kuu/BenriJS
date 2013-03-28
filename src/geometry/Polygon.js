/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var geometry = global.benri.geometry;
  var Path = geometry.Path;

  /**
   * A closed shape made up of multiple verticies.
   * @param {Array.<benri.geometry.Point>} pVerticies The list of verticices that make up this Polygon.
   */
  function Polygon(pVerticies) {
    this.verticies = pVerticies.slice(0);
  }

  /**
   * Get a clone of this Polygon.
   * @return {benri.geometry.Polygon} The clone.
   */
  Polygon.prototype.clone = function() {
    var tVerticies = this.verticies;
    var i, il = tVerticies.length;
    var tPoints = new Array(il);

    for (i = 0; i < il; i++) {
      tPoints[i] = tVerticies[i].clone();
    }

    return new Polygon(tPoints);
  };

  /**
   * Get a representation of this Polygon as a Path.
   * @return {benri.geometry.Path} The path.
   */
  Polygon.prototype.getPath = function() {
    var tVerticies = this.verticies;
    var tVertex = tVerticies[0];
    var tPath = new Path(tVertex.x, tVertex.y);

    for (var i = 0, il = tVerticies.length; i < il; i++) {
      tVertex = tVerticies[i];
      tPath.l(tVertex.x, tVertex.y);
    }

    tVertex = tVerticies[0];
    tPath.l(tVertex.x, tVertex.y);

    return tPath;
  };

  /**
   * Transforms this Polygon via the given Matrix
   * @param  {benri.geometry.Matrix2D} pMatrix The Matrix to transform with
   * @return {benri.geometry.Polygon} This Polygon.
   */
  Polygon.prototype.transform = function(pMatrix) {
    var tVerticies = this.verticies;

    for (var i = 0, il = tVerticies.length; i < il; i++) {
      tVerticies[i].transform(pMatrix);
    }

    return this;
  };

  Polygon.prototype.getBoundingRect = function() {
    var tMinX = Infinity;
    var tMinY = Infinity;
    var tMaxX = -Infinity;
    var tMaxY = -Infinity;
    var tVerticies = this.verticies;
    var tX, tY;
    var tPoint;

    for (var i = 0, il = tVerticies.length; i < il; i++) {
      tPoint = tVerticies[i];
      tX = tPoint.x;
      tY = tPoint.y;

      if (tX < tMinX) {
        tMinX = tX;
      }

      if (tX > tMaxX) {
        tMaxX = tX;
      }

      if (tY < tMinY) {
        tMinY = tY;
      }

      if (tY > tMaxY) {
        tMaxY = tY;
      }
    }

    return new geometry.Rect(tMinX, tMinY, tMaxX - tMinX, tMaxY - tMinY);
  };

  /**
   * Check whether this Polygon has the same verticies as the given Polygon.
   * @param {benri.geometry.Polygon} pPolygon
   * @return {boolean} True if the Polygons have the same verticies.
   */
  Polygon.prototype.equals = function(pPolygon) {
    var tVerticies = this.verticies;
    var tThatVerticies = pPolygon.verticies;
    var i, il = tVerticies.length;

    if (il !== tThatVerticies.length) {
      return false;
    }

    for (i = 0; i < il; i++) {
      if (!tVerticies[i].equals(tThatVerticies[i])) {
        return false;
      }
    }

    return true;
  };

  /**
   * Checks to see if the give point lays inside of this Polygon.
   * @param  {benri.geometry.Point}  pPoint The Point to check
   * @return {boolean} True if the point is inside, false otherwise
   */
  Polygon.prototype.isPointInside = function(pX, pY) {
    // http://www.ecse.rpi.edu/~wrf/Research/Short_Notes/pnpoly.html
    // Copyright (c) 1970-2003, Wm. Randolph Franklin
    // This algorithm is an adoption of the C function on
    // the website listed above. For full license notes
    // please see the LICENSE file included with this source code.

    var tVerticies = this.verticies;
    var tNumOfVerticies = tVerticies.length;

    var i, j, tResult = false;

    for (i = 0, j = tNumOfVerticies - 1; i < tNumOfVerticies; j = i++) {
      if (
        ((tVerticies[i].y > pY) !== (tVerticies[j].y > pY)) &&
        (pX < (tVerticies[j].x - tVerticies[i].x) * (pY - tVerticies[i].y) / (tVerticies[j].y - tVerticies[i].y) + tVerticies[i].x)
        ) {
        tResult = !tResult;
      }
    }

    return tResult;
  };


  geometry.Polygon = Polygon;

}(this));