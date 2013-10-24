var GameObject = function() {
	this.zOrder = 0;
	this.x = [0,0];
	this.dim = [0,0];
	this.v = [0,0];
	this.a = [0,0];
	this.image = null;
	this.pos = {
		top: function(value) { if (arguments.length > 0) { return this.self.x[1] = value; } return this.self.x[1]; },
		bottom: function(value) { if (arguments.length > 0) { return this.self.x[1] = value - this.self.dim[1]; } return this.self.x[1] + this.self.dim[1]; },
		left: function(value) { if (arguments.length > 0) { return this.self.x[0] = value; } return this.self.x[0]; },
		right: function(value) { if (arguments.length > 0) { return this.self.x[0] = value - this.self.dim[0]; } return this.self.x[0] + this.self.dim[0]; },
		test: function() { return this.self.x; }
	};
	
    this.startupGameObject = function(game, image, x, y, z) {
		if (!image) { console.log(this); }
		this.pos.self = this;
		this.game = game;
		this.game.addGameObject(this);
		this.zOrder = z;
		this.x = [x,y];
        this.image = image;
		this.dim = [image.width, image.height];
        return this;
    };
    
    this.shutdownGameObject = function() {
		this.game.removeGameObject(this);
        this.image = null;
    };
	
	this.update = function(context) { };
	
    this.draw = function(context, scroll) {
        context.drawImage(this.image, this.x[0] - scroll[0], this.x[1] - scroll[1]);
    };
};