var Level = function() {
	this.map = [];
	this.blocks = [];
	this.blockWidth = 64;
	this.blockHeight = 46;

	this.init = function(game) {
		this.game = game;
		this.addBlocks();
		return this;
	};

	this.addBlocks = function() {
		var level = this;
		var game = this.game;
		$.map(this.map, function(b, y) {
			$.map(b.split(''), function(b, x) {
				if (b == 1) level.blocks.push(new GameObject().startupGameObject(game, game.loader.block, parseInt(x * level.blockWidth), parseInt(15 + y * level.blockHeight), 4));
			})
		});
	};
};
