function AnimatedGameObject() {

    this.startupAnimatedGameObject = function(game, image, x, y, z, frameCount, fps) {
        this.startupGameObject(game, image, x, y, z);
		this.setAnimation(image, frameCount, fps);
        return this;
    };

    this.shutdownAnimatedGameObject = function() {
        this.shutdownGameObject();       
    };

    this.setAnimation = function(image, frameCount, fps) {
        this.image = image;
		this.currentFrame = 0;
        this.frameCount = frameCount;
        this.timeBetweenFrames = 1000/fps;
        this.dim[0] = this.image.width / this.frameCount;
    };

    this.draw = function(canvas, scroll) {
		this.currentFrame = parseInt(this.game.frameTime * this.game.frame / this.timeBetweenFrames) % this.frameCount;
        canvas.drawImage(this.image, this.dim[0] * this.currentFrame, 0, this.dim[0], this.image.height, this.x[0] - scroll[0], this.x[1] - scroll[1], this.dim[0], this.image.height);
    };
};
AnimatedGameObject.prototype = new GameObject;