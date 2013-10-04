/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * This file contains the meat of EidoGo.
 */
var NS = Y.namespace('Eidogo');

// shortcuts (local only to this file)
var t = NS.resources;
alert(JSON.stringify(t));

/**
 * @class Player is the overarching control structure that allows you to
 * load and replay games. It's a "player" in the sense of a DVD player, not
 * a person who plays a game.
 */
NS.Player = function (cfg) {
    NS.Player.superclass.constructor.apply(this,arguments);

    cfg = cfg || {};
    
    // play, add_b, add_w, region, tr, sq, cr, label, number, score(?)
    this.mode = cfg.mode ? cfg.mode : "play";
    
    // URL path to SGF files
    this.sgfPath = cfg.sgfPath;

    //domContainer
    this.srcNode = Y.one(cfg.srcNode) || "body";

    this.renderer = cfg.renderer;
    
    // pattern and game info search
    this.searchUrl = cfg.searchUrl;
    this.showingSearch = false;
    
    // save to file
    this.saveUrl = cfg.saveUrl;
    
    // url to handle downloads
    this.downloadUrl = cfg.downloadUrl;
    
    // handlers for the various types of GameNode properties
    this.propertyHandlers = {
	W:  this.playMove,
	B:  this.playMove,
	KO: this.playMove,
	MN: this.setMoveNumber,
	AW: this.addStone,
	AB: this.addStone,
	AE: this.addStone,
	CR: this.addMarker, // circle
	LB: this.addMarker, // label
	TR: this.addMarker, // triangle
	MA: this.addMarker, // X
	SQ: this.addMarker, // square
	TW: this.addMarker,
	TB: this.addMarker,
	DD: this.addMarker,
	PL: this.setColor,
	C:  this.showComments,
	N:  this.showAnnotation,
	GB: this.showAnnotation,
	GW: this.showAnnotation,
	DM: this.showAnnotation,
	HO: this.showAnnotation,
	UC: this.showAnnotation,
	V:  this.showAnnotation,
	BM: this.showAnnotation,
	DO: this.showAnnotation,
	IT: this.showAnnotation,
	TE: this.showAnnotation,
	BL: this.showTime,
	OB: this.showTime,
	WL: this.showTime,
	OW: this.showTime
    };
    
    this.infoLabels = {
	GN: t['game'],
	PW: t['white'],
	WR: t['white rank'],
	WT: t['white team'],
	PB: t['black'],
	BR: t['black rank'],
	BT: t['black team'],
	HA: t['handicap'],
	KM: t['komi'],
	RE: t['result'],
	DT: t['date'],
	GC: t['info'],
	PC: t['place'],
	EV: t['event'],
	RO: t['round'],
	OT: t['overtime'],
	ON: t['opening'],
	RU: t['ruleset'],
	AN: t['annotator'],
	CP: t['copyright'],
	SO: t['source'],
	TM: t['time limit'],
	US: t['transcriber'],
	AP: t['created with']
	// FF, GM, TM
    };

    // UI theme
    this.theme = cfg.theme;
    
    // initialize per-game settings
    this.reset(cfg);
    
    // custom renderer?
    this.renderer = cfg.renderer;
    
    // crop settings
    this.cropParams = null;
    this.shrinkToFit = cfg.shrinkToFit;
    if (this.shrinkToFit || cfg.cropWidth || cfg.cropHeight) {
	this.cropParams = {};
	this.cropParams.width = cfg.cropWidth;
	this.cropParams.height = cfg.cropHeight;
	this.cropParams.left = cfg.cropLeft;
	this.cropParams.top = cfg.cropTop;
	this.cropParams.padding = cfg.cropPadding || 1;
    }
    
    //TODO: Readd this if we add selection regions back.
    //Y.one(document).on('mouseUp', this.handleDocMouseUp, this);
    
    if (cfg.sgf || cfg.sgfUrl || (cfg.sgfPath && cfg.gameName)) {
	this.loadSgf(cfg);
    }
    
    this.fire('initDone', {});
}

NS.Player.NAME = 'eidogo-player';

NS.Player.ATTRS = {
    //name: {value: ..};
};

Y.extend(NS.Player, Y.Base, {
    /**
     * Inits settings that are persistent among games
     * @constructor
     * @param {Object} cfg A hash of configuration values
     */
    init: function(cfg) {
    },
    
    /**
     * Resets settings that can change per game
     **/
    reset: function(cfg) {
        this.gameName = "";
        
        // Multiple games can be contained in collectionRoot. We default
        // to the first (collectionRoot._children[0])
        // See http://www.red-bean.com/sgf/sgf4.html 
        this.collectionRoot = new NS.GameNode();
        this.cursor = new NS.GameCursor();
	
        // gnugo/computer opponent
        this.opponentUrl = null;
        this.opponentColor = null;
        this.opponentLevel = null;
        
        // these are populated after load
        this.board = null;
        this.rules = null;
        this.currentColor = null;
        this.moveNumber = null;
        this.totalMoves = null;
        this.variations = null;
        this.timeB = "";
        this.timeW = "";
	
        // region selection state
        this.regionTop = null;
        this.regionLeft = null;
        this.regionWidth = null;
        this.regionHeight = null;
        this.regionBegun = null;
        this.regionClickSelect = null;
	
        // mouse clicking/dragging state
        this.mouseDown = null;
        this.mouseDownX = null;
        this.mouseDownY = null;
        this.mouseDownClickX = null;
        this.mouseDownClickY = null;
	
        // for the letter and number tools
        this.labelLastLetter = null;
        this.labelLastNumber = null;
        this.resetLastLabels();
        
        // so we know when permalinks and downloads are unreliable
        this.unsavedChanges = false;
        
        // to know when to update the nav tree
        this.updatedNavTree = false;
        this.navTreeTimeout = null;
        
        // whether we're currently searching or editing
        this.searching = false;
        this.editingText = false;
        this.goingBack = false;
        
        // problem-solving mode: respond when the user plays a move
        this.problemMode = cfg.problemMode;
        this.problemColor = cfg.problemColor;
    },
    
    /**
     * Load an SGF file or start from a blank board
     **/
    loadSgf: function(cfg, completeFn) {
        cfg = cfg || {};
        
        this.reset(cfg);
        
        // URL path to SGF files
        this.sgfPath = cfg.sgfPath || this.sgfPath;
	
        // Load the first node of the first node by default
        this.loadPath = cfg.loadPath && cfg.loadPath.length > 1 ?
	    cfg.loadPath : [0, 0];
	
        // game name (= file name) of the game to load
        this.gameName = cfg.gameName || "";
        
        // For calling completeFn asynchronously
        var noCb = false;
        
        if (typeof cfg.sgf == "string") {
	    
	    // raw SGF data
	    var sgf = new NS.SgfParser(cfg.sgf);
	    this.load(sgf.root);
	    
        } else if (typeof cfg.sgf == "object") {
	    
	    // already-parsed JSON game tree
	    this.load(cfg.sgf);

        } else if (typeof cfg.sgfUrl == "string" || this.gameName) {
	    
	    // the URL can be provided as a single sgfUrl or as sgfPath + gameName
	    if (!cfg.sgfUrl) {
                cfg.sgfUrl = this.sgfPath + this.gameName + ".sgf";
	    }
	    
	    // load data from a URL
	    this.remoteLoad(cfg.sgfUrl, null, false, null, completeFn);
	    noCb = true;
	    
	    
        } else {
	    
	    // start from scratch
	    var boardSize = cfg.boardSize || "19";
	    var komiMap = {19: 6.5, 13: 4.5, 9: 3.5, 7: 2.5};
	    var blankGame = {_children: [{
                SZ: boardSize,
                KM: cfg.komi || komiMap[boardSize] || 6.5,
                _children: []}]};
	    
	    // AI opponent (e.g. GNU Go)
	    if (cfg.opponentUrl) {
                this.gameName = "gnugo";
                this.opponentUrl = cfg.opponentUrl;
                this.opponentColor = cfg.opponentColor == "B" ? cfg.opponentColor : "W";
                this.opponentLevel = cfg.opponentLevel || 7;
                var root = blankGame._children[0];
                root.PW = this.opponentColor == "B" ? t['you'] : "GNU Go";
                root.PB = this.opponentColor == "B" ? "GNU Go" : t['you'];
                root.HA = parseInt(cfg.handicap, 10) || 0;
                if (root.HA) {
		    var handiCoords = {
                        19: [['pd', 'dp'],
			     ['pd', 'dp', 'pp'],
			     ['pd', 'dp', 'pp', 'dd'],
			     ['pd', 'dp', 'pp', 'dd', 'jj'],
			     ['pd', 'dp', 'pp', 'dd', 'dj', 'pj'],
			     ['pd', 'dp', 'pp', 'dd', 'dj', 'pj', 'jj'],
			     ['pd', 'dp', 'pp', 'dd', 'dj', 'pj', 'jd', 'jp'],
			     ['pd', 'dp', 'pp', 'dd', 'dj', 'pj', 'jd', 'jp', 'jj']],
                        13: [['jd', 'dj'],
			     ['jd', 'dj', 'jj'],
			     ['jd', 'dj', 'jj', 'dd'],
			     ['jd', 'dj', 'jj', 'dd', 'gg'],
			     ['jd', 'dj', 'jj', 'dd', 'dg', 'jg'],
			     ['jd', 'dj', 'jj', 'dd', 'dg', 'jg', 'gg'],
			     ['jd', 'dj', 'jj', 'dd', 'dg', 'jg', 'gd', 'gj'],
			     ['jd', 'dj', 'jj', 'dd', 'dg', 'jg', 'gd', 'gj', 'gg']],
                        9: [['cg', 'gc'],
			    ['cg', 'gc', 'gg'],
			    ['cg', 'gc', 'gg', 'cc'],
			    ['cg', 'gc', 'gg', 'cc', 'ee'],
			    ['cg', 'gc', 'gg', 'cc', 'ce', 'ge'],
			    ['cg', 'gc', 'gg', 'cc', 'ce', 'ge', 'ee'],
			    ['cg', 'gc', 'gg', 'cc', 'ce', 'ge', 'ec', 'eg'],
			    ['cg', 'gc', 'gg', 'cc', 'ce', 'ge', 'ec', 'eg', 'ee']]};
		    root.KM = 0.5;
		    if (root.HA > 1) {
                        root.AB = handiCoords[boardSize][root.HA-2];
		    }
                }
	    }
	    
	    this.load(blankGame);
        }
        if (!noCb && typeof completeFn == "function") {
	    completeFn();
        }
    },
    
    /**
     * Loads game data into a given target. If no target is given, creates
     * a new gameRoot and initializes the game.
     **/
    load: function(data, target) {
        var newGame = false;
        if (!target) {
	    // load from scratch
	    target = new NS.GameNode();
	    this.collectionRoot = target;
        }
        target.loadJson(data);
        target._cached = true;
        this.doneLoading();
        if (!target._parent) {
	    // Loading into tree root; use the first game by default or
	    // other if specified
	    var gameIndex = this.loadPath.length ? parseInt(this.loadPath[0], 10) : 0;
	    this.initGame(target._children[gameIndex || 0]);
	    newGame = true;
        }
        
        if (this.loadPath.length) {
	    this.goTo(this.loadPath, newGame);
        } else {
	    this.refresh();
        }
        
        // find out which color to play as for problem mode
        if (newGame && this.problemMode) {
	    if (!this.problemColor)
                this.currentColor = this.problemColor = (this.cursor.getNextColor() || "B");
	    else
                this.currentColor = this.problemColor;
        }
    },

    /**
     * Load game data given as raw SGF or JSON from a URL within the same
     * domain.
     * @param {string} url URL to load game data from
     * @param {GameNode} target inserts data into this node if given
     * @param {boolean} useSgfPath if true, prepends sgfPath to url
     * @param {Array} loadPath GameNode path to load
     **/
    remoteLoad: function(url, target, useSgfPath, loadPath, completeFn) {
        useSgfPath = useSgfPath == "undefined" ? true : useSgfPath;
        
        completeFn = (typeof completeFn == "function") ? completeFn : null;
        
        if (useSgfPath) {
	    if (!target) {
                this.gameName = url;
	    }
	    // if we're using sgfPath, assume url does not include .sgf extension
	    url = this.sgfPath + url + ".sgf";
        }
        
        if (loadPath) {
	    this.loadPath = loadPath;
        }
        
        var success = function(id, req) {
	    var data = req.responseText.replace(/^( |\t|\r|\n)*/, "");
	    // infer the kind of file we got
	    if (data.charAt(0) == '(') {
                // SGF
                var me = this;
                var sgf = new NS.SgfParser(data, function() {
		    // parsing is asychronous
		    me.load(this.root, target);
		    completeFn && completeFn();
                });
	    } else if (data.charAt(0) == '{') {
                // JSON
                data = eval("(" + data + ")");
                this.load(data, target);
                completeFn && completeFn();
	    } else {
                this.croak(t['invalid data']);
	    }
        }
	
        var failure = function(id, req) {
	    this.croak(t['error retrieving']);
        }
        
	Y.io(url, {
	    method: 'GET',
	    on: {
		success: success,
		failure: failure
	    },
	    context: this
	});
    },

    /**
     * Sets up a new game for playing. Can be called repeatedly (e.g., for
     * dynamically-loaded games).
     **/
    initGame: function(gameRoot) {
        gameRoot = gameRoot || {};
        this.handleDisplayPrefs();
        var size = gameRoot.SZ || 19;
        // Only three sizes supported for now
        if (size != 7 && size != 9 && size != 13 && size != 19)
	    size = 19;
        if (this.shrinkToFit)
	    this.calcShrinkToFit(gameRoot, size);
        else if (this.problemMode && !this.cropParams) {
	    this.cropParams = {
                width: size,
                height: size,
                top: 0,
                left: 0,
                padding: 1};
        }
        if (!this.board) {
	    // first time
	    this.createBoard(size);
	    this.rules = new NS.Rules(this.board);
        }
        this.unsavedChanges = false;
        this.resetCursor(true);
        this.totalMoves = 0;
        var moveCursor = new NS.GameCursor(this.cursor.node);
        while (moveCursor.next()) { this.totalMoves++; }
        this.totalMoves--;
        this.showGameInfo(gameRoot);
        this.enableNavSlider();
        this.selectTool(this.mode == "view" ? "view" : "play");
        this.fire('initGame', {});
    },

    /**
     * Create our board. This can be called multiple times.
     **/
    createBoard: function(size) {
        size = size || 19;
        if (this.board && this.board.renderer && this.board.boardSize == size) return;
        try {
	    var rendererProto;
	    if( typeof this.renderer != "function" )
		rendererProto = this.renderer;
	    
	    //TODO: Fix this crap
	    this.renderer = new rendererProto(this.srcNode, size, this, this.cropParams);
	    this.board = new NS.Board(this.renderer, size);
        } catch (e) {	
            this.croak(t['error board']);
            return;
        }
    },
    
    /**
     * Calculates the crop area to use based on the widest distance between
     * stones and markers in the given game. We're conservative with respect
     * to checking markers: only labels for now.
     **/
    calcShrinkToFit: function(gameRoot, size) {
        // leftmost, topmost, rightmost, bottommost
        var l = null, t = null, r = null, b = null;
        var points = {};
        var me = this;
        // find all points occupied by stones or labels
        gameRoot.walk(function(node) {
	    var prop, i, coord;
	    for (prop in node) {
                if (/^(W|B|AW|AB|LB)$/.test(prop)) {
		    coord = node[prop];
		    if (!(coord instanceof Array)) coord = [coord];
		    if (prop != 'LB') coord = me.expandCompressedPoints(coord);
		    else coord = [coord[0].split(/:/)[0]];
		    for (i = 0; i < coord.length; i++)
                        points[coord[i]] = "";
                }
	    }
        });
        // nab the outermost points
        for (var key in points) {
	    var pt = this.sgfCoordToPoint(key);
	    if (l == null || pt.x < l) l = pt.x;
	    if (r == null || pt.x > r) r = pt.x;
	    if (t == null || pt.y < t) t = pt.y;
	    if (b == null || pt.y > b) b = pt.y;
        }
        this.cropParams.width = r - l + 1;
        this.cropParams.height = b - t + 1;
        this.cropParams.left = l;
        this.cropParams.top = t;
        // add padding
        var pad = this.cropParams.padding;
        for (var lpad = pad; l - lpad < 0; lpad--) {};
        if (lpad) { this.cropParams.width += lpad; this.cropParams.left -= lpad; }
        for (var tpad = pad; t - tpad < 0; tpad--) {};
        if (tpad) { this.cropParams.height += tpad; this.cropParams.top -= tpad; }
        for (var rpad = pad; r + rpad > size; rpad--) {};
        if (rpad) { this.cropParams.width += rpad; }
        for (var bpad = pad; b + bpad > size; bpad--) {};
        if (bpad) { this.cropParams.height += bpad; }
    },

    /**
     * Fetches a move from an external opponent -- e.g., GnuGo. Provides
     * serialized game data as SGF, the color to move as, and the size of
     * the board. Expects the response to be the SGF coordinate of the
     * move to play.
     **/
    fetchOpponentMove: function() {
        this.nowLoading(t['gnugo thinking']);
        var success = function(req) {
	    this.doneLoading();
	    this.createMove(req.responseText);
        }
        var failure = function(req) {
	    this.croak(t['error retrieving']);
        }
        var root = this.cursor.getGameRoot();
        var params = {
	    sgf: root.toSgf(),
	    move: this.currentColor,
	    size: root.SZ,
	    level: this.opponentLevel
        };
        ajax('post', this.opponentUrl, params, success, failure, this, 45000);  
    },
    
    /**
     * Respond to a move made in problem-solving mode
     **/
    playProblemResponse: function(noRender) {
        // short delay before playing
        setTimeout(function() {
	    this.variation(null, noRender);
	    this.fire('playProblemResponse', {});
	    
	    if (!this.cursor.hasNext()) {
                // not sure if it's safe to say "WRONG" -- that would work for
                // goproblems.com SGFs but I don't know about others
                this.prependComment(t['end of variation']);
	    }
        }.bind(this), 200);
    },
    
    /**
     * Navigates to a location within the game.
     **/
    goTo: function(path, fromStart) {
        fromStart = typeof fromStart != "undefined" ? fromStart : true;
        
        if (fromStart && path.length > 1 && path[0] != this.cursor.getGameRoot().getPosition())
	    this.updatedNavTree = false;
        
        if (fromStart)
	    this.resetCursor(true);
        
        // Move number
        var steps = parseInt(path, 10);
        if (!(path instanceof Array) && !isNaN(steps)) {
	    if (fromStart) steps++; // not zero-based
	    for (var i = 0; i < steps; i++)
                this.variation(null, true);
	    this.refresh();
	    return;
        }
        
        // Not a path?
        if (!(path instanceof Array) || !path.length) {
	    alert(t['bad path'] + " " + path);
	    return;
        }

        var position;
        var vars;
        
        // Path of moves (SGF coords)
        if (isNaN(parseInt(path[0], 10))) {
	    if (!this.cursor.node._parent)
                this.variation(0, true); // first game tree is assumed
	    while (path.length) {
                position = path.shift();
                vars = this.getVariations();
                for (var i = 0; i < vars.length; i++) {
		    if (vars[i].move == position) {
                        this.variation(vars[i].varNum, true);
                        break;
		    }
                }
	    }
	    this.refresh();
	    return;
        }
        
        // Path of branch indexes and final move number
        var first = true;
        while (path.length) {
	    position = parseInt(path.shift(), 10);
	    if (!path.length) {
                for (var i = 0; i < position; i++)
		    this.variation(0, true);
	    } else if (path.length) {
                if (!first && fromStart)
		    while (this.cursor.node._children.length == 1)
                        this.variation(0, true);
                this.variation(position, true);
	    }
	    first = false;
        }
        this.refresh();
    },

    /**
     * Resets the game cursor to the first node
     **/
    resetCursor: function(noRender, toGameRoot) {
        this.board.reset();
        this.resetCurrentColor();
        if (toGameRoot) {
	    this.cursor.node = this.cursor.getGameRoot();
        } else {
	    this.cursor.node = this.collectionRoot;
        }
        this.refresh(noRender);
    },
    
    /**
     * Resets the current color as appropriate
     **/
    resetCurrentColor: function() {
        this.currentColor = (this.problemMode ? this.problemColor : "B");
        var root = this.cursor.getGameRoot();
        if (root && root.HA > 1)
	    this.currentColor = 'W';
    },

    /**
     * Refresh the current node
     **/
    refresh: function(noRender) {
        this.board.revert(1);
        this.execNode(noRender);
    },

    /**
     * Handles going the next sibling or variation
     * @param {Number} varNum Variation number to follow
     * @param {Boolean} noRender If true, don't render the board
     */
    variation: function(varNum, noRender) {
        if (this.cursor.next(varNum)) {
	    this.execNode(noRender);
	    this.resetLastLabels();
	    return true;
        }
        return false;
    },

    /**
     * Delegates the work of putting down stones etc to various handler
     * functions. Also resets some settings and makes sure the interface
     * gets updated.
     * @param {Boolean} noRender If true, don't render the board
     * @param {Boolean} ignoreProgressive Ignores progressive loading
     *      considerations.
     */
    execNode: function(noRender) {
        
        if (!this.cursor.node) return;
	
        if (!noRender) {
	    this.board.clearMarkers();
	    this.moveNumber = this.cursor.getMoveNumber();
        }
	
        if (this.moveNumber < 1) {
	    this.resetCurrentColor();
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
	    // let the opponent move
	    if (this.opponentUrl && this.opponentColor == this.currentColor
                && this.moveNumber == this.totalMoves) {
                this.fetchOpponentMove();
	    }
	    this.findVariations();
	    this.updateControls();
	    this.board.commit();
	    this.board.render();
        }
        
        // play a reponse in problem-solving mode, unless we just navigated backwards
        if (this.problemMode && this.currentColor && this.currentColor != this.problemColor && !this.goingBack)
	    this.playProblemResponse(noRender);
        
        this.goingBack = false;
    },

    /**
     * Locates any variations within the current node and makes note of their
     * move and index position
     */
    findVariations: function() {
        this.variations = this.getVariations();
    },
    
    getVariations: function() {
        var vars = [],
        kids = this.cursor.node._children;
        for (var i = 0; i < kids.length; i++) {
	    vars.push({move: kids[i].getMove(), varNum: i});
        }
        return vars;
    },

    back: function(e, obj, noRender) {
        if (this.cursor.previous()) {
	    this.board.revert(1);
	    this.goingBack = true;
	    this.refresh(noRender);
	    this.resetLastLabels();
        }
    },

    forward: function(e, obj, noRender) {
        this.variation(null, noRender);
    },

    first: function() {
        if (!this.cursor.hasPrevious()) return;
        this.resetCursor(false, true);
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
                this.variation(this.variations[i].varNum);
                return;
	    }
        }
        this.createMove('tt');
    },

    /**
     * Handle a mouse-down event on a particular point. This function gets
     * called by the board renderer, which handles the actual browser event
     * attachment (or Flash event handling, or whatever) and passes along
     * the appropriate board coordinate.
     **/
    handleBoardMouseDown: function(x, y, cx, cy, e) {
        if (!this.boundsCheck(x, y, [0, this.board.boardSize-1])) return;
        this.mouseDown = true;
        this.mouseDownX = x;
        this.mouseDownY = y;
        this.mouseDownClickX = cx;
        this.mouseDownClickY = cy;
        // begin region selection
        if (this.mode == "region" && x >= 0 && y >= 0 && !this.regionBegun) {
	    this.regionTop = y;
	    this.regionLeft = x;
	    this.regionBegun = true;
        }
    },

    /**
     * Called by the board renderer upon hover, with appropriate coordinate
     **/
    handleBoardHover: function(x, y, cx, cy, e) {
        if (this.mouseDown || this.regionBegun) {
	    if (!this.boundsCheck(x, y, [0, this.board.boardSize-1])) return;
	    var boardDiff = (x != this.mouseDownX || y != this.mouseDownY);
	    var clickDiff = Math.abs(this.mouseDownClickX-cx) >= 19 ||
                Math.abs(this.mouseDownClickY-cy) >= 19;
	    if (this.searchUrl && !this.regionBegun && boardDiff && clickDiff) {
                // click and drag: implicit region select
                this.selectTool("region");
                this.regionBegun = true;
                this.regionTop = this.mouseDownY;
                this.regionLeft = this.mouseDownX;
	    }
	    if (this.regionBegun) {
                this.regionRight = x + (x >= this.regionLeft ? 1 : 0);
                this.regionBottom = y + (y >= this.regionTop ? 1 : 0);
                this.showRegion();
	    }
	    stopEvent(e);
        }
    },

    /**
     * Called by the board renderer upon mouse up, with appropriate coordinate
     **/
    handleBoardMouseUp: function(x, y, e) {
        this.mouseDown = false;
        
        var coord = this.pointToSgfCoord({x: x, y: y});
        
        // click on a variation?
        if (this.mode == "view" || this.mode == "play") {
	    for (var i = 0; i < this.variations.length; i++) {
                var varPt = this.sgfCoordToPoint(this.variations[i].move);
                if (varPt.x == x && varPt.y == y) {
		    this.variation(this.variations[i].varNum);
		    stopEvent(e);
		    return;
                }
	    }
        }
        
        if (this.mode == "view") {
	    // Jump to any moved played at the clicked coordinate
	    var root = this.cursor.getGameRoot(),
            path = [0, root.getPosition()],
            mn = 0,
            node = root._children[0];
	    while (node) {
                if (node.getMove() == coord) {
		    path.push(mn);
		    this.goTo(path);
		    break;
                }
                mn++;
                node = node._children[0];
	    }
	    return;
        }
        
        if (this.mode == "play") {
	    // can't click there?
	    if (!this.rules.check({x: x, y: y}, this.currentColor)) {
                return;
	    }
	    // play the move
	    if (coord) {
                var nextMoves = this.cursor.getNextMoves();
                if (nextMoves && coord in nextMoves) {
		    // move already exists
		    this.variation(nextMoves[coord]);
                } else {
		    // move doesn't exist yet
		    this.createMove(coord);
                }
	    }
        } else if (this.mode == "region" && x >= -1 && y >= -1 && this.regionBegun) {
	    if (this.regionTop == y && this.regionLeft == x && !this.regionClickSelect) {
                // allow two-click selection in addition to click-and-drag (for iphone!)
                this.regionClickSelect = true;
                this.regionRight = x + 1;
                this.regionBottom = y + 1;
                this.showRegion();
	    } else {
                // end of region selection
                this.regionBegun = false;
                this.regionClickSelect = false;
                this.regionBottom = (y < 0 ? 0 : (y >= this.board.boardSize) ?
				     y : y + (y > this.regionTop ? 1 : 0));
                this.regionRight = (x < 0 ? 0 :  (x >= this.board.boardSize) ?
				    x : x + (x > this.regionLeft ? 1 : 0));
                this.showRegion();
                stopEvent(e);
	    }
        } else {
	    // place black stone, white stone, labels
	    var prop;
	    var stone = this.board.getStone({x:x,y:y});
	    if (this.mode == "add_b" || this.mode == "add_w") {
                // if a stone was placed previously, we add an empty point (AE);
                // otherwise, we remove the stone property from the current node
                var deleted = this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
                if (stone != this.board.BLACK && this.mode == "add_b") {
		    prop = "AB";
                } else if (stone != this.board.WHITE && this.mode == "add_w") {
		    prop = "AW";
                } else if (this.board.getStone({x:x,y:y}) != this.board.EMPTY && !deleted) {
		    prop = "AE";
                }
	    } else {
                switch (this.mode) {
                case "tr": prop = "TR"; break;
                case "sq": prop = "SQ"; break;
                case "cr": prop = "CR"; break;
                case "x": prop = "MA"; break;
                case "dim": prop = "DD"; break;
                case "number":
                    prop = "LB";
                    coord = coord + ":" + this.labelLastNumber;
                    this.labelLastNumber++;
                    break;
                case "letter":
                    prop = "LB";
                    coord = coord + ":" + this.labelLastLetter;
                    this.labelLastLetter = String.fromCharCode(
                        this.labelLastLetter.charCodeAt(0)+1);
                    break;
                case "label":
                    prop = "LB";
                    //coord = coord + ":" + this.dom.labelInput.value;
                    break;
                case "clear":
                    this.cursor.node.deletePropertyValue(
                        ['TR', 'SQ', 'CR', 'MA', 'DD', 'LB'], new RegExp("^" + coord));
                    break;
                }
                if (this.cursor.node.hasPropertyValue(prop, coord)) {
		    this.cursor.node.deletePropertyValue(prop, coord);
		    prop = null;
                }
	    }
	    if (prop)
                this.cursor.node.pushProperty(prop, coord);
	    this.unsavedChanges = true;
	    var deleted = this.checkForEmptyNode();
	    this.refresh();
	    if (deleted) this.prependComment(t['position deleted']);
        }
    },
    
    /**
     * If there are no properties left in a node, ask whether to delete it
     **/
    checkForEmptyNode: function() {
        if (!Y.Object.keys(this.cursor.node.getProperties()).length()) {
	    var killNode = window.confirm(t['confirm delete']);
	    if (killNode) {
                var id = this.cursor.node._id;
                var index = 0;
                this.back();
                this.cursor.node._children = this.cursor.node._children.filter(function(node, i) {
		    if (node._id == id) {
                        index = i;
                        return false;
		    } else {
                        return true;
		    }
                });
                if (index && this.cursor.node._preferredChild == index)
		    this.cursor.node._preferredChild--;
                return true;
	    }
        }
        return false;
    },
    
    /**
     * Takes a pattern string like ...O...XX and converts it to .3O.3X2
     */
    compressPattern: function(pattern) {
        var c = null;
        var pc = "";
        var n = 1;
        var ret = "";
        for (var i = 0; i < pattern.length; i++) {
	    c = pattern.charAt(i);
	    if (c == pc) {
		n++;
	    } else {
                ret = ret + pc + (n > 1 ? n : "");
                n = 1;
                pc = c;
	    }
        }
        ret = ret + pc + (n > 1 ? n : "");
        return ret;
    },

    uncompressPattern: function(pattern) {
        var c = null;
        var s = null;
        var n = "";
        var ret = "";
        for (var i = 0; i < pattern.length; i++) {
	    c = pattern.charAt(i);
	    if (c == "." || c == "x" || c == "o") {
                if (s != null) {
		    n = parseInt(n, 10);
		    n = isNaN(n) ? 1 : n;
		    for (var j = 0; j < n; j++) {
                        ret += s;
		    }
		    n = "";
                }
                s = c;
	    } else {
                n += c;
	    }
        }
        n = parseInt(n, 10);
        n = isNaN(n) ? 1 : n;
        for (var j = 0; j < n; j++) {
	    ret += s;
        }
        return ret;
    },

    /**
     * Create an as-yet unplayed move and go to it.
     */
    createMove: function(coord) {
        var props = {};
        props[this.currentColor] = coord;
        var varNode = new NS.GameNode(null, props);
        varNode._cached = true;
        this.totalMoves++;
        this.cursor.node.appendChild(varNode);
        this.unsavedChanges = [this.cursor.node._children.last(), this.cursor.node];
        this.updatedNavTree = false;
        this.variation(this.cursor.node._children.length-1);
    },
    
    setColor: function(color) {
        this.prependComment(color == "B" ? t['black to play'] :
			    t['white to play']);
        this.currentColor = this.problemColor = color;
    },

    setMoveNumber: function(num) {
        this.moveNumber = num;
    },

    /**
     * Play a move on the board and apply rules to it. This is different from
     * merely adding a stone.
     **/
    playMove: function(coord, color, noRender) {
        color = color || this.currentColor;
        this.currentColor = (color == "B" ? "W" : "B");
        color = color == "W" ? this.board.WHITE : this.board.BLACK;
        var pt = this.sgfCoordToPoint(coord);
        if ((!coord || coord == "tt" || coord == "") && !noRender) {
	    this.prependComment((color == this.board.WHITE ?
				 t['white'] : t['black']) + " " + t['passed'], "comment-pass");
        } else if (coord == "resign") {
	    this.prependComment((color == this.board.WHITE ?
				 t['white'] : t['black']) + " " + t['resigned'], "comment-resign");
        } else if (coord && coord != "tt") {
	    this.board.addStone(pt, color);
	    this.rules.apply(pt, color);
	    if (this.prefs.markCurrent && !noRender) {
                this.addMarker(coord, "current");
	    }
        }
    },

    addStone: function(coord, color) {
        if (!(coord instanceof Array)) {
	    coord = [coord];
        }
        coord = this.expandCompressedPoints(coord);
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
        coord = this.expandCompressedPoints(coord);
        var label;
        for (var i = 0; i < coord.length; i++) {
	    switch (type) {
            case "TR": label = "triangle"; break;
            case "SQ": label = "square"; break;
            case "CR": label = "circle"; break;
            case "MA": label = "ex"; break;
            case "TW": label = "territory-white"; break;
            case "TB": label = "territory-black"; break;
            case "DD": label = "dim"; break;
            case "LB": label = (coord[i].split(":"))[1]; break;
            default: label = type; break;
	    }
	    this.board.addMarker(
                this.sgfCoordToPoint((coord[i].split(":"))[0]),
                label
	    );
        }
    },

    showTime: function(value, type) {
        var tp = (type == "BL" || type == "OB" ? "timeB" : "timeW");
        if (type == "BL" || type == "WL") {
	    var mins = Math.floor(value / 60);
	    var secs = (value % 60).toFixed(0);
	    secs = (secs < 10 ? "0" : "") + secs;
	    this[tp] = mins + ":" + secs;
        } else {
	    this[tp] += " (" + value + ")";
        }
    },

    /**
     * Good move, bad move, etc
     **/
    showAnnotation: function(value, type) {
        var msg;
        switch (type) {
        case 'N':  msg = value; break;
        case 'GB': msg = (value > 1 ? t['vgb'] : t['gb']); break;
        case 'GW': msg = (value > 1 ? t['vgw'] : t['gw']); break;
        case 'DM': msg = (value > 1 ? t['dmj'] : t['dm']); break;
        case 'UC': msg = t['uc']; break;
        case 'TE': msg = t['te']; break;
        case 'BM': msg = (value > 1 ? t['vbm'] : t['bm']); break;
        case 'DO': msg = t['do']; break;
        case 'IT': msg = t['it']; break;
        case 'HO': msg = t['ho']; break;
        }
        this.prependComment(msg);
    },

    showComments: function(comments, junk, noRender) {
        if (!comments || noRender) return;
	this.fire('comment', { comments:comments, junk:junk, noRender:noRender} );
    },

    /**
     * For special notices
     **/
    prependComment: function(content, cls) {
        cls = cls || "comment-status";
	//TODO: send a comment event.
        //this.dom.comments.innerHTML = "<div class='" + cls + "'>" +
        //    content + "</div>" + this.dom.comments.innerHTML;
    },
    
    /**
     * Redirect to a download handler or attempt to display data inline
     **/
    downloadSgf: function(evt) {
        stopEvent(evt);
        if (this.downloadUrl) {
	    if (this.unsavedChanges) {
                alert(t['unsaved changes']);
                return;
	    }
	    location.href = this.downloadUrl + this.gameName;
        } else if (isMoz) {
	    location.href = "data:text/plain," +
                encodeURIComponent(this.cursor.getGameRoot().toSgf());
        }
    },
    
    /**
     * Send SGF data to a file-saving handler
     **/
    save: function(evt) {
        stopEvent(evt);
        var success = function(req) {
	    this.fire('saved', [req.responseText]);
        }
        var failure = function(req) {
	    this.croak(t['error retrieving']);
        }
        var sgf = this.cursor.getGameRoot().toSgf();
        ajax('POST', this.saveUrl, {sgf: sgf}, success, failure, this, 30000);
    },
    
    resetLastLabels: function() {
        this.labelLastNumber = 1;
        this.labelLastLetter = "A";
    },
    
    getGameDescription: function(excludeGameName) {
        var root = this.cursor.getGameRoot();
        if (!root) return;
        var desc = (excludeGameName ? "" : root.GN || this.gameName);
        if (root.PW && root.PB) {
	    var wr = root.WR ? " " + root.WR : "";
	    var br = root.BR ? " " + root.BR : "";
	    desc += (desc.length ? " - " : "") + root.PW + wr + " vs " + root.PB + br;
        }
        return desc;
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

    pointToSgfCoord: function(pt) {
        if (!pt || (this.board && !this.boundsCheck(pt.x, pt.y, [0, this.board.boardSize-1]))) {
	    return null;
        }
        var pts = {
	    0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h',
	    8: 'i', 9: 'j', 10: 'k', 11: 'l', 12: 'm', 13: 'n', 14: 'o',
	    15: 'p', 16: 'q', 17: 'r', 18: 's'
        };
        return pts[pt.x] + pts[pt.y];
    },
    expandCompressedPoints: function(coords) {
        var bounds;
        var ul, lr;
        var x, y;
        var newCoords = [];
        var hits = [];
        for (var i = 0; i < coords.length; i++) {
	    bounds = coords[i].split(/:/);
	    if (bounds.length > 1) {
                ul = this.sgfCoordToPoint(bounds[0]);
                lr = this.sgfCoordToPoint(bounds[1]);
                for (x = ul.x; x <= lr.x; x++) {
		    for (y = ul.y; y <= lr.y; y++) {
			newCoords.push(this.pointToSgfCoord({x:x,y:y}));
		    }
                }
                hits.push(i);
	    }
	}
	coords = coords.concat(newCoords);
	return coords;
    },
    croak: function(msg) {
        if (this.board) {
	    alert(msg);
        } else if (this.problemMode) {
	    this.prependComment(msg);
        } else {
	    //TODO: handle a croak by displaying some kind of error on the page.
	    alert(msg);
	    this.croaked = true;
        }
    }
});