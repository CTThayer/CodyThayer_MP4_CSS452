/*
 * File: GameOver.js 
 * The game over screen
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, Camera: false, vec2: false, FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameOver() {
    this.spriteSourceCamera = null;
    this.mMsg = null;
}
gEngine.Core.inheritPrototype(GameOver, Scene);

GameOver.prototype.unloadScene = function () {
    // will be called from GameLoop.stop
    gEngine.Core.cleanUp(); // release gl resources
};

GameOver.prototype.initialize = function () {
    // Step A: set up the cameras
    this.spriteSourceCamera = new Camera(
        vec2.fromValues(50, 33),   // position of the camera
        100,                       // width of camera
        [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
    );
    this.spriteSourceCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to gray

    //<editor-fold desc="Create the fonts!">
    // this.mText = new FontRenderable("This is green text");
    this.mMsg = new FontRenderable("Game Over!");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(22, 32);
    this.mMsg.setTextHeight(10);
    //</editor-fold>
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GameOver.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.spriteSourceCamera.setupViewProjection();
    this.mMsg.draw(this.spriteSourceCamera.getVPMatrix());
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GameOver.prototype.update = function () {
    gEngine.GameLoop.stop();
};