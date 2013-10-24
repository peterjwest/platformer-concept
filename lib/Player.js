var Player = function() {
	this.onSurface = {left: false, right: false, bottom: false};
	this.runSpeed = 1;
	this.groundFriction = 0.2;
	this.v = [0,0];
	this.a = [0,1];
	this.jumpVelocity = 20;
	this.left = false;
	this.right = false;
	this.space = false;

	this.startupPlayer = function(game, image, x, y, z, frameCount, fps) {
		this.startupAnimatedGameObject(game, image, x, y, z, frameCount, fps);
		this.level = game.level;
		return this;
	};

	this.keyDown = function(event) {
		var updateRequired = false;
		if (event.keyCode == 37 && !this.left) {
			this.left = true;
			updateRequired = true;
		}
		if (event.keyCode == 38) {
			this.up = true;
		}
		if (event.keyCode == 40) {
			this.down = true;
		}
		if (event.keyCode == 39 && !this.right) {
			this.right = true;
			updateRequired = true;
		}
		if (event.keyCode == 32 && !this.space) {
			this.space = true;
			if (this.onSurface.bottom) this.v[1] = -this.jumpVelocity;
			else if (this.onSurface.left) { this.v[0] = this.jumpVelocity/2; this.v[1] = -this.jumpVelocity; }
			else if (this.onSurface.right) { this.v[0] = -this.jumpVelocity/2; this.v[1] = -this.jumpVelocity; }
			else { this.jetpack = true; }
		}
		if (updateRequired) this.updateAnimation();
	 };

	this.keyUp = function(event) {
		if (event.keyCode == 37) this.left = false;
		if (event.keyCode == 39) this.right = false;
		if (event.keyCode == 38) this.up = false;
		if (event.keyCode == 40) this.down = false;
		if (event.keyCode == 32) { this.space = false; this.jetpack = false; }
		this.updateAnimation();
	 };

	this.updateAnimation = function() {
		if (this.right) this.setAnimation(this.game.loader.playerRight, 4, 4);
		else if (this.left) this.setAnimation(this.game.loader.playerLeft, 4, 4);
	 };
	
	this.update = function (canvas) {
		if (this.left) { if (-this.v[0] < this.runSpeed*10) this.v[0] -= this.runSpeed; }
		if (this.right) { if (this.v[0] < this.runSpeed*10) this.v[0] += this.runSpeed; }
		if (((this.v[0] < 0 && !this.left) || (this.v[0] > 0 && !this.right)) && this.onSurface.bottom) { this.v[0] = Math.abs(this.v[0]) > 0.5 ? this.v[0] * (1 - this.groundFriction) : 0; }
		this.v[1] += this.a[1];
		if (this.jetpack) this.v[1] -= 2;
		for (i in this.level.blocks) this.touching(this.level.blocks[i]);
		this.x = [parseInt(this.x[0] + this.v[0]), parseInt(this.x[1] + this.v[1])];
		this.collisions(this.level.blocks);
		for (i in this.level.blocks) this.touching(this.level.blocks[i]);
		this.surface(this.level.blocks);
	 };
	
	this.collisions = function(objects) {
		var collisions = [];
		for (i in objects) {
			collision = this.collision(objects[i]);
			if (collision) collisions.push(collision);
		}
		collisions = collisions.sort(function(a, b) { return a.ratio > b.ratio ? 1 : -1; });
		if (collisions[0]) { 
			this.onCollision(collisions[0]);
		}
		if (collisions.length > 1) { this.collisions(objects); }
	};
	
	this.occupying = function(obj) {
		return {
			x: this.pos.right() > obj.pos.left() && this.pos.left() < obj.pos.right(),
			y: this.pos.bottom() > obj.pos.top() && this.pos.top() < obj.pos.bottom()
		};
	};
	
	this.touching = function(obj) {
		var occupying = this.occupying(obj);
		if (this.pos.right() == obj.pos.left() && occupying.y && this.v[0] > 0) { this.v[0] = 0; }
		if (this.pos.left() == obj.pos.right() && occupying.y && this.v[0] < 0) { this.v[0] = 0; }
		if (this.pos.top() == obj.pos.bottom() && occupying.x && this.v[1] < 0) { this.v[1] = 0; }
		if (this.pos.bottom() == obj.pos.top() && occupying.x && this.v[1] > 0) { this.v[1] = 0; }
	};
	
	this.collision = function(obj) {
		var occupying = this.occupying(obj);
		if (!occupying.y || !occupying.x) return false;
		var v = { x: this.v[0] - obj.v[0], y: this.v[1] - obj.v[1] };
		var dist = {
			top: this.pos.top() - obj.pos.bottom(),
			bottom: this.pos.bottom() - obj.pos.top(),
			left: this.pos.left() - obj.pos.right(),
			right: this.pos.right() - obj.pos.left()
		};
		var ratio = {
			top: v.y < 0 && dist.top == 0 ? 0 : (v.y - dist.top) / v.y,
			bottom: v.y > 0 && dist.bottom == 0 ? 0 : (v.y - dist.bottom) / v.y,
			left: v.x < 0 && dist.left == 0 ? 0 : (v.x - dist.left) / v.x,
			right: v.x > 0 && dist.right == 0 ? 0 : (v.x - dist.right) / v.x
		};
		var collision = { ratio: 10, dir: false, obj: obj };
		for (dir in ratio) {
			if (ratio[dir] !== false && ratio[dir] < collision.ratio && ratio[dir] >= 0) {
				collision.ratio = ratio[dir];
				collision.dir = dir;
			}
		}
		return collision.dir ? collision : false;
	};
	
;	this.surface = function(objects) {
		this.onSurface = {bottom: false, left: false, right: false};
		for (i in objects) {
			var occupying = this.occupying(objects[i]);
			if (occupying.x) {
				if (this.pos.bottom() == objects[i].pos.top()) this.onSurface.bottom = true;
			}
			if (occupying.y) {
				if (this.pos.left() == objects[i].pos.right()) this.onSurface.left = true;
				if (this.pos.right() == objects[i].pos.left()) this.onSurface.right = true;
			}
		}
	};
	
	this.onCollision = function(event) {
		if (event.dir == "top") { this.pos.top(event.obj.pos.bottom()); }
		if (event.dir == "bottom") { this.pos.bottom(event.obj.pos.top()); }
		if (event.dir == "left") { this.pos.left(event.obj.pos.right()); }
		if (event.dir == "right") { this.pos.right(event.obj.pos.left()); }
	};
};
Player.prototype = new AnimatedGameObject;