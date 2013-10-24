var Game = function() {
	this.gameObjects = new Array();
	this.frame = 0;
	this.lastFrame = new Date().getTime();
	this.scroll = [0,0];
	this.screenBorder = 20;
	this.loaded = false;
	this.keyDown = function(event) {
		for (x in this.gameObjects) {
			if (this.gameObjects[x].keyDown) this.gameObjects[x].keyDown(event);
		}
	};
	this.keyUp = function(event) {
		for (x in this.gameObjects) {
			if (this.gameObjects[x].keyUp) this.gameObjects[x].keyUp(event);
		}
	};

	this.init = function(fps) {
		this.canvas = document.getElementById('canvas');
		if (!this.canvas.getContext) return false;
		this.frameTime = 1000/fps;
		var game = this;
		$(document).keydown(function(e){ game.keyDown(e) }).keyup(function(e){ game.keyUp(e) });
		this.canvas.context2D = this.canvas.getContext('2d');
		this.buffer = document.createElement('canvas');
		this.buffer.width = this.canvas.width;
		this.buffer.height = this.canvas.height;
		this.buffer.context2D = this.buffer.getContext('2d');
		this.loader = new Loader().init([
			{name: 'playerLeft', src: 'images/player_left.png'},
			{name: 'playerRight', src: 'images/player_right.png'},
			{name: 'background1', src: 'images/background_1.png'},
			{name: 'background2', src: 'images/background_2.png'},
			{name: 'block', src: 'images/block.png'}
		]);
		setInterval(function() { game.update(); }, this.frameTime);
		return this;
	};

	this.load = function() {
		this.level = new Level();
		this.level.map.push("1111                 1  1           1111");
		this.level.map.push("1     111            1  111111         1");
		this.level.map.push("1               1111 1  1    1         1");
		this.level.map.push("1         11111 1    1  1    1         1");
		this.level.map.push("1    1111 1     1 1111  1              1");
		this.level.map.push("1    1                          111    1");
		this.level.map.push("1    1 1111   111                      1");
		this.level.map.push("1    1   1      1        11111         1");
		this.level.map.push("1    111 1      111111               111");
		this.level.map.push("1        1                             1");
		this.level.map.push("1111111111111111111111111111111111111111");
		this.level.init(this);
		this.player = new Player().startupPlayer(this, this.loader.playerRight, 100, 50, 3, 4, 6);
		this.background2 = new RepeatingGameObject().startupRepeatingGameObject(this, this.loader.background2, 0, 100, 1, 600, 320, 0.5);
		this.background1 = new RepeatingGameObject().startupRepeatingGameObject(this, this.loader.background1, 0, 0, 0, 600, 320, 0.25);
		this.loaded = true;
	}

    this.update = function () {
		this.frame++;
		/*var thisFrame = new Date().getTime();
		this.timeScaler = Math.min((thisFrame - this.lastFrame) / (this.frameTime), 1.5);
		this.lastFrame = thisFrame;*/
			if (!this.loaded) {
				if (this.loader.done()) this.load();
			else {
				this.canvas.context2D.fillStyle = "rgb(122,122,122)";
				this.canvas.context2D.fillRect(0, 0, this.canvas.width, this.canvas.height);
			}
		}
		else {
			this.buffer.context2D.clearRect(0, 0, this.buffer.width, this.buffer.height);
			this.canvas.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
			for (x in this.gameObjects) { this.gameObjects[x].update(this.buffer.context2D); }
			this.updateScroll();
			for (x in this.gameObjects) { this.gameObjects[x].draw(this.buffer.context2D, this.scroll); }
			this.canvas.context2D.drawImage(this.buffer, 0, 0);
		}
    };

	this.updateScroll = function() {
		this.scroll[0] = this.player.x[0] + this.player.dim[0]/2 - this.canvas.width/2;
		this.scroll[1] = this.player.x[1] + this.player.dim[1]/2 - this.canvas.height/2;
	};

    this.addGameObject = function(gameObject) {
        this.gameObjects.push(gameObject);
        this.gameObjects.sort(function(a,b) { return a.zOrder - b.zOrder; })
    };

    this.removeGameObject = function(gameObject) {
		for (var i = 0; i < this.gameObjects.length; ++i) {
			if (this.gameObjects[i] === gameObject) {
				var rest = this.gameObjects.slice(i + 1);
				this.gameObjects.length = i;
				this.gameObjects.push.apply(this.gameObjects, rest);
				return;
			}
		}
    };

	this.nth = function(n, run) {
		if (this.frame % n) run.call(this);
	};
};
