/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Math = global.Math;
  var Point = benri.geometry.Point;

  benri.geometry.Matrix2D = Matrix2D;

  /**
   * @constructor
   * @class
   * @param {Array.<number>=} pMatrixArray An array of numbers to fill this matrix with.
   */
  function Matrix2D(pMatrixArray) {
    if (pMatrixArray) {
      this.fill(pMatrixArray);
    } else {
      this.identity();
    }
  }

  /**
   * Checks to see if this matrix is the same as another
   * @param  {benri.geometry.Matrix2D} pMatrix The matrix to check against.
   * @return {boolean} True of the are the same, false otherwise.
   */
  Matrix2D.prototype.equals = function(pMatrix) {
    if (this.a !== pMatrix.a) return false;
    if (this.b !== pMatrix.b) return false;
    if (this.c !== pMatrix.c) return false;
    if (this.d !== pMatrix.d) return false;
    if (this.e !== pMatrix.e) return false;
    if (this.f !== pMatrix.f) return false;

    return true;
  };

  /**
   * Populates this matrix with data.
   * @param  {Array.<number>} pMatrixArray The data.
   */
  Matrix2D.prototype.fill = function(pMatrixArray) {
    this.a = pMatrixArray[0];
    this.b = pMatrixArray[1];
    this.c = pMatrixArray[2];
    this.d = pMatrixArray[3];
    this.e = pMatrixArray[4];
    this.f = pMatrixArray[5];
  };

  /**
   * Converts this matrix to an array.
   * @return {Array.<number>} The data.
   */
  Matrix2D.prototype.getArray = function() {
    return [
        this.a,
        this.b,
        this.c,
        this.d,
        this.e,
        this.f
      ];
  };

  /**
   * Sets this matrix to the identity matrix.
   */
  Matrix2D.prototype.identity = function() {
    /**
     * Scale X
     * @type {number}
     */
    this.a = 1;

    /**
     * Skew Y
     * @type {number}
     */
    this.b = 0;

    /**
     * Skew X
     * @type {number}
     */
    this.c = 0;

    /**
     * Scale Y
     * @type {number}
     */
    this.d = 1;

    /**
     * Translate X
     * @type {number}
     */
    this.e = 0;

    /**
     * Translate Y
     * @type {number}
     */
    this.f = 0;
  }

  /**
   * Tests if this is the identity matrix.
   */
  Matrix2D.prototype.isIdentity = function() {
    return (this.a === 1
        && this.b === 0
        && this.c === 0
        && this.d === 1
        && this.e === 0
        && this.f === 0);
  };

  /**
   * Multiply this matrix by another
   * @param  {benri.geometry.Matrix2D} pThat The matrix to multiply by.
   */
  Matrix2D.prototype.multiply = function(pThat) {
    var tMatrix = new Matrix2D();

    var tThisA = this.a;
    var tThisB = this.b;
    var tThisC = this.c;
    var tThisD = this.d;
    var tThisE = this.e;
    var tThisF = this.f;

    var tThatA = pThat.a;
    var tThatB = pThat.b;
    var tThatC = pThat.c;
    var tThatD = pThat.d;
    var tThatE = pThat.e;
    var tThatF = pThat.f;

    this.a = tThisA * tThatA + tThisC * tThatB;
    this.b = tThisB * tThatA + tThisD * tThatB;
    this.c = tThisA * tThatC + tThisC * tThatD;
    this.d = tThisB * tThatC + tThisD * tThatD;
    this.e = tThisA * tThatE + tThisC * tThatF + tThisE;
    this.f = tThisB * tThatE + tThisD * tThatF + tThisF;
  };

  /**
   * Gets the rotation of this matrix in degrees if possible.
   * @return {number} The rotation in degrees.
   */
  Matrix2D.prototype.getRotationInDegrees = function() {
    // 180 / Math.PI
    return this.getRotation() * 57.29577951308232;
  };

  Matrix2D.prototype.getRotation = function() {
    var tCos, tTan;
    if (this.d !== 0) {
      tCos = this.d;
      tTan = this.b / tCos;
    } else if (this.a !== 0) {
      tCos = this.a;
      tTan = -this.c / tCos;
    } else {
      return 0;
    }

    if (tCos < 0) {
        return Math.PI - Math.atan(tTan); // Math.PI
    } else if (this.c < 0) {
        return Math.PI*2 - Math.atan(tTan); // Math.PI*2
    } else {
        return -Math.atan(tTan);
    }
  };

  /**
   * Gets the X scale of this matrix.
   * @return {number} The X scale.
   */
  Matrix2D.prototype.getScaleX = function() {
    return Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.c, 2));
  };

  /**
   * Gets the Y scale of this matrix.
   * @return {number} The Y scale.
   */
  Matrix2D.prototype.getScaleY = function() {
    return Math.sqrt(Math.pow(this.b, 2) + Math.pow(this.d, 2));
  };

  /**
   * Determinant of this matrix
   */
  Matrix2D.prototype.determinant = function () {
    return this.a * this.d + this.b * this.c;
  };

  /**
   * Invert this matrix
   */
  Matrix2D.prototype.invert = function() {
    var tThisA = this.a;
    var tThisB = this.b;
    var tThisC = this.c;
    var tThisD = this.d;
    var tThisE = this.e;
    var tThisF = this.f;
    var oneOverDet = 1.0 / this.determinant();

    this.a = tThisD * oneOverDet;
    this.b = tThisB * oneOverDet;
    this.c = tThisC * oneOverDet;
    this.d = tThisA * oneOverDet;
    this.e = -(tThisE * this.a + tThisF * this.c);
    this.f = -(tThisE * this.b + tThisF * this.d);
  };

  /**
   * Translate this matrix.
   * @param  {number} pX The X amount to translate
   * @param  {number} pY The Y amount to translate
   */
  Matrix2D.prototype.translate = function(pX, pY) {
    this.multiply({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: pX,
      f: pY
    });
  };

  /**
   * Rotates this matrix by the given angle in degrees.
   * @param  {number} pDegrees The angle in degrees.
   */
  Matrix2D.prototype.rotateInDegrees = function(pDegrees) {
    // Math.PI / 180;
    this.rotate(pDegrees * 0.017453292519943295);
  };

  /**
   * Rotates this matrix by the given angle in radians.
   * @param  {number} pAngle The angle in radians.
   */
  Matrix2D.prototype.rotate = function(pAngle) {
    this.multiply({
      a: Math.cos(pAngle),
      b: -Math.sin(pAngle),
      c: Math.sin(pAngle),
      d: Math.cos(pAngle),
      e: 0,
      f: 0
    });
  };

  /**
   * Scales this matrix
   * @param  {number} pX The X factor
   * @param  {number} pY The Y factor
   */
  Matrix2D.prototype.scale = function(pX, pY) {
    this.multiply({
      a: pX,
      b: 0,
      c: 0,
      d: pY,
      e: 0,
      f: 0
    });
  };

  /**
   * Skews this matrix
   * @param  {number} pX The X factor
   * @param  {number} pY The Y factor
   */
  Matrix2D.prototype.skew = function(pX, pY) {
    this.multiply({
      a: 1,
      b: pY,
      c: pX,
      d: 1,
      e: 0,
      f: 0
    });
  };

  /**
   * Given X and Y values, return a Point that
   * is transformed according to this matrix.
   * @param  {number} pX The X value
   * @param  {number} pY The Y value
   * @return {benri.geometry.Point} The resulting Point.
   */
  Matrix2D.prototype.getPoint = function(pX, pY) {
    return new Point(
      pX * this.a + pY * this.c + this.e,
      pY * this.d + pX * this.b + this.f
    );
  };

  /**
   * Get a clone of this matrix.
   * @return {benri.geometry.Matrix2D} The clone.
   */
  Matrix2D.prototype.clone = function() {
    var tMatrix = new Matrix2D();
    tMatrix.a = this.a;
    tMatrix.b = this.b;
    tMatrix.c = this.c;
    tMatrix.d = this.d;
    tMatrix.e = this.e;
    tMatrix.f = this.f;
    return tMatrix;
  };

  /**
   * Get a CSS String representation of this matrix.
   * @return {string} The string.
   */
  Matrix2D.prototype.toCSSString = function() {
    return 'matrix3d(' + this.a + ',' + this.b + ',0,0,' + this.c + ',' + this.d + ',0,0,0,0,1,0,' + this.e + ',' + this.f + ',0,1)';
  };

  function setTransform(pArray) {
    this.matrix.fill(pArray);
    this.onMatrixChange();
  }

  function resetTransform() {
    this.matrix.identity();
    this.onMatrixChange();
  }

  function transform(pMatrix) {
    this.matrix.multiply(pMatrix);
    this.onMatrixChange();
  }

  function translate(pX, pY) {
    this.matrix.translate(pX, pY);
    this.onMatrixChange();
  }

  function rotate(pRadians) {
    this.matrix.rotate(pRadians);
    this.onMatrixChange();
  }

  function rotateInDegrees(pDegrees) {
    this.matrix.rotateInDegrees(pDegrees);
    this.onMatrixChange();
  }

  function scale(pX, pY) {
    this.matrix.scale(pX, pY);
    this.onMatrixChange();
  }

  function skew(pX, pY) {
    this.matrix.skew(pX, pY);
    this.onMatrixChange();
  }

  function setX(pX) {
    this.matrix.e = pX;
    this.onMatrixChange();
  }

  function setY(pY) {
    this.matrix.f = pY;
    this.onMatrixChange();
  }

  function getX() {
    return this.matrix.e;
  }

  function getY() {
    return this.matrix.f;
  }

  function getRotation() {
    return this.matrix.getRotation();
  }

  function getRotationInDegrees() {
    return this.matrix.getRotationInDegrees();
  }

  function getScaleX() {
    return this.matrix.getScaleX();
  }

  function getScaleY() {
    return this.matrix.getScaleY();
  }


  function dummyMatrixChange() {}

  /**
   * Extends the given object to include
   * functions that allow you to modify
   * a matrix local to the object.
   * Note that you must call Matrix2D.initExtention as well
   * to finish the extention.
   * You can listen to changes to the matrix
   * by overriding the given objects onMatrixChange
   * function. That function takes no parameters
   * however the matrix property of the object
   * will be the updated matrix.
   * @param  {Object} pObject The object to extend.
   */
  Matrix2D.extend = function(pObject) {
    pObject.setTransform = setTransform;
    pObject.resetTransform = resetTransform;
    pObject.transform = transform;
    pObject.translate = translate;
    pObject.rotate = rotate;
    pObject.rotateInDegrees = rotateInDegrees;
    pObject.scale = scale;
    pObject.skew = skew;
    pObject.getX = getX;
    pObject.getY = getY;
    pObject.setX = setX;
    pObject.setY = setY;
    pObject.getRotation = getRotation;
    pObject.getRotationInDegrees = getRotationInDegrees;
    pObject.getScaleX = getScaleX;
    pObject.getScaleY = getScaleY;

    pObject.onMatrixChange = dummyMatrixChange;
  };

  /**
   * Initialize an object to modifying a matrix
   * that was extended by Matrix2D.extend.
   * Adds the matrix property to the object.
   * @param  {Object} pObject The object to initialize.
   */
  Matrix2D.initExtention = function(pObject) {
    pObject.matrix = new Matrix2D();
  };

}(this));
