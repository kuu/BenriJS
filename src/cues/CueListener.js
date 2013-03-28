/**
 * @license
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.cues = {
    CueListener: CueListener
  };

  /**
   * A class for doing event handling.
   * @constructor
   */
  function CueListener() {
    this._cues = {};
  }

  /**
   * Register an event handler for the given event name.
   * @param  {string} pName     The name of the event.
   * @param  {function} pListener The callback handler.
   */
  CueListener.prototype.on = function(pName, pListener) {
    var tCues = this._cues;

    if (!pListener) {
      return;
    }

    if (!(pName in tCues)) {
      tCues[pName] = [pListener];
      return;
    }

    tCues[pName].push(pListener);
  };

  /**
   * Unregister an event handler for the given event name.
   * @param  {string} pName     The name of the event.
   * @param  {function} pListener A previously registered callback handler.
   */
  CueListener.prototype.ignore = function(pName, pListener) {
    var tCues = this._cues;

    if (!pListener) {
      return;
    }

    if (!(pName in tCues)) {
      return;
    }

    var tListeners = tCues[pName];
    var tIndex = tListeners.indexOf(pListener);

    if (tIndex !== -1) {
      tListeners.splice(tIndex, 1);
    }
  };

  /**
   * Cue this object the event.
   * Execute all handlers registered previously via on.
   * @param  {string} pName The name of the event.
   * @param  {object} pData Data to send with the event.
   */
  CueListener.prototype.cue = function(pName, pData) {
    var tCues = this._cues;
    var tListeners;
    var i, il;
    var tPackage = {
      data: pData,
      name: pName,
      target: this
    };

    if (!(pName in tCues)) {
      return;
    }

    tListeners = tCues[pName].slice(0);

    for (i = 0, il = tListeners.length; i < il; i++) {
      tListeners[i].call(this, tPackage);
    }
  };

  /**
   * Used to initialize an object to support cues.
   * @param  {object} pObject The object to initialize.
   */
  CueListener.init = function(pObject) {
    pObject._cues = {};
  };

  /**
   * Extends the given object to support cues.
   * @param  {object} pObject The object to extend.
   */
  CueListener.extend = function(pObject) {
    pObject.on = CueListener.prototype.on;
    pObject.ignore = CueListener.prototype.ignore;
    pObject.cue = CueListener.prototype.cue;
  };

  /**
   * A class that stores past cues.
   * When using on() with this class, if the given
   * event name has already had a cue fired,
   * the handler will be executed right away with
   * the old data.
   * @class
   * @extends {benri.cues.CueListener}
   */
  var PersistentCueListener = (function(pSuper) {
    function PersistentCueListener() {
      pSuper.call(this);

      /**
       * A persistent store of previously sent cues.
       * @type {object}
       */
      this._cueResults = {};
    }

    PersistentCueListener.prototype = Object.create(pSuper.prototype);
    PersistentCueListener.prototype.constructor = PersistentCueListener;

    /**
     * @inheritDoc
     */
    PersistentCueListener.prototype.on = function(pName, pListener) {
      pSuper.prototype.on.call(this, pName, pListener);

      var tCueResults = this._cueResults;
      if (pName in tCueResults) {
        pListener.call(this, {
          name: pName,
          data: tCueResults[pName],
          target: this
        });
      }
    };

    /**
     * @inheritDoc
     */
    PersistentCueListener.prototype.ignore = function(pName, pListener) {
      pSuper.prototype.ignore.call(this, pName, pListener);
    };

    /**
     * @inheritDoc
     */
    PersistentCueListener.prototype.cue = function(pName, pData) {
      pSuper.prototype.cue.call(this, pName, pData);

      this._cueResults[pName] = pData;
    };

    /**
     * Resets the persistent store on the given name.
     * @param  {string} pName The event name to reset.
     */
    PersistentCueListener.prototype.resetCue = function(pName) {
      if (!pName) {
        this._cueResults = {};
      } else {
        delete this._cueResults[pName];
      }
    }

    return PersistentCueListener;
  })(CueListener);

  benri.cues.PersistentCueListener = PersistentCueListener;

  /**
   * Used to initialize an object to support cues.
   * @param  {object} pObject The object to initialize.
   */
  PersistentCueListener.init = function(pObject) {
    pObject._cues = {};
    pObject._cueResults = {};
  };

  /**
   * Extends the given object to support cues.
   * @param  {object} pObject The object to extend.
   */
  PersistentCueListener.extend = function(pObject) {
    pObject.on = PersistentCueListener.prototype.on;
    pObject.ignore = PersistentCueListener.prototype.ignore;
    pObject.cue = PersistentCueListener.prototype.cue;
  };

}(this));
