/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.draw.Shader = Shader;

  /**
   * Base class for all Shaders.
   * @class
   */
  function Shader() {
    /**
     * The tiling mode of this shader.
     * In other words, what to do when you attempt to
     * shade outside the limits this shader defines.
     * @type {string=none}
     */
    this.tileMode = 'none';
  }

}(this));