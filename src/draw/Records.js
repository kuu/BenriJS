/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.draw.Records = Records;

  /**
   * A class that encapsulates draw command records and provides methods to access it.
   * @class
   * @constructor
   */
  function Records(pData) {

    /**
     * Draw commands
     * @type {Array}
     */
    this._data = pData;
  }

  /**
   * Filters record of specific type(s).
   * @param {string} pType Type name concerned.
   *  The string can contain multiple type names separated by space.
   * @param {function} pCallback Function to be invoked for each element of the type.
   *  The callback function is invoked with three arguments:
   *    pCallback(records[i], i, records)
   * @param {object} pContext An optional value on which pCallback is invoked.
   * @param {boolean} pReverse If true, iterates records in reverse order.
   */
  Records.prototype.filter = function(pType, pCallback, pContext, pReverse) {

    var tTypes = pType.split(' '),
        tRecords = this._data,
        tContext = pContext || this,
        tDoFilter = function (pRecord, pTypes, pIndex) {
            for (var i = 0, il = pTypes.length; i < il; i++)
              if (pRecord.type === pTypes[i])
                pCallback.call(tContext, pRecord, pIndex, tRecords);
          };

    if (pReverse) {
      for (var i = tRecords.length; i--;) {
        tDoFilter(tRecords[i], tTypes, i);
      }
    } else {
      for (var i = 0, il = tRecords.length; i < il; i++) {
        tDoFilter(tRecords[i], tTypes, i);
      }
    }
  };

  /**
   * Make a deep copy of this object.
   * @return {benri.draw.Records} Copied object.
   *    If the record's member has clone() method, it is called to create a copy.
   */
  Records.prototype.deepCopy = function() {

    var tRecords = this._data, tRecord, tProperty,
        tNewRecord, tNewRecords = [],
        tDoCopy = function (pObj) {
          if (typeof pObj !== 'object') {
            return pObj;
          }
          if (pObj.clone && typeof pObj.clone === 'function') {
            return pObj.clone();
          }
          var tNewObj = {};
          for (var k in pObj) {
            tNewObj[k] = tDoCopy(pObj[k]);
          }
          return tNewObj;
        };

    for (var i = 0, il = tRecords.length; i < il; i++) {
      tNewRecords.push(tDoCopy(tRecords[i]));
    }
    return new Records(tNewRecords);
  };

  /**
   * Concatenate records.
   * @param {benri.draw.Records} pRecord Records to be appended to this record.
   */
  Records.prototype.concat = function(pRecords) {
    var tSrc = pRecords._data,
        tDst = this._data;
    for (var i = 0, il = tSrc.length; i < il; i++) {
      tDst.push(tSrc[i]);
    }
  };

}(this));
