/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, SpriteRenderable: false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false, SpriteAnimateRenderable: false, GameOver: false,
  FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
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
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // Load the textures    
    gEngine.Textures.loadTexture(this.kFontImage);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBoundImage);
};

MyGame.prototype.unloadScene = function () {
    // Unload the textures 
    gEngine.Textures.unloadTexture(this.kFontImage);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBoundImage);

    // Starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
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
        [640, 0, 320, 480]              // viewport (orgX, orgY, width, height)
    );
    this.animationViewCamera.setBackgroundColor([0.0, 0.2, 0.5, 1]);
            // sets the background to blue (for test purposes)

    // Gets image width and height
    var spriteInfo = gEngine.Textures.getTextureInfo(this.kMinionSprite);
    console.log(spriteInfo.mWidth);
    console.log(spriteInfo.mHeight);

    // Create the spriteSource renderable and assign the first sprite sheet image
    this.spriteSource = new SpriteRenderable(this.kMinionSprite);
    this.spriteSource.setColor([1, 1, 1, 0]);
    this.spriteSource.getXform().setPosition(50, 25);
    this.spriteSource.getXform().setSize(100, 50);

    // Create the interactiveBound renderable that indicates the user controlled
    // interactive bound in the spriteSource view
    this.interactiveBoundObj = new SpriteRenderable(this.kBoundImage);
    this.interactiveBoundObj.setColor([1, 1, 1, 0]);
    this.interactiveBoundObj.getXform().setPosition(50, 25);
    this.interactiveBoundObj.getXform().setSize(10, 10);
    
    this.animObj = new SpriteAnimateRenderable(this.kMinionSprite);
    this.animObj.setColor([1, 1, 1, 0]);
    this.animObj.getXform().setPosition(-100, -100);
    this.animObj.getXform().setSize(100, 100);
    this.animObj.setElementUVCoordinate(0.45, 0.55, 0.40, 0.60);
};

MyGame.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

//  Draws the current renderable(s) to the camera(s)
//  Make sure NOT to change any STATE in this function!
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Activate the Sprite Source Camera
    this.spriteSourceCamera.setupViewProjection();

    // Draw spriteSource and interactive bound
    this.spriteSource.draw(this.spriteSourceCamera.getVPMatrix());
    this.interactiveBoundObj.draw(this.spriteSourceCamera.getVPMatrix());
    
    // Activate the Animation View Camera
    this.animationViewCamera.setupViewProjection();
    
    // Draw the Animation Object
    this.animObj.draw(this.animationViewCamera.getVPMatrix());

};

// Updates the application state. 
// Make sure NOT to DRAW anything from this function!
MyGame.prototype.update = function () {

    // Interactive Bound Movement Controls
    var boundDelta = 0.5;
    var boundXform = this.interactiveBoundObj.getXform();
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        boundXform.incXPosBy(boundDelta);
        if (boundXform.getXPos() > 100) { // check right-bound of the window
            var yPos = boundXform.getYPos();
            boundXform.setPosition(0, yPos);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        boundXform.incXPosBy(-boundDelta);
        if (boundXform.getXPos() < 0) {  // check left-bound of the window
            var yPos = boundXform.getYPos();
            boundXform.setPosition(100, yPos);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        boundXform.incYPosBy(boundDelta);
        if (boundXform.getYPos() > 75) { // check top-bound of the window
            var xPos = boundXform.getXPos();
            boundXform.setPosition(xPos, 0);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        boundXform.incYPosBy(-boundDelta);
        if (boundXform.getYPos() < 0) { // check bottom-bound of the window
            var xPos = boundXform.getXPos();
            boundXform.setPosition(xPos, 75);
        }
    }
    
    // Interactive Bound Size Controls
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        boundXform.incWidthBy(boundDelta);
        if (boundXform.getWidth() > 100) { // check if equal to window width
            var h = boundXform.getHeight();
            boundXform.setSize(100, h);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        boundXform.incWidthBy(-boundDelta);
        if (boundXform.getWidth() < 0.5) {  // check if smaller than allowed
            var h = boundXform.getHeight();
            boundXform.setSize(0.5, h);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        boundXform.incHeightBy(boundDelta);
        if (boundXform.getHeight() > 75) { // check if equal to window height
            var w = boundXform.getWidth();
            boundXform.setSize(w, 75);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        boundXform.incHeightBy(-boundDelta);
        if (boundXform.getHeight() < 0.5) { // check if if smaller than allowed
            var w = boundXform.getWidth();
            boundXform.setSize(w, 0.5);
        }
    }
    
    
    // Update AnimObj:
    
    // Part 1: Update AnimObj's UV Coordinates on Sprite Sheet to match the
    // Interactive Bound
    // Get spriteSource transform
    var ssXform = this.spriteSource.getXform();
    
    // Convert interactive bound center to UV coordinates (on sprite sheet)
    var ibCenterU = boundXform.getXPos() / ssXform.getWidth();
    var ibCenterV = boundXform.getYPos() / ssXform.getHeight();
    
    // Convert interactive bound width and height to UV coordinates
    var ibWidthU = boundXform.getWidth() / ssXform.getWidth();
    var ibHeightV = boundXform.getHeight() / ssXform.getHeight();
    
    // Calculate left, right, bottom, and top for UV settings
    var uLeft = ibCenterU - ibWidthU / 2;
    var uRight = ibCenterU + ibWidthU / 2;
    var uBottom = ibCenterV - ibHeightV / 2;
    var uTop = ibCenterV + ibHeightV / 2;
    
    // set UV coordinates of AnimObj
    this.animObj.setElementUVCoordinate(uLeft, uRight, uBottom, uTop);
    
    // Part 2: Update AnimObj's dimensions to match the ratios of the 
    // interactive bound and the animation view viewport
    var animViewport = this.animationViewCamera.getViewport();
    var vpWidthInWC = this.animationViewCamera.mWCWidth;
    var vpHeightInWC = (animViewport[3] / animViewport[2]) * vpWidthInWC;
    
    var boundRatio = boundXform.getHeight() / boundXform.getWidth();
    
    if (boundRatio <= 1) {
        this.animObj.getXform().setSize(vpWidthInWC, (vpWidthInWC * boundRatio));
    } else {
        boundRatio = 1 / boundRatio;
        this.animObj.getXform().setSize((vpHeightInWC * boundRatio), vpHeightInWC);
    }
    


};