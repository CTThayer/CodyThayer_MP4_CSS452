/* File: SpriteAnimationObject.js 
 *
 * Creates and initializes a Sprite Animation Object
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpriteAnimationObject(spriteTexture, atX, atY) {
    this.kDelta = 0.2;
    this.mSpriteAnimationObject = new SpriteAnimateRenderable(spriteTexture);
    this.mSpriteAnimationObject.setColor([1, 1, 1, 0]);
    this.mSpriteAnimationObject.getXform().setPosition(atX, atY);
    this.mSpriteAnimationObject.getXform().setSize(12, 9.6);
    this.mSpriteAnimationObject.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mSpriteAnimationObject.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mSpriteAnimationObject.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates

    GameObject.call(this, this.mMinion);
}