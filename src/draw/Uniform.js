/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * A simple class to represent a uniform
 * to use while drawing with Canvas.
 * Set the value and flush the Canvas to redraw
 * with the new values.
 * @param {*=0} pDefaultValue The default value of this Uniform. Defaults to 0.
 */
benri.draw.Uniform = function Uniform(pDefaultValue) {
  this.value = pDefaultValue || 0;
};

