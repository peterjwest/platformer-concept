var Loader = function() {
    this.imageNames = [];
	this.complete = false;
    this.init = function(images) {
        for (var i = 0; i < images.length; i++) {
			var image = new Image;
			this[images[i].name] = image;
			this.imageNames.push(images[i].name);
			image.src = images[i].src;
		}
        return this;
    };
	
	this.done = function() {
		if (!this.complete) {
			var n = 0;
			for (var i = 0; i < this.imageNames.length; i++)
				if (this[this.imageNames[i]].complete) n++;
			if (n == this.imageNames.length) this.complete = true;
		}
		return this.complete;
	};
};