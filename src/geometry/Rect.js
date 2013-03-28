/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var geometry = global.benri.geometry;
  var Path = geometry.Path;
  var Point = geometry.Point;
  var Polygon = geometry.Polygon;

  /**
   * A class that holds information about a rectangle
   * @class
   * @extends {benri.geometry.Polygon}
   */
  var Rect = geometry.Rect = (function(pSuper) {
    /**
     * @constructor
     * @class
     * @param {number} pX The X position for the origin.
     * @param {number} pY The Y position for the origin.
     * @param {number} pWidth The width of the Rect.
     * @param {number} pHeight The height of the Rect.
     */
    function Rect(pX, pY, pWidth, pHeight) {
      pSuper.call(this, Point.array(
        pX, pY,
        pX + pWidth, pY,
        pX + pWidth, pY + pHeight,
        pX, pY + pHeight
      ));

      /**
       * The origin (top left) of this Rect.
       * @type {benri.geometry.Point}
       */
      this.origin = this.verticies[0];
    }

    Rect.prototype = Object.create(pSuper.prototype);
    Rect.prototype.constructor = Rect;

    Rect.prototype.setWidth = function(pValue) {
      var tVerticies = this.verticies;
      return tVerticies[1].x = tVerticies[2].x = tVerticies[0].x + pValue;
    };

    Rect.prototype.setHeight = function(pValue) {
      var tVerticies = this.verticies;
      return tVerticies[2].y = tVerticies[3].y = tVerticies[0].y + pValue;
    };

    Rect.prototype.getWidth = function() {
      var tVerticies = this.verticies;
      return tVerticies[1].x - tVerticies[0].x;
    };

    Rect.prototype.getHeight = function() {
      var tVerticies = this.verticies;
      return tVerticies[3].y - tVerticies[0].y;
    };

    /**
     * Gets a normal Polygon that has the same verticies
     * as this Rect.
     * @return {benri.geometry.Polygon}
     */
    Rect.prototype.getPolygon = function() {
      return pSuper.prototype.clone.call(this);
    };

    /**
     * Get a clone of this Rect.
     * @return {benri.geometry.Rect} The clone.
     */
    Rect.prototype.clone = function() {
      return new Rect(this.origin.x, this.origin.y, this.getWidth(), this.getHeight());
    };

    /**
     * Transforms this Rect via the given Matrix.
     * Note that this will not allow you to
     * warp this Rect to something that is not a Rect
     * anymore. It will also not allow you to rotate
     * the points in this Rect.
     * Instead, it will calculate the bounding Rect for
     * the transformed Rect and set that bounding Rect's
     * verticies as the verticies for this Rect.
     * @return {benri.geometry.Rect} This Rect.
     */
    Rect.prototype.transform = function(pMatrix) {
      pSuper.prototype.transform.call(this, pMatrix);

      var tBoundingVerticies = this.getBoundingRect().verticies;
      var tVerticies = this.verticies;

      tVerticies[0].x = tBoundingVerticies[0].x;
      tVerticies[0].y = tBoundingVerticies[0].y;
      tVerticies[1].x = tBoundingVerticies[1].x;
      tVerticies[1].y = tBoundingVerticies[1].y;
      tVerticies[2].x = tBoundingVerticies[2].x;
      tVerticies[2].y = tBoundingVerticies[2].y;
      tVerticies[3].x = tBoundingVerticies[3].x;
      tVerticies[3].y = tBoundingVerticies[3].y;

      return this;
    };

    return Rect;
  })(benri.geometry.Polygon);


  /**
   * Merge this rect with the given rect and return the new rect.
   * @param {benri.geometry.Rect} pRect
   * @return {benri.geometry.Rect} The merged rect.
   */
  Rect.prototype.merge = function(pRect) {
    var tPointA, tPointB,
        tMinX, tMinY, tMaxX, tMaxY;

    tPointA = this.origin;
    tPointB = pRect.origin;
    tMinX = tPointA.x < tPointB.x ? tPointA.x : tPointB.x;
    tMinY = tPointA.y < tPointB.y ? tPointA.y : tPointB.y;

    tPointA = this.verticies[2];
    tPointB = pRect.verticies[2];
    tMaxX = tPointA.x > tPointB.x ? tPointA.x : tPointB.x;
    tMaxY = tPointA.y > tPointB.y ? tPointA.y : tPointB.y;

    this.origin.x = tMinX;
    this.origin.y = tMinY;
    this.setWidth(tMaxX - tMinX);
    this.setHeight(tMaxY - tMinY);

    return this;
  };

}(this));
