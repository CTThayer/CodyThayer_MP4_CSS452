/*
 * File: TestScene.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, SpriteRenderable: false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false, SpriteAnimateRenderable: false, GameOver: false,
  FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TestScene() {
    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBoundImage = "assets/Bound.png";

    // The camera displaying the sprite sources and interactive bound
    this.spriteSourceCamera = null;
    
    // The camera displaying the animation view
    this.animationViewCamera = null;

    // the hero and the support objects
    this.interactiveBoundObj = null;
    this.spriteSource = null;
    this.animObj = null;
    
    this.cSpaceOriginX = 640;
    this.cSpaceOriginY = 0;
    this.cSpaceWidth = 480;
    this.cSpaceHeight = 480;
    this.initAnimObjWidth = 100;
}
gEngine.Core.inheritPrototype(TestScene, Scene);

TestScene.prototype.loadScene = function () {
    // Load the textures    
    gEngine.Textures.loadTexture(this.kFontImage);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBoundImage);
};

TestScene.prototype.unloadScene = function () {
    // Unload the textures 
    gEngine.Textures.unloadTexture(this.kFontImage);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBoundImage);

    // Starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

TestScene.prototype.initialize = function () {
    // Set up the spriteSourceCamera object
    this.spriteSourceCamera = new Camera(
        vec2.fromValues(50, 37.5),  // position of the camera
        100,                        // width of camera
        [0, 0, 640, 480]            // viewport (orgX, orgY, width, height)
    );
    this.spriteSourceCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
            
    // Set up the animationViewCamera object
    this.animationViewCamera = new Camera(
        vec2.fromValues(-100, -100),    // position of the camera
        100,                            // width of camera
        [640, 0, 480, 480]              // viewport (orgX, orgY, width, height)
    );
    this.animationViewCamera.setBackgroundColor([0.0, 0.2, 0.5, 1]);
            // sets the background to blue (for test purposes)

    // Gets image width and height
    var spriteInfo = gEngine.Textures.getTextureInfo(this.kMinionSprite);
    console.log(spriteInfo.mWidth);
    console.log(spriteInfo.mHeight);

    // Create the spriteSource renderable and assign the first sprite sheet image
    this.spriteSource = new SpriteSource(this.kMinionSprite, 100, 50, 25);

    // Create the interactiveBound renderable that indicates the user controlled
    // interactive bound in the spriteSource view
    var params = [50, 25, 10, 10, 0, 0, 100, 50];
    this.interactiveBoundObj = new InteractiveBound(this.kBoundImage);
    this.interactiveBoundObj.initialize(params);
    
    this.animObj = new SpriteAnimateRenderable(this.kMinionSprite);
    this.animObj.setColor([1, 1, 1, 0]);
    this.animObj.getXform().setPosition(-100, -100);
    this.animObj.getXform().setSize(100, 100);
    this.animObj.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.animObj.setAnimationSpeed(50);
    
    this.testRenderable = new Renderable();
    this.testRenderable.setColor(1, 0, 0, 1);
    this.testRenderable.getXform().setPosition(50, 25);
    this.testRenderable.getXform().setSize(5, 5);
    
};

TestScene.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

//  Draws the current renderable(s) to the camera(s)
//  Make sure NOT to change any STATE in this function!
TestScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Activate the Sprite Source Camera
    this.spriteSourceCamera.setupViewProjection();

    // Draw spriteSource and interactive bound
    this.spriteSource.draw(this.spriteSourceCamera.getVPMatrix());
    this.interactiveBoundObj.draw(this.spriteSourceCamera.getVPMatrix());
    
    //this.testRenderable.draw(this.spriteSourceCamera.getVPMatrix());
    
    // Activate the Animation View Camera
    this.animationViewCamera.setupViewProjection();
    
    // Draw the Animation Object
    this.animObj.draw(this.animationViewCamera.getVPMatrix());

};

// Updates the application state. 
// Make sure NOT to DRAW anything from this function!
TestScene.prototype.update = function () {
    // Update InteractiveBound
    this.interactiveBoundObj.update();
    
    if (this.interactiveBoundObj.getHasChanged()) {
        // Setup SpriteAnimateRenderable based on current interactiveBound 
        var ibPos = this.interactiveBoundObj.getPosition();
        var ibWidth = this.interactiveBoundObj.getWidth();
        var ibHeight = this.interactiveBoundObj.getHeight();

        var ibPosInUV = this.spriteSource.getUVFromWC(ibPos[0], ibPos[1]);
        var ibWidthInUV = ibWidth / this.spriteSource.mWidth;
        var ibHeightInUV = ibHeight / this.spriteSource.mHeight;

        var ibTopInUV = ibPosInUV[1] + (ibHeightInUV / 2);
        var ibLeftInUV = ibPosInUV[0] + (ibWidthInUV / 2);
        
        this.animObj.setSpriteSequenceUV(
                ibTopInUV,
                ibLeftInUV,
                ibWidthInUV,
                ibHeightInUV,
                5,      // number of elements in this sequence
                0);     // horizontal padding in between
        
        //--------------------------------------------------------------------//
        // update camera settings to correct aspect ratio
        var ibRatio = ibHeight / ibWidth;
        if (ibRatio <= 1) {
            this.animObj.getXform().setSize(this.initAnimObjWidth, (this.initAnimObjWidth * ibRatio));
            var h = this.cSpaceHeight * ibRatio;
            var originY = this.cSpaceOriginY + (this.cSpaceHeight / 2) - (h / 2);
            this.animationViewCamera.setViewport([this.cSpaceOriginX, originY, this.cSpaceWidth, h]);
        } else {
            // Invert bound ratio, then calculate settings
            ibRatio = 1 / ibRatio;
            this.animObj.getXform().setSize((this.initAnimObjWidth * ibRatio), this.initAnimObjWidth);
            var w = this.cSpaceWidth * ibRatio;
            var originX = this.cSpaceOriginX + (this.cSpaceWidth / 2) - (w / 2);
            this.animationViewCamera.setViewport([originX, this.cSpaceOriginY, w, this.cSpaceHeight]);
            var camW = this.initAnimObjWidth * ibRatio;
            this.animationViewCamera.setWCWidth(camW);
        }
        
    }
    
    this.animObj.updateAnimation();
};