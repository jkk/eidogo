/**
 * EidoGo -- Web-based SGF Replayer
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 */

/**
 * @class Player is the overarching control structure that allows you to
 * load and replay games. It's a "player" in the sense of a DVD player, not
 * a person who plays a game.
 */
eidogo.Player = function(cfg) {
	this.init(cfg);
}
eidogo.Player.prototype = {
	infoLabels: {
		GN: "Game",
		PW: "White",
		WR: "White rank",
		WT: "White team",
		PB: "Black",
		BR: "Black rank",
		BT: "Black team",
		HA: "Handicap",
		KM: "Komi",
		RE: "Result",
		DT: "Date",
		GC: "Info",
		PC: "Place",
		EV: "Event",
		RO: "Round",
		OT: "Overtime",
		ON: "Opening",
		RU: "Ruleset",
		AN: "Annotator",
		CP: "Copyright",
		SO: "Source",
		TM: "Time limit",
		US: "Transcriber",
		AP: "Created with"
		// FF, GM, TM
	},
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],

	/**
	 * @constructor
	 * @param {Object} cfg A hash of configuration values
	 */
	init: function(cfg) {
		
		cfg = cfg || {};
		
		// setting this to "edit" currently does nothing
		this.mode = cfg.mode ? cfg.mode : "replay";
		
		// for references to all our DOM objects -- see constructDom()
		this.dom = {};
		this.dom.container = document.getElementById(cfg.domId);
		
		if (!this.dom.container) {
			alert("Error finding DOM container.");
			return;
		}
		
		// so we can have more than one player on a page
		this.uniq = Math.round(10000 * Math.random());

		this.gameTree = new eidogo.GameTree();
		this.cursor = new eidogo.GameCursor();
		
		this.progressiveLoad = cfg.progressiveLoad ? true : false;
		this.progressiveLoads = null;
		this.progressiveUrl = null

		// these are populated after load
		this.board = null;
		this.rules = null;
		this.currentColor = null;
		this.moveNumber = null;
		this.totalMoves = null;
		this.variations = null;
		
		// user-changeable preferences
		this.prefs = {};
		this.prefs.markCurrent = typeof cfg.markCurrent != "undefined" ?
			cfg.markCurrent : true;
		this.prefs.markNext = typeof cfg.markNext != "undefined" ?
			cfg.markNext : false;
		this.prefs.markVariations = typeof cfg.markVariations != "undefined" ?
			cfg.markVariations : true;
		this.prefs.showGameInfo = typeof cfg.showGameInfo != "undefined" ?
			cfg.showGameInfo : true;
		this.prefs.showPlayerInfo = typeof cfg.showPlayerInfo != "undefined" ?
			cfg.showPlayerInfo : true;
			
		this.propertyHandlers = {
			W:	this.playMove,
			B:	this.playMove,
			AW:	this.addStone,
			AB:	this.addStone,
			AE: this.addStone,
			CR: this.addMarker, // circle
			LB: this.addMarker, // label
			TR: this.addMarker, // triangle
			MA: this.addMarker, // X
			SQ: this.addMarker, // square
			TW: this.addMarker,
			TB: this.addMarker,
			C:	this.showComments
		};
		
		this.slider = null;
		
		this.constructDom();
		this.nowLoading();

		// Load the first tree and first node by default.
		this.loadPath = cfg.loadPath && cfg.loadPath.length > 1 ?
			cfg.loadPath : [0, 0];

		if (typeof cfg.sgf == "string") {
			// raw SGF data
			var sgf = new eidogo.SGF(cfg.sgf);
			this.load(sgf.tree);
		} else if (typeof cfg.sgf == "object") {
			// already-parsed JSON game tree
			this.load(cfg.sgf);
		} else if (typeof cfg.sgfUrl == "string") {
			// this is only allowed from within the same domain
			this.remoteLoad(cfg.sgfUrl);
			if (cfg.progressiveLoad) {
				this.progressiveLoads = 0;
				this.progressiveUrl = cfg.progressiveUrl
					|| cfg.sgfUrl.replace(/\?.+$/, "");
			}
		} else {
			// can't start from scratch yet
			this.croak("No game data provided.");
			return;
		}	
	},
	
	createBoard: function(size) {
		size = size || 19;
		try {
			this.board = new eidogo.Board(
				new eidogo.BoardRendererHtml( // change Html to Ascii for kicks
					document.getElementById('board-container-' + this.uniq),
					size
				)
			);
		} catch (e) {
			if (e == "No DOM container") {
				this.croak("Error loading board container.");
				return;
			}
		} 
		this.rules = new eidogo.Rules(this.board);	
		YAHOO.util.Event.on(
			this.board.renderer.domNode,
			"click",
			this.handleBoardClick,
			this,
			true
		);
		YAHOO.util.Event.on(
			document,
			"keydown",
			this.handleKeypress,
			this,
			true
		);
	},
	
	initGame: function(target) {
		var size = target.trees.first().nodes.first().SZ;
		this.createBoard(size || 19);
		this.reset(true);
		this.totalMoves = 0;
		var moveCursor = new eidogo.GameCursor(this.cursor.node);
		while (moveCursor.next()) { this.totalMoves++; }
		this.totalMoves--;
		this.showInfo();
		if (this.prefs.showPlayerInfo) {
			this.dom.infoPlayers.style.display = "block";
		}
		this.enableNavSlider();
	},
	
	load: function(data, target) {
		target = target || this.gameTree;
		target.loadJson(data);
		target.cached = true;
		this.doneLoading();

		if (!target.parent) {
			// initial load
			this.initGame(target);
		} else {
			this.progressiveLoads--;
		}
		
		if (this.loadPath.length) {
			this.goTo(this.loadPath, false);
		} else {
			this.refresh();
		}
	},
	
	remoteLoad: function(url, target) {
		YAHOO.util.Connect.asyncRequest(
			'GET',
			url,
			{
				success: function(o) {
					// infer which kind of file we got
					if (o.responseText.charAt(0) == '(') {
						// SGF
						var sgf = new eidogo.SGF(o.responseText);
						this.load(sgf.tree, target);
					} else if (o.responseText.charAt(0) == '{') {
						// JSON
						eval("var data = " + o.responseText);
						this.load(data, target);
					} else {
						this.croak("Received invalid game data.");
					}
				},
				failure: function(o) {
					this.croak(
						"There was a problem retrieving the game data:\n\n"
						+ o.statusText
					);
				},
				scope: this,
				timeout: 10000
			},
			null
		);
	},
	
	goTo: function(path, fromStart) {
		fromStart = typeof fromStart != "undefined" ? fromStart : true;
		if (path instanceof Array) {
			// Go to an absolute path.
			if (!path.length) return;
			if (fromStart) {
				this.reset(true);
			}
			while (path.length) {
				var position = parseInt(path.shift());
				if (path.length == 0) {
					// node position
					for (var i = 0; i < position; i++) {
						this.variation(null, true);
					}
				} else if (path.length) {
					// tree position
					this.variation(position, true);
					if (path.length != 1) {
						// go to the end of the line for each tree we pass
						while (this.cursor.nextNode()) {
							this.execNode(true);
						}
					}
					if (path.length > 1 && this.progressiveLoads) return;
				}
			}
			this.refresh();
		} else if (!isNaN(parseInt(path))) {
			// Go to a move number.
			var steps = parseInt(path);
			if (fromStart) {
				this.reset(true);
				steps++;
			}
			for (var i = 0; i < steps; i++) {
				this.variation(null, true);
			}
			this.refresh();
		} else {
			alert("Don't know how to get to '" + path + "'!");
		}
	},

	reset: function(noRender, firstGame) {
		this.board.reset();
		this.currentColor = "B";
		this.moveNumber = 0;
		if (firstGame) {
			this.cursor.node = this.gameTree.trees.first().nodes.first();
		} else {
			this.cursor.node = this.gameTree.nodes.first();
		}
		this.refresh(noRender);
	},
	
	refresh: function(noRender) {
		if (this.progressiveLoads) {
			var me = this;
			setTimeout(function() { me.refresh.call(me); }, 10);
			return;
		}
		this.board.revert(1);
		this.moveNumber--;
		if (this.moveNumber < 0) this.moveNumber = 0;
		this.execNode(noRender);
	},
	
	/**
	 * Handles going to both the next sibling and the next variation
	 * @param {Number} treeNum Position of the variation tree to follow
	 * within the current tree's array of trees
	 * @param {Boolean} noRender If true, don't render tthe board
	 */
	variation: function(treeNum, noRender) {
		if (this.cursor.next(treeNum)) {
			this.execNode(noRender);
			// Should we continue after loading finishes or just stop
			// like we do here?
			if (this.progressiveLoads) return false;
			return true;
		}
		return false;
	},
	
	/**
	 * Delegates the work of putting down stones etc to various handler
	 * functions
	 * @param {Boolean} noRender If true, don't render the board
	 */
	execNode: function(noRender) {
		// don't execute a node while it's being loaded
		if (this.progressiveLoads) {
			var me = this;
			setTimeout(function() { me.execNode.call(me, noRender); }, 10);
			return;
		}
		
		if (!noRender) {
			this.dom.comments.innerHTML = "";
			this.board.clearMarkers();
		}
		
		// execute handlers for the appropriate properties
		var props = this.cursor.node.getProperties();
		for (var propName in props) {
			if (this.propertyHandlers[propName]) {
				(this.propertyHandlers[propName]).apply(
					this,
					[this.cursor.node[propName], propName, noRender]
				);
			}
		}
		
		if (noRender) {
			this.board.commit();
		} else {
			this.findVariations();
			this.updateControls();
			this.board.commit();
			this.board.render();
		}
		
		// progressive loading?
		if (this.progressiveUrl && !this.cursor.node.parent.cached) {
			this.nowLoading();
			this.progressiveLoads++;
			this.remoteLoad(
				this.progressiveUrl + "?id=" + this.cursor.node.parent.id,
				this.cursor.node.parent
			);
		}
	},
	
	/**
	 * Locates any variations within the current tree and makes note of their
	 * move and position in the tree array
	 */
	findVariations: function() {
		this.variations = [];
		if (!this.cursor.node) return;
		if (this.prefs.markNext && this.cursor.node.nextSibling != null) {
			// handle next sibling move as variation 1
			this.variations.push({
				move: this.cursor.node.nextSibling.getMove(),
				treeNum: null
			});
		}
		if (this.cursor.node.nextSibling == null
			&& this.cursor.node.parent
			&& this.cursor.node.parent.trees.length) {
			var varTrees = this.cursor.node.parent.trees;
			for (var i = 0; i < varTrees.length; i++) {
				this.variations.push({
					move: varTrees[i].nodes.first().getMove(),
					treeNum: i
				});
			}
		}
	},
	
	back: function() {
		if (this.cursor.previous()) {
			this.board.revert(1);
			this.moveNumber -= 1;
			if (this.moveNumber < 0) this.moveNumber = 0;
			this.refresh();
		}
	},
	
	forward: function() {
		this.variation();
	},
	
	first: function() {
		if (!this.cursor.hasPrevious()) return;
		this.reset(false, true);
	},

	last: function() {
		if (!this.cursor.hasNext()) return;
		while (this.variation(null, true)) {}
		this.refresh();
	},

	pass: function() {
		if (!this.variations) return;
		for (var i = 0; i < this.variations.length; i++) {
			if (!this.variations[i].move || this.variations[i].move == "tt") {
				this.variation(this.variations[i].treeNum);
				return;
			}
		}
	},
	
	handleBoardClick: function(e) {
		var boardXY = YAHOO.util.Dom.getXY(this.board.renderer.domNode);
		var x = Math.round((e.clientX - boardXY[0] - this.board.renderer.margin -
			(this.board.renderer.pointWidth / 2)) / this.board.renderer.pointWidth);
		var y = Math.round((e.clientY - boardXY[1] - this.board.renderer.margin -
			(this.board.renderer.pointHeight / 2)) / this.board.renderer.pointHeight);
		// click on a variation?
		for (var i = 0; i < this.variations.length; i++) {
			var varPt = this.sgfCoordToPoint(this.variations[i].move);
			if (varPt.x == x && varPt.y == y) {
				this.variation(this.variations[i].treeNum);
				YAHOO.util.Event.stopEvent(e);
				return;
			}
		}
	},
	
	handleKeypress: function(e) {
		var charCode = e.keyCode || YAHOO.util.Event.getCharCode(e);
		if (!charCode || e.ctrlKey || e.altKey || e.metaKey) return true;
		var charKey = String.fromCharCode(charCode).toLowerCase();
		
		// Variations can be selected by pressing the appropriate alphanumberic
		// character that is either 1) its variation number; or 2) its
		// marker label.
		for (var i = 0; i < this.variations.length; i++) {
			var varPt = this.sgfCoordToPoint(this.variations[i].move);
			var varLabel = '' + (i + 1);
			if (varPt.x != null
				&& this.board.getMarker(varPt) != this.board.EMPTY
				&& typeof this.board.getMarker(varPt) == "string") {
				varLabel = this.board.getMarker(varPt).toLowerCase();
			}
			varLabel = varLabel.replace(/^var:/, "");
			if (charKey == varLabel.charAt(0)) {
				this.variation(this.variations[i].treeNum);
				YAHOO.util.Event.stopEvent(e);
				return;
			}
		}
		
		var stop = true;
		switch (charCode) {
			case 32: // spacebar
				if (e.shiftKey) {
					this.back();
				} else {
					this.forward();
				}
				break;
			case 39: // right
				if (e.shiftKey) {
					this.forward(); this.forward();
					this.forward(); this.forward();
					this.forward(); this.forward();
					this.forward(); this.forward();
					this.forward(); this.forward();
				} else {
					this.forward();
				}
				break;
			case 37: // left
				if (e.shiftKey) {
					this.back(); this.back();
					this.back(); this.back();
					this.back(); this.back();
					this.back(); this.back();
					this.back(); this.back();
				} else {
					this.back();
				}
				break;
			case 40: // down
				this.last();
				break;
			case 38: // up
				this.first();
				break;
			case 192: // backtick/tilde
				this.pass();
				break;
			default:
				stop = false;
				break;
		}
		if (stop) {
			YAHOO.util.Event.stopEvent(e);
		}
	},
	
	showInfo: function() {
		var gameInfo = this.gameTree.trees.first().nodes.first();//this.cursor.node;
		var dl = document.createElement('dl');
		for (var propName in this.infoLabels) {
			if (gameInfo[propName]) {
				if (propName == "PW") {
					this.dom.playerW.name.innerHTML = gameInfo[propName] +
						(gameInfo['WR'] ? ", " + gameInfo['WR'] : "");
					continue;
				} else if (propName == "PB") {
					this.dom.playerB.name.innerHTML = gameInfo[propName] +
						(gameInfo['BR'] ? ", " + gameInfo['BR'] : "");
					continue;
				}
				if (propName == "WR" || propName == "BR") {
					continue;
				}
				if (propName == "DT") {
					var dateParts = gameInfo[propName].split(/[\.-]/);
					gameInfo[propName] = dateParts[2].replace(/^0+/, "") + " "
						+ this.months[dateParts[1]-1] + " " + dateParts[0];
				}
				var dt = document.createElement('dt');
				dt.innerHTML = this.infoLabels[propName] + ':';
				var dd = document.createElement('dd');
				dd.innerHTML = gameInfo[propName];
				dl.appendChild(dt);
				dl.appendChild(dd);
			}
		}
		if (this.prefs.showGameInfo) {
			this.dom.infoGame.appendChild(dl);
		}
	},
	
	updateControls: function() {
		if (this.moveNumber) {
			this.dom.moveNumber.innerHTML = "move " + this.moveNumber;
		} else {
			this.dom.moveNumber.innerHTML = "";
		}
		
		this.dom.playerW.captures.innerHTML = "Captures: <span>" + this.board.captures.W + "</span>";
		this.dom.playerB.captures.innerHTML = "Captures: <span>" + this.board.captures.B + "</span>";
		
		YAHOO.util.Dom.removeClass(this.dom.controls.pass, "pass-on");
		
		// variations?
		this.dom.variations.innerHTML = "";
		for (var i = 0; i < this.variations.length; i++) {
			var varLabel = i + 1;
			if (!this.variations[i].move || this.variations[i].move == "tt") {
				// 'pass' variation
				YAHOO.util.Dom.addClass(this.dom.controls.pass, "pass-on");
			} else {
				// show clickable variation on the board
				var varPt = this.sgfCoordToPoint(this.variations[i].move);
				if (this.board.getMarker(varPt) != this.board.EMPTY) {
					varLabel = this.board.getMarker(varPt);
				}
				if (this.prefs.markVariations) {
					this.board.addMarker(varPt, "var:" + varLabel);
				}
			}
			// show variation under controls
			var varNav = document.createElement("div");
			varNav.className = "variation-nav";
			varNav.innerHTML = varLabel;
			YAHOO.util.Event.on(
				varNav,
				"click",
				function(e, arg) {
					arg.me.variation(arg.treeNum);
				},
				{me: this, treeNum: this.variations[i].treeNum}
			);
			this.dom.variations.appendChild(varNav);
		}
		if (!this.variations.length) {
			this.dom.variations.innerHTML = "<div class='variation-nav none'>none</div>";
		}
		
		if (this.cursor.hasNext()) {
			YAHOO.util.Dom.addClass(this.dom.controls.forward, "forward-on");
			YAHOO.util.Dom.addClass(this.dom.controls.last, "last-on");
		} else {
			YAHOO.util.Dom.removeClass(this.dom.controls.forward, "forward-on");
			YAHOO.util.Dom.removeClass(this.dom.controls.last, "last-on");
		}
		if (this.cursor.hasPrevious()) {
			YAHOO.util.Dom.addClass(this.dom.controls.back, "back-on");
			YAHOO.util.Dom.addClass(this.dom.controls.first, "first-on");
		} else {
			YAHOO.util.Dom.removeClass(this.dom.controls.back, "back-on");
			YAHOO.util.Dom.removeClass(this.dom.controls.first, "first-on");
		}
		
		var domWidth = this.dom.slider.offsetWidth -
				this.dom.sliderThumb.offsetWidth;
		this.sliderIgnore = true;
		this.slider.setValue(this.moveNumber / this.totalMoves * domWidth);
		this.sliderIgnore = false;
	},
	
	toggleCurrentColor: function() {
		this.currentColor == "B" ? "W": "B";
	},
	
	playMove: function(coord, color, noRender) {
		this.toggleCurrentColor();
		this.moveNumber++;
		if (coord && coord != "tt") {
			var pt = this.sgfCoordToPoint(coord);
			color = color == "W" ? this.board.WHITE : this.board.BLACK;
			this.board.addStone(pt, color);
			this.rules.apply(pt, color);
			if (this.prefs.markCurrent) {
				this.addMarker(coord, "current");
			}
		} else if (!noRender) {
			this.dom.comments.innerHTML = "<div class='comment-pass'>" +
				(color == "W" ? "White" : "Black") + " passed</div>" +
				this.dom.comments.innerHTML;
		}
	},
	
	addStone: function(coord, color) {
		if (!(coord instanceof Array)) {
			coord = [coord];
		}
		for (var i = 0; i < coord.length; i++) {
			this.board.addStone(
				this.sgfCoordToPoint(coord[i]),
				color == "AW" ? this.board.WHITE :
				color == "AB" ? this.board.BLACK : this.board.EMPTY
			);
		}
	},
	
	addMarker: function(coord, type) {
		if (!(coord instanceof Array)) {
			coord = [coord];
		}
		var label;
		for (var i = 0; i < coord.length; i++) {
			switch (type) {
				case "TR": label = "triangle"; break;
				case "SQ": label = "square"; break;
				case "CR": label = "circle"; break;
				case "MA": label = "ex"; break;
				case "TW": label = "territory-white"; break;
				case "TB": label = "territory-black"; break;
				case "LB": label = (coord[i].split(":"))[1]; coord[i]; break;
				default: label = type; break;
			}
			this.board.addMarker(
				this.sgfCoordToPoint((coord[i].split(":"))[0]),
				label
			);
		}
	},
	
	showComments: function(comments, junk, noRender) {
		if (!comments || noRender) return;
		this.dom.comments.innerHTML += comments.replace(/\n/g, "<br />");
	},
	
	constructDom: function() {

		YAHOO.ext.DomHelper.append(
			this.dom.container,
			{tag: 'div', id: 'player-' + this.uniq, cls: 'eidogo-player', children: [
				{tag: 'div', id: 'controls-container-' + this.uniq, cls: 'controls-container', children: [
					{tag: 'ul', id: 'controls-' + this.uniq, cls: 'controls', children: [
						{tag: 'li', id: 'control-first-' + this.uniq, cls: 'control first', html: 'First'},
						{tag: 'li', id: 'control-back-' + this.uniq, cls: 'control back', html: 'Back'},
						{tag: 'li', id: 'control-forward-' + this.uniq, cls: 'control forward', html: 'Forward'},
						{tag: 'li', id: 'control-last-' + this.uniq, cls: 'control last', html: 'Last'},
						{tag: 'li', id: 'control-pass-' + this.uniq, cls: 'control pass', html: 'Pass'}					
					]},
					{tag: 'div', id: 'move-number-' + this.uniq, cls: 'move-number'},
					{tag: 'div', id: 'nav-slider-' + this.uniq, cls: 'nav-slider', children: [
						{tag: 'div', id: 'nav-slider-thumb-' + this.uniq, cls: 'nav-slider-thumb'}
					]},
					{tag: 'div', id: 'variations-container-' + this.uniq, cls: 'variations-container', children: [
						{tag: 'div', id: 'variations-label' + this.uniq, cls: 'variations-label', html: "Variations: "},
						{tag: 'div', id: 'variations-' + this.uniq, cls: 'variations'}
					]}
				]},
				{tag: 'div', id: 'comments-' + this.uniq, cls: 'comments'},
				{tag: 'div', id: 'board-container-' + this.uniq, cls: 'board-container'},
				{tag: 'div', id: 'info-' + this.uniq, cls: 'info', children: [
					{tag: 'div', id: 'info-players-' + this.uniq, cls: 'players', children: [
						{tag: 'div', id: 'white-' + this.uniq, cls: 'player white', children: [
							{tag: 'div', id: 'white-name-' + this.uniq, cls: 'name'},
							{tag: 'div', id: 'white-captures-' + this.uniq, cls: 'captures'},
							{tag: 'div', id: 'white-time-' + this.uniq, cls: 'time'}
						]},
						{tag: 'div', id: 'white-' + this.uniq, cls: 'player black', children: [
							{tag: 'div', id: 'black-name-' + this.uniq, cls: 'name'},
							{tag: 'div', id: 'black-captures-' + this.uniq, cls: 'captures'},
							{tag: 'div', id: 'black-time-' + this.uniq, cls: 'time'}
						]}
					]},
					{tag: 'div', id: 'info-game-' + this.uniq, cls: 'game'}
				]}
			]}
		);
		this.dom.player = document.getElementById('player-' + this.uniq);
		this.dom.comments = document.getElementById('comments-' + this.uniq);
		this.dom.info = document.getElementById('info-' + this.uniq);
		this.dom.infoGame = document.getElementById('info-game-' + this.uniq);
		this.dom.infoPlayers = document.getElementById('info-players-' + this.uniq);
		
		this.dom.playerW = {};
		this.dom.playerW.name = document.getElementById('white-name-' + this.uniq);
		this.dom.playerW.captures = document.getElementById('white-captures-' + this.uniq);
		this.dom.playerW.time = document.getElementById('white-time-' + this.uniq);
		
		this.dom.playerB = {};
		this.dom.playerB.name = document.getElementById('black-name-' + this.uniq);
		this.dom.playerB.captures = document.getElementById('black-captures-' + this.uniq);
		this.dom.playerB.time = document.getElementById('black-time-' + this.uniq);
		
		this.dom.moveNumber = document.getElementById('move-number-' + this.uniq);
		YAHOO.util.Event.on(this.dom.moveNumber, 'click', this.setPermalink, this, true);
		
		this.dom.variations = document.getElementById('variations-' + this.uniq);
		
		this.dom.controls = {};
		
		this.dom.controls.first = document.getElementById('control-first-' + this.uniq);
		YAHOO.util.Event.on(this.dom.controls.first, 'click', this.first, this, true);
		
		this.dom.controls.back = document.getElementById('control-back-' + this.uniq);
		YAHOO.util.Event.on(this.dom.controls.back, 'click', this.back, this, true);
		
		this.dom.controls.forward = document.getElementById('control-forward-' + this.uniq);
		YAHOO.util.Event.on(this.dom.controls.forward, 'click', this.forward, this, true);
		
		this.dom.controls.last = document.getElementById('control-last-' + this.uniq);
		YAHOO.util.Event.on(this.dom.controls.last, 'click', this.last, this, true);
		
		this.dom.controls.pass = document.getElementById('control-pass-' + this.uniq);
		YAHOO.util.Event.on(this.dom.controls.pass, 'click', this.pass, this, true);
		
		this.dom.slider = document.getElementById('nav-slider-' + this.uniq);
		this.dom.sliderThumb = document.getElementById('nav-slider-thumb-' + this.uniq);
	},
	
	enableNavSlider: function() {
		if (!this.progressiveLoad) {
			this.dom.slider.style.display = "block";
		}
		this.slider = YAHOO.widget.Slider.getHorizSlider(this.dom.slider.id, this.dom.sliderThumb.id, 0, 300);
		this.slider.animate = false;
		this.slider.enableKeys = false;
		
		this.slider.subscribe("change", function(offset) {
			if (this.sliderIgnore) return;
			var domWidth = this.dom.slider.offsetWidth -
					this.dom.sliderThumb.offsetWidth;
			this.sliderOffset = parseInt(offset / domWidth * this.totalMoves);
		}, null, this);
		this.slider.subscribe("slideEnd", function() {
			if (this.sliderIgnore) return;
			if (this.totalMoves) {
				var delta = this.sliderOffset - this.moveNumber;
				for (var i = 0; i < Math.abs(delta); i++) {
					if (delta > 0) {
						this.variation(null, true);
					} else if (delta < 0) {
						this.cursor.previous();
						this.moveNumber--;
					}
				}
				if (delta < 0) {
					if (this.moveNumber < 0) this.moveNumber = 0;
					this.board.revert(Math.abs(delta));
				}
				this.refresh();
			}
		}, null, this);
	},
	
	sgfCoordToPoint: function(coord) {
		if (!coord || coord == "tt") return {x: null, y: null};
		var sgfCoords = {
			a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9,
			k: 10,l: 11, m: 12, n: 13, o: 14, p: 15, q: 16, r: 17, s: 18
		};
		return {
			x: sgfCoords[coord.charAt(0)],
			y: sgfCoords[coord.charAt(1)]
		};
	},
	
	setPermalink: function() {
		// Safari doesn't need the pound sign
		var prefix = /Apple/.test(navigator.vendor) ? "" : "#";
		location.hash = prefix + this.cursor.getPath().join(",");
	},
	
	nowLoading: function() {
		if (this.croaked) return;
		if (document.getElementById('eidogo-loading-' + this.uniq)) return;
		this.domLoading = document.createElement('div');
		this.domLoading.id = "eidogo-loading-" + this.uniq;
		this.domLoading.className = "eidogo-loading";
		this.domLoading.innerHTML = "Loading...";
		this.dom.player.appendChild(this.domLoading);
	},
	
	doneLoading: function() {
		if (this.domLoading && this.domLoading != null && this.domLoading.parentNode) {
			this.domLoading.parentNode.removeChild(this.domLoading);
			this.domLoading = null;
		}
	},
	
	croak: function(msg) {
		this.doneLoading();
		YAHOO.ext.DomHelper.append(
			this.dom.player,
			{tag: 'div', cls: 'eidogo-error', html: msg.replace(/\n/g, "<br />")}
		);
		this.croaked = true;
	}
};
