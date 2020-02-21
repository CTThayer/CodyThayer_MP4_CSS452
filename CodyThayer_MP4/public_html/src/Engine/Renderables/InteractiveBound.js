/* File: InteractiveBound.js
 * 
 * InteractiveBound encapsulates all of the functionality for a InteractiveBound
 * object as defined in the MP4 spec documents.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Interactive Bound Constructor
// Takes a texture file and an 8 float array of parameters for position, size, 
// and confining boundaries
function InteractiveBound(bTexture) {
    // Set up texture renderable for interactive bound
    TextureRenderable.call(this, bTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());
}
gEngine.Core.inheritPrototype(InteractiveBound, TextureRenderable);

InteractiveBound.prototype.initialize = function (params) {
    
    this.boundXform = this.getXform();
    this.boundXform.setPosition(params[0], params[1]);
    this.boundXform.setSize(params[2], params[3]);
    
    // Store min/max positions (boundary of sprite source)
    this.minX = params[4];  // Minimum x value in WC the bound must not go past
    this.minY = params[5];  // Maximum x value in WC the bound must not go past
    this.maxX = params[6];  // Minimum y value in WC the bound must not go past
    this.maxY = params[7];  // Maximum y value in WC the bound must not go past
    
    // Track whether interactive bound has changed 
    // (for only setting the SpriteAnimateRenderable when necessary)
    this.hasChanged = true;
    
    // Set up boundary markers
    var halfw = this.boundXform.getWidth() / 2;
    var halfh = this.boundXform.getHeight() / 2;
    var pos = this.boundXform.getPosition();
    
    this.topMarker = new Renderable();
    var wt = pos[0];
    var ht = pos[1] + halfh;
    this.topMarker.getXform().setPosition(wt, ht);
    this.topMarker.getXform().setSize(1, 1);
    this.topMarker.setColor(0.8, 0.2, 0.2, 1.0);
    
    this.bottomMarker = new Renderable();
    wt = pos[0];
    ht = pos[1] - halfh;
    this.bottomMarker.getXform().setPosition(wt, ht);
    this.bottomMarker.getXform().setSize(1, 1);
    this.bottomMarker.setColor(0.2, 0.8, 0.2, 1.0);
    
    this.leftMarker = new Renderable();
    wt = pos[0] - halfw;
    ht = pos[1];
    this.leftMarker.getXform().setPosition(wt, ht);
    this.leftMarker.getXform().setSize(1, 1);
    this.leftMarker.setColor(0.2, 0.2, 0.8, 1.0);
    
    this.rightMarker = new Renderable();
    wt = pos[0] - halfw;
    ht = pos[1];
    this.rightMarker.getXform().setPosition(wt, ht);
    this.rightMarker.getXform().setSize(1, 1);
    this.rightMarker.setColor(0.2, 0.2, 0.2, 1.0);
}

InteractiveBound.prototype.update = function() {
    
    // reset hasChanged to false
    this.hasChanged = false;
    
    // Interactive Bound Movement Controls
    var boundDelta = 0.5;
    
    // TODO Add code here for switching to 1% refinement mode with space
    
    var center = this.boundXform.getPosition();
    var halfx = this.boundXform.getWidth() / 2;
    var halfy = this.boundXform.getHeight() / 2;
    
    var Top = center[1] + halfy;
    var Bottom = center[1] - halfy;
    var Left = center[0] - halfx;
    var Right = center[0] + halfx;
    
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (Right + boundDelta < this.maxX) {
            this.boundXform.incXPosBy(boundDelta);
        }
        else {
            this.boundXform.setPosition(this.minX + halfx, center[1]);
        }
        this.hasChanged = true;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (Left - boundDelta > this.minX) {
            this.boundXform.incXPosBy(-boundDelta);
        }
        else {
            this.boundXform.setPosition(this.maxX - halfx, center[1]);
        }
        this.hasChanged = true;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (Top + boundDelta < this.maxY) {
            this.boundXform.incYPosBy(boundDelta);
        }
        else {
            this.boundXform.setPosition(center[0], this.minY + halfy);
        }
        this.hasChanged = true;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (Bottom - boundDelta > this.minY) {
            this.boundXform.incYPosBy(-boundDelta);
        }
        else {
            this.boundXform.setPosition(center[0], this.maxY - halfx);
        }
        this.hasChanged = true;
    }
    
    // Interactive Bound Size Controls
    var sizeMaxX = this.maxX - this.minX;
    var sizeMaxY = this.maxY - this.minY;
    
    // Update center in case of prior changes
    center = this.boundXform.getPosition();

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (Right + (boundDelta / 2) < this.maxX && Left - (boundDelta / 2) > this.minX) {
            this.boundXform.incWidthBy(boundDelta);
            this.hasChanged = true;
        }
//        else if ((Right + boundDelta) - Left  < sizeMaxY) {
//            this.boundXform.setPosition(center[0] + boundDelta, center[1]);
//            this.boundXform.incWidthBy(boundDelta);
//        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (this.boundXform.getWidth() > 1) {
            this.boundXform.incWidthBy(-boundDelta);
            this.hasChanged = true;
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (Top + (boundDelta / 2) < this.maxY && Bottom + (boundDelta / 2) > this.minY) {
            this.boundXform.incHeightBy(boundDelta);
            this.hasChanged = true;
        } 
//        else if ((Top + boundDelta) - Bottom  < sizeMaxY) {
//            this.boundXform.setPosition(center[0], center[1] + boundDelta);
//            this.boundXform.incHeightBy(boundDelta);
//        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (this.boundXform.getHeight() > 1) {
            this.boundXform.incHeightBy(-boundDelta);
            this.hasChanged = true;
        }
    }
    
    // Update the marker objects to match current settings
    this.updateMarkers();
    
};

InteractiveBound.prototype.draw = function (vpMatrix) {
    TextureRenderable.prototype.draw.call(this, vpMatrix);
    
    
//    Renderable.prototype.draw.call(this.topMarker, vpMatrix);
//    Renderable.prototype.draw.call(this.bottomMarker, vpMatrix);
//    Renderable.prototype.draw.call(this.leftMarker, vpMatrix);
//    Renderable.prototype.draw.call(this.rightMarker, vpMatrix);
};

InteractiveBound.prototype.getPosition = function() {
    return this.boundXform.getPosition();
};

InteractiveBound.prototype.getWidth = function() {
    return this.boundXform.getWidth();
};

InteractiveBound.prototype.getHeight = function() {
    return this.boundXform.getHeight();
};

InteractiveBound.prototype.getHasChanged = function() {
    return this.hasChanged;
};

InteractiveBound.prototype.updateMarkers = function () {
    // Get width/2, height/2, and position of InteractiveBound object
    var halfw = this.boundXform.getWidth() / 2;
    var halfh = this.boundXform.getHeight() / 2;
    var pos = this.boundXform.getPosition();
    
    var wt = pos[0];
    var ht = pos[1] + halfh;
    this.topMarker.getXform().setPosition(wt, ht);
    
    wt = pos[0];
    ht = pos[1] - halfh;
    this.bottomMarker.getXform().setPosition(wt, ht);

    wt = pos[0] - halfw;
    ht = pos[1];
    this.leftMarker.getXform().setPosition(wt, ht);
    
    wt = pos[0] + halfw;
    ht = pos[1];
    this.rightMarker.getXform().setPosition(wt, ht);

};