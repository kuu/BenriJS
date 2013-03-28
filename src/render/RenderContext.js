/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Matrix2D = benri.geometry.Matrix2D;
  var Color = benri.draw.Color;
  var Texture = benri.render.Texture;

  benri.render.RenderContext = RenderContext;

  var mTextureIdCounter = 0;

  /**
   * @class
   * @constructor
   * @param {number} pWidth The width in pixels of this context.
   * @param {number} pHeight The height in pixels of this context.
   */
  function RenderContext(pWidth, pHeight) {
    // Finalize the matrix.
    Matrix2D.initExtention(this);

    /**
     * The width in pixels.
     * @type {number}
     */
    this.width = pWidth;

    /**
     * The height in pixels.
     * @type {number}
     */
    this.height = pHeight;

    /**
     * The stack to hold state information.
     * @private
     * @type {Array}
     */
    this.stack = [];

    /**
     * An array of currently existing buffers.
     * @private
     * @type {Buffer}
     */
    this.buffers = [];

    /**
     * An array of currently existing buffers.
     * @type {Array.<Texture>}
     */
    this.textures = [];

    /**
     * The background colour of this context.
     * @type {benri.draw.Color}
     */
    this.backgroundColor = new Color(0, 0, 0, 0);

    /**
     * The ID of the currently active buffer.
     * @private
     * @type {Number}
     */
    this.activeBuffer = -1;

    this.setActiveBuffer(this.createBuffer(pWidth, pHeight));
  }

  // Add matrix modifying functions.
  Matrix2D.extend(RenderContext.prototype);

  /**
   * Saves the current state of the context.
   * Currently this only saves the matrix.
   */
  RenderContext.prototype.save = function() {
    this.stack.push({
      matrix: this.matrix.clone()
    });
  };

  /**
   * Restores a state previously saved.
   */
  RenderContext.prototype.restore = function() {
    var tState = this.stack.pop();
    this.matrix = tState.matrix;
  };

  /**
   * Creates a new Texture attached to this context.
   * Don't forget to call destroyTexture when finished with it.
   * @param  {object} pBitmap The bitmap to use for the Texture.
   * @param  {string="none"} pWrapS The wrap mode on the S axis.
   * @param  {string="none"} pWrapT The wrap mode on the T axis.
   * @return {benri.render.Texture} The newly created Texture.
   */
  RenderContext.prototype.createTexture = function(pBitmap, pWrapS, pWrapT) {
    var tTexture = new Texture(pBitmap, pWrapS, pWrapT);
    tTexture.id = ++mTextureIdCounter;
    this.textures.push(tTexture);
    return tTexture;
  };

  /**
   * Creates a new Texture with the given dimentions.
   * Use this when you want an empty Texture to render in to.
   * @param  {number} pWidth  The width
   * @param  {number} pHeight The height
   * @param  {string="none"} pWrapS  The wrap mode on the S axis.
   * @param  {string="none"} pWrapT  The wrap mode on the T axis.
   * @return {benri.render.Texture} The newly created Texture.
   */
  RenderContext.prototype.createEmptyTexture = function(pWidth, pHeight, pWrapS, pWrapT) {
    var tTexture = new Texture(null, pWrapS, pWrapT);
    tTexture.id = ++mTextureIdCounter;
    tTexture.width = pWidth;
    tTexture.height = pHeight;
    this.textures.push(tTexture);
    return tTexture;
  };

  /**
   * Syncs a Texture with this context. For example if the bitmap or wrap modes
   * were changed, they will not be reflected until this function is run.
   * @param  {benri.render.Texture} pTexture The Texture to sync.
   */
  RenderContext.prototype.updateTexture = function(pTexture) {

  };

  /**
   * Destroys the given Texture.
   * @param  {benri.render.texture} pTexture The texture to destroy.
   */
  RenderContext.prototype.destroyTexture = function(pTexture) {
    var tIndex = this.textures.indexOf(pTexture);
    if (tIndex !== -1) {
      this.textures.splice(tIndex, 1);
    }

    pTexture.bitmap = null;
    pTexture.id = -1;
  };

  /**
   * Renders a Texture to this context.
   * @param  {benri.render.Texture} pTexture The texture to render.
   * @param  {benri.geometry.Rect=} pSourceRect A rectangluar area of the Texture to render to the context.
   * @param  {benri.geometry.Rect=} pDestRect   A rectangular area on the context to render the Texture to.
   * @param  {benri.render.fragmentShaders.FragmentShader=} pShader The shader to use.
   */
  RenderContext.prototype.renderTexture = function(pTexture, pSourceRect, pDestRect, pShader) {

  };

  /**
   * Renders the current buffer to the given Texture.
   * @param  {benri.render.Texture} pTexture The Texture to render to.
   * @param  {benri.render.fragmentShaders.FragmentShader=} pShader The shader to use
   */
  RenderContext.prototype.renderToTexture = function(pTexture, pShader) {

  };

  /**
   * Clears this context with the background color.
   */
  RenderContext.prototype.clear = function() {

  };

  /**
   * Flush all pending operations.
   */
  RenderContext.prototype.flush = function() {

  };

  /**
   * Destroy this context.
   */
  RenderContext.prototype.destroy = function() {
    var i, il;
    var tBuffers;
    var tTextures;

    tBuffers = this.buffers.slice(0);
    tTextures = this.textures.slice(0);

    for (i = 0, il = tBuffers.length; i < il; i++) {
      this.destroyBuffer(i);
    }

    for (i = 0, il = tTextures.length; i < il; i++) {
      this.destroyTexture(tTextures[i]);
    }

    this.matrix = null;
    this.textures = null;
    this.buffers = null;
    this.stack = null;
    this.backgroundColor = null;
  };

  /**
   * Creates a new buffer to render in to.
   * @param  {number} pWidth  The width of the buffer.
   * @param  {number} pHeight The height of the buffer.
   * @return {number}         The ID of the new buffer.
   */
  RenderContext.prototype.createBuffer = function(pWidth, pHeight) {
    var tBuffers = this.buffers;

    for (var i = 0;; i++) {
      if (tBuffers[i] === void 0) {
        tBuffers[i] = new Buffer(i, pWidth, pHeight);
        return i;
      }
    }
  };

  /**
   * Destroys a previously created buffer.
   * If the currently active buffer is destroyed
   * the active buffer is set to the main buffer.
   * @param  {number} pId The ID of the buffer to destroy.
   */
  RenderContext.prototype.destroyBuffer = function(pId) {
    var tBuffer = this.buffers[pId];
    if (tBuffer !== void 0) {
      this.buffers[pId] = void 0;
      if (pId === this.activeBuffer) {
        this.setActiveBuffer(0);
      }
    }
  };

  /**
   * Renders the given buffer in to the current buffer.
   * @param  {number} pId     The ID of the buffer to render.
   * @param  {benri.render.fragmentShaders.FragmentShader=} pShader The shader to use.
   */
  RenderContext.prototype.renderBuffer = function(pId, pShader) {

  };

  /**
   * Sets the currently active buffer for all render operations
   * to operate on.
   * @param {number} pId The ID of the buffer.
   */
  RenderContext.prototype.setActiveBuffer = function(pId) {
    var tBuffer = this.buffers[pId];
    if (tBuffer !== void 0) {
      this.activeBuffer = pId;
    }
  };

  /**
   * @constuctor
   * @private
   * @param {number} pId     The ID of this buffer.
   * @param {number} pWidth  The width of this buffer.
   * @param {number} pHeight The height of this buffer.
   */
  function Buffer(pId, pWidth, pHeight) {
    this.id = pId;
    this.width = pWidth;
    this.height = pHeight;
    this.data = null;
  }

}(this));