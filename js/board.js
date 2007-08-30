/**
 * EidoGo -- Web-based SGF Replayer
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Go board-related stuff
 */

/**
 * @class Keeps track of board state and passes off rendering to a renderer.
 * We can theoretically have any kind of renderer. The board state is
 * independent of its visual presentation.
 */
eidogo.Board = function(renderer, boardSize) {
	this.init(renderer, boardSize);
};
eidogo.Board.prototype = {
	WHITE: 1,
	BLACK: -1,
	EMPTY: 0,
	/**
	 * @constructor
	 * @param {Object} The renderer to use to draw the board. Renderers must
	 * have at least three methods: clear(), renderStone(), and renderMarker()
	 * @param {Number} Board size -- theoretically could be any size,
	 * but there's currently only CSS for 9, 13, and 19
	 */
	init: function(renderer, boardSize) {
		this.boardSize = boardSize || 19;
		this.stones = this.makeBoardArray(this.EMPTY);
		this.markers = this.makeBoardArray(this.EMPTY);
		this.captures = {};
		this.captures.W = 0;
		this.captures.B = 0;
		this.cache = [];
		this.renderer = renderer || new eidogo.BoardRendererHtml();
		this.lastRender = {
			stones: this.makeBoardArray(null),
			markers: this.makeBoardArray(null)
		};
	},
	reset: function() {
		this.init(this.renderer, this.boardSize);
	},
	clear: function() {
		this.clearStones();
		this.clearMarkers();
		this.clearCaptures();
	},
	clearStones: function() {
		// we could use makeBoardArray(), but this is more efficient
		for (var i = 0; i < this.stones.length; i++) {
		    this.stones[i] = this.EMPTY;
		}
	},
	clearMarkers: function() {
		for (var i = 0; i < this.markers.length; i++) {
		    this.markers[i] = this.EMPTY;
		}
	},
	clearCaptures: function() {
		this.captures.W = 0;
		this.captures.B = 0;
	},
	makeBoardArray: function(val) {
		// We could use a multi-dimensional array but doing this avoids
		// the need for deep copying during commit, which is very slow.
		return [].setLength(this.boardSize * this.boardSize, val);
	},
	/**
	 * Save the current state. This allows us to revert back
	 * to previous states for, say, navigating backwards in a game.
	 */
	commit: function() {
		this.cache.push({
			stones: this.stones.concat(),
			captures: {W: this.captures.W, B: this.captures.B}
		});
	},
	/**
	 * Undo any uncomitted changes.
	 */
	rollback: function() {
		if (this.cache.last()) {
			this.stones = this.cache.last().stones.concat();
			this.captures.W = this.cache.last().captures.W;
			this.captures.B = this.cache.last().captures.B;
		} else {
			this.clear();
		}
	},
	/**
	 * Revert to a previous state.
	 */
	revert: function(steps) {
		steps = steps || 1;
		this.rollback();
		for (var i = 0; i < steps; i++) {
			this.cache.pop();
		}
		this.rollback();
	},
	addStone: function(pt, color) {
		this.stones[pt.y * this.boardSize + pt.x] = color;
	},
	getStone: function(pt) {
	    return this.stones[pt.y * this.boardSize + pt.x];
	},
	getRegion: function(t, l, w, h) {
	    var region = [].setLength(w * h, this.EMPTY);
	    var offset;
	    for (var y = t; y < t + h; y++) {
	        for (var x = l; x < l + w; x++) {
	            offset = (y - t) * w + (x - l);
	            region[offset] = this.getStone({x:x, y:y});
	        }
	    }
	    return region;
	},
	addMarker: function(pt, type) {
		this.markers[pt.y * this.boardSize + pt.x] = type;
	},
	getMarker: function(pt) {
	    return this.markers[pt.y * this.boardSize + pt.x];
	},
	render: function(complete) {
		var stones = this.makeBoardArray(null);
		var markers = this.makeBoardArray(null);
		var color, type;
		if (!complete && this.cache.last()) {
			// render only points that have changed since the last render
			for (var i = 0; i < this.stones.length; i++) {
			    if (this.cache.last().stones[i] != this.lastRender.stones[i]) {
			        stones[i] = this.cache.last().stones[i];
			    }
			}
			markers = this.markers;
		} else {
			// render everything
			stones = this.stones;
			markers = this.markers;
		}
		var offset;
		for (var x = 0; x < this.boardSize; x++) {
			for (var y = 0; y < this.boardSize; y++) {
			    offset = y * this.boardSize + x;
				if (stones[offset] == null) {
					continue;
				} else if (stones[offset] == this.EMPTY) {
					color = "empty";
				} else {
					color = (stones[offset] == this.WHITE ? "white" : "black");
				}
				this.renderer.renderStone({x: x, y: y}, color);
				this.lastRender.stones[offset] = stones[offset];
			}
		}
		for (var x = 0; x < this.boardSize; x++) {
			for (var y = 0; y < this.boardSize; y++) {
			    offset = y * this.boardSize + x;
				if (markers[offset] == null) continue;
				this.renderer.renderMarker({x: x, y: y}, markers[offset]);
				this.lastRender.markers[offset] = markers[offset];
			}
		}
	}
};

/**
 * @class An HTML/DOM-based board renderer.
 */
eidogo.BoardRendererHtml = function(domNode, boardSize) {
	this.init(domNode, boardSize);
}
eidogo.BoardRendererHtml.prototype = {
	/**
	 * @constructor
	 * @param {HTMLElement} domContainer Where to put the board
	 */
	init: function(domContainer, boardSize) {
		if (!domContainer) {
			throw "No DOM container";
			return;
		}
		this.boardSize = boardSize || 19;
		var domBoard = document.createElement('div');
		domBoard.className = "board size" + this.boardSize;
		domContainer.appendChild(domBoard);
		this.domNode = domBoard;
		this.renderCache = {
		    stones: [].setLength(this.boardSize, 0).addDimension(this.boardSize, 0),
		    markers: [].setLength(this.boardSize, 0).addDimension(this.boardSize, 0)
		}
		// auto-detect point width, point height, and margin
		this.pointWidth = 0;
		this.pointHeight = 0;
		this.margin = 0;
		var stone = this.renderStone({x:0,y:0}, "black");
		this.pointWidth = this.pointHeight = stone.offsetWidth;
		this.clear();
		this.margin = (this.domNode.offsetWidth - (this.boardSize * this.pointWidth)) / 2;
	},
	clear: function() {
		this.domNode.innerHTML = "";
	},
	renderStone: function(pt, color) {
		var stone = document.getElementById("stone-" + pt.x + "-" + pt.y);
		if (stone) {
			stone.parentNode.removeChild(stone);
		}
		if (color != "empty") {
            var div = document.createElement("div");
            div.id = "stone-" + pt.x + "-" + pt.y;
            div.className = "point stone " + color;
            div.style.left = (pt.x * this.pointWidth + this.margin) + "px";
            div.style.top = (pt.y * this.pointHeight + this.margin) + "px";
            this.domNode.appendChild(div);
		    return div;
		}
		return null;
	},
	renderMarker: function(pt, type) {
		if (this.renderCache.markers[pt.x][pt.y]) {
		    var marker = document.getElementById("marker-" + pt.x + "-" + pt.y);
			if (marker) {
			    marker.parentNode.removeChild(marker);
			}
		}
		if (type == "empty" || !type) { 
		    this.renderCache.markers[pt.x][pt.y] = 0;
		    return null;
	    }
		this.renderCache.markers[pt.x][pt.y] = 1;
		if (type) {
			var text = "";
			switch (type) {
				case "triangle":
				case "square":
				case "circle":
				case "ex":
				case "territory-white":
				case "territory-black":
				case "current":
					break;
				default:
					if (type.indexOf("var:") == 0) {
						text = type.substring(4);
						type = "variation";
					} else {
						text = type;
						type = "label";
					}
					break;
			}
			var div = document.createElement("div");
			div.id = "marker-" + pt.x + "-" + pt.y;
			div.className = "point marker " + type;
			div.style.left = (pt.x * this.pointWidth + this.margin) + "px";
			div.style.top = (pt.y * this.pointHeight + this.margin) + "px";
			div.appendChild(document.createTextNode(text));
			this.domNode.appendChild(div);
			return div;
		}
		return null;
	}
}

/**
 * @class heh
 */
eidogo.BoardRendererAscii = function(domNode, boardSize) {
	this.init(domNode, boardSize);
}
eidogo.BoardRendererAscii.prototype = {
	pointWidth: 2,
	pointHeight: 1,
	margin: 1,
	blankBoard:	"+-------------------------------------+\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"|. . . . . . . . . . . . . . . . . . .|\n" +
				"+-------------------------------------+",
	init: function(domNode, boardSize) {
		this.domNode = domNode || null;
		this.boardSize = boardSize || 19;
		this.content = this.blankBoard;
	},
	clear: function() {
		this.content = this.blankBoard;
		this.domNode.innerHTML = "<pre>" + this.content + "</pre>";
	},
	renderStone: function(pt, color) {
		var offset = (this.pointWidth * this.boardSize + this.margin * 2)
			* (pt.y * this.pointHeight + 1)
			+ (pt.x * this.pointWidth) + 2;
		this.content = this.content.substring(0, offset-1) + "."
			+ this.content.substring(offset);
		if (color != "empty") {
			this.content = this.content.substring(0, offset-1) +
				(color == "white" ? "O" : "#") + this.content.substring(offset);
		}
		this.domNode.innerHTML = "<pre>" + this.content + "</pre>";
	},
	renderMarker: function(pt, type) {
		// I don't think this is possible
	}
}