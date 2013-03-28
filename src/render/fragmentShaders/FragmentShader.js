/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var mShaderImplementations = [];

  var benri = global.benri;

  var mShaders = benri.render.fragmentShaders = benri.render.fragmentShaders || {};

  /**
   * A base class for fragment (pixel) shaders.
   * Each FragementShader itself is very simple and usually only
   * holds data about the shader itself.
   *
   * When creating a new FragmentShader an implementation for that shader
   * needs to be created and registered via addImplementation.
   * @constructor
   * @param {benri.render.RenderContext} pRenderContext The RenderContext to use this shader in.
   */
  mShaders.FragmentShader = function(pRenderContext) {
    var i, il, j, jl;
    var tImplementations;
    var tImpl = null;

    // This searches for the correct implementation to use for
    // this shader using the RenderContext's constructor and this
    // shaders constructor as the keys to do the lookup.
    main: for (i = 0, il = mShaderImplementations.length; i < il; i++) {
      tImplementations = mShaderImplementations[i];
      if (tImplementations.shaderClass === this.constructor) {
        tImplementations = tImplementations.impls;
        for (j = 0, jl = tImplementations.length; j < jl; j++) {
          if (tImplementations[j].context === pRenderContext.constructor) {
            tImpl = tImplementations[j].impl;
            break main;
          }
        }

        break;
      }
    }

    if (tImpl === null) {
      throw new Error('No implementations for FragmentShader of given RenderContext.');
    }

    this.context = pRenderContext;
    // Create the implementation.
    this.impl = new tImpl(this);
  };

  /**
   * Adds a new implementation for a FragmentShader.
   * @param {function(new:benri.render.fragmentShaders.FragmentShader)} pShaderClass The shader's constructor.
   * @param {function(new:benri.render.RenderContext)} pRenderContextClass The RenderContext's constructor.
   * @param {function(benri.render.fragmentShader.FragmentShader)} pImplementation The implementation for the shader.
   */
  mShaders.FragmentShader.addImplementation = function(pShaderClass, pRenderContextClass, pImplementation) {
    var tImplementations;
    var i, il;
    var tIndex = mShaderImplementations.indexOf(pShaderClass);

    for (i = 0, il = mShaderImplementations.length; i < il; i++) {
      tImplementations = mShaderImplementations[i];
      if (tImplementations.shaderClass === pShaderClass) {
        tImplementations.impls.push({
          context: pRenderContextClass,
          impl: pImplementation
        });
        return;
      }
    }

    mShaderImplementations.push(
      {
        shaderClass: pShaderClass,
        impls: [
          {
            context: pRenderContextClass,
            impl: pImplementation
          }
        ]
      }
    );
  };

}(this));