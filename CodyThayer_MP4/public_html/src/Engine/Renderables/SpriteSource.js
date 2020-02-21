/* File: SpriteSource.js
 * 
 * SpriteSource encapsulates all of the functionality for a SpriteSource object
 * as defined in the MP4 spec documents.
 */

function SpriteSource(texture, width, centerX, centerY) {
    TextureRenderable.call(this, texture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());
    this.mTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
    this.mTexRight = 1.0;  // 
    this.mTexTop = 1.0;    //   1 is top and 0 is bottom of image
    this.mTexBottom = 0.0; // 
    //this.mSpriteSource = null;
    
    this.mWidth = null;
    this.mHeight = null;
    this.pixelWidth = null;
    this.pixelHeight = null;
    
    this.mTopLeftObj = null;
    this.mTopRightObj = null;
    this.mBottomLeftObj = null;
    this.mBottomRightObj = null;
    
    this.initialize(texture, width, centerX, centerY);
}
gEngine.Core.inheritPrototype(SpriteSource, TextureRenderable);

SpriteSource.prototype.initialize = function(t, w, x, y) {
    
    var spriteInfo = gEngine.Textures.getTextureInfo(t);
    this.pixelWidth = spriteInfo.mWidth;
    this.pixelHeight = spriteInfo.mHeight;
    
    var imageRatio = spriteInfo.mHeight / spriteInfo.mWidth;
    this.mWidth = w;
    this.mHeight = w * imageRatio;
    
//    this.mSpriteSource = new SpriteRenderable(t);
//    this.mSpriteSource.getXform().setPosition(x, y);
//    this.mSpriteSource.getXform().setSize(this.mWidth, this.mHeight);

    this.getXform().setPosition(x, y);
    this.getXform().setSize(this.mWidth, this.mHeight);
    
    var halfW = this.mWidth / 2;
    var halfH = this.mHeight / 2;
    
    this.mTopLeftObj = new Renderable();
    this.mTopLeftObj.setColor(0.2, 0.2, 0.8, 1.0);
    this.mTopLeftObj.getXform().setSize(1, 1);
    this.mTopLeftObj.getXform().setPosition(x - halfW, y + halfH);
    
    this.mTopRightObj = new Renderable();
    this.mTopRightObj.setColor(0.8, 0.2, 0.2, 1.0);
    this.mTopRightObj.getXform().setSize(1, 1);
    this.mTopRightObj.getXform().setPosition(x + halfW, y + halfH);
    
    this.mBottomLeftObj = new Renderable();
    this.mBottomLeftObj.setColor(0.2, 0.8, 0.2, 1.0);
    this.mBottomLeftObj.getXform().setSize(1, 1);
    this.mBottomLeftObj.getXform().setPosition(x - halfW, y - halfH);
    
    this.mBottomRightObj = new Renderable();
    this.mBottomRightObj.setColor(0.8, 0.8, 0.2, 1.0);
    this.mBottomRightObj.getXform().setSize(1, 1);
    this.mBottomRightObj.getXform().setPosition(x + halfW, y - halfH);
};

SpriteSource.prototype.getElementUVCoordinateArray = function () {
    return [
        this.mTexRight,  this.mTexTop,          // x,y of top-right
        this.mTexLeft,   this.mTexTop,
        this.mTexRight,  this.mTexBottom,
        this.mTexLeft,   this.mTexBottom
    ];
};

SpriteSource.prototype.draw = function(vpMatrix) {
    this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
    TextureRenderable.prototype.draw.call(this, vpMatrix);
};

SpriteSource.prototype.getUVFromWC = function(x, y) {
    var tl = this.mTopLeftObj.getXform().getPosition();
    var br = this.mBottomRightObj.getXform().getPosition();
    
    //Debug
//    console.log("Input X:        " + x);
//    console.log("Input Y:        " + y);
//    console.log("Top Left X:     " + tl[0]);
//    console.log("Bottom Right X: " + br[0]);
//    console.log("Top Left Y:     " + tl[1]);
//    console.log("Bottom Right Y: " + br[1]);
    
    if (x >= tl[0] && x <= br[0] && y >= br[1] && y <= tl[1]) {
        var u = x / this.mWidth;
        var v = y / this.mHeight;
        var UV = [u, v];
        return UV;
    } else {
        console.log("Supplied world coordinates are outside of SpriteSource bounds!");
        return [-1, -1];
    }
};

SpriteSource.prototype.getPixelFromUV = function(u, v) {
    var pX = u * this.pixelWidth;
    var pY = v * this.pixelHeight;
    var pCoordinates = [pX, pY];
    return pCoordinates;
};

SpriteSource.prototype.getUVBoundsFromWC = function(center, bW, bH) {
    
    // Convert interactive bound center to UV coordinates (on sprite sheet)
    var CenterU = center[0] / this.mWidth;
    var CenterV = center[1] / this.mHeight;
    
    // Convert interactive bound width and height to UV coordinates
    var WidthU = bW / this.mWidth;
    var HeightV = bH / this.mHeight;
    
    // Calculate left, right, bottom, and top
    var Left = CenterU - WidthU / 2;
    var Right = CenterU + WidthU / 2;
    var Bottom = CenterV - HeightV / 2;
    var Top = CenterV + HeightV / 2;
    
    var UVBounds = [Left, Right, Bottom, Top];
    return UVBounds;
};


SpriteSource.prototype.getPixelDimensions = function () {
    var dims = [this.pixelWidth, this.pixelHeight];
    return dims;
};

