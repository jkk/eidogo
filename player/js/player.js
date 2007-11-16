/**
 * EidoGo -- Web-based SGF Replayer
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 */
 
(function() {
    
    // shortcuts (local only to this file)
    var t = eidogo.i18n,
        byId = eidogo.util.byId,
        ajax = eidogo.util.ajax,
        addEvent = eidogo.util.addEvent,
        onClick = eidogo.util.onClick,
        getElClickXY = eidogo.util.getElClickXY,
        stopEvent = eidogo.util.stopEvent,
        addClass = eidogo.util.addClass,
        removeClass = eidogo.util.removeClass,
        show = eidogo.util.show,
        hide = eidogo.util.hide,
        ua = navigator.userAgent.toLowerCase(),
        isMoz = /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua);
            
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
        },
        months: [
            t['january'],
            t['february'],
            t['march'],
            t['april'],
            t['may'],
            t['june'],
            t['july'],
            t['august'],
            t['september'],
            t['october'],
            t['november'],
            t['december']
        ],

        /**
         * Inits settings that are persistent among games
         * @constructor
         * @param {Object} cfg A hash of configuration values
         */
        init: function(cfg) {
        
            cfg = cfg || {};
        
            // play, add_b, add_w, region, tr, sq, cr, label, number, score(?)
            this.mode = cfg.mode ? cfg.mode : "play";
        
            // for references to all our DOM objects -- see constructDom()
            this.dom = {};
            this.dom.container = (typeof cfg.container == "string" ?
                byId(cfg.container) : cfg.container);
        
            if (!this.dom.container) {
                alert(t['dom error']);
                return;
            }
        
            // so we can have more than one player on a page
            this.uniq = (new Date()).getTime();
            
            // URL path to SGF files
            this.sgfPath = cfg.sgfPath;
            
            // pattern and game info search
            this.searchUrl = cfg.searchUrl;
            
            // save to file
            this.saveUrl = cfg.saveUrl;
            
            // url to handle downloads
            this.downloadUrl = cfg.downloadUrl;
            
            // Allow outside scripts to hook into Player events. Format:
            //      hookName:   hookHandler
            // Available hooks:
            // - initDone
            // - initGame
            // - setPermalink
            // - searchRegion
            this.hooks = cfg.hooks || {};
            
            this.permalinkable = !!this.hooks.setPermalink;
            
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
            
            this.reset(cfg);
            
            // set up the elements we'll use
            this.constructDom();
            
            // player-wide events
            if (cfg.enableShortcuts) {
                addEvent(document, isMoz ? "keypress" : "keydown", this.handleKeypress, this, true);
            }
            addEvent(document, "mouseup", this.handleDocMouseUp, this, true);
            
            if (cfg.sgf || cfg.sgfUrl || (cfg.sgfPath && cfg.gameName)) {
                this.loadSgf(cfg);
            }
            
            this.hook("initDone");
        },
        
        /**
         * Delegate to a hook handler. 'this' will be bound to the Player
         * instance
        **/
        hook: function(hook, params) {
            if (hook in this.hooks) {
                this.hooks[hook].bind(this)(params);
            }
        },
        
        /**
         * Resets settings that can change per game
        **/
        reset: function(cfg) {
            
            this.gameName = "";
            
            // gameTree here is actually more like a Collection as described in the
            // EBNF definition in the SGF spec, http://www.red-bean.com/sgf/sgf4.html.
            // Each element of gameTree.trees is actually a GameTree as defined in the
            // spec. Right now we only really support a single game at a time -- i.e.,
            // gameTree.trees[0]. I might change this in the future.
            this.gameTree = new eidogo.GameTree();
            this.cursor = new eidogo.GameCursor();
        
            // used for Ajaxy dynamic tree loading
            this.progressiveLoad = cfg.progressiveLoad ? true : false;
            this.progressiveLoads = null;
            this.progressiveUrl = null;
            
            // gnugo/computer opponent
            this.opponentUrl = null;
            this.opponentColor = null;
        
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
        
            // for the letter and number tools
            this.labelLastLetter = null;
            this.labelLastNumber = null;
            this.resetLastLabels();
            
            // so we know when permalinks and downloads are unreliable
            this.unsavedChanges = false;
        
            // user-changeable preferences
            this.prefs = {};
            this.prefs.markCurrent = typeof cfg.markCurrent != "undefined" ?
                !!cfg.markCurrent : true;
            this.prefs.markNext = typeof cfg.markNext != "undefined" ?
                cfg.markNext : false;
            this.prefs.markVariations = typeof cfg.markVariations != "undefined" ?
                !!cfg.markVariations : true;
            this.prefs.showGameInfo = !!cfg.showGameInfo;
            this.prefs.showPlayerInfo = !!cfg.showPlayerInfo;
            this.prefs.showTools = !!cfg.showTools;
            this.prefs.showComments = typeof cfg.showComments != "undefined" ?
                !!cfg.showComments : true;
            this.prefs.showSave = !!cfg.showSave;
        },
        
        /**
         * Load an SGF file or start from a blank board
        **/
        loadSgf: function(cfg, completeFn) {
            this.nowLoading();
            
            this.reset(cfg);
            
            // URL path to SGF files
            this.sgfPath = cfg.sgfPath || this.sgfPath;
        
            // Load the first tree and first node by default.
            this.loadPath = cfg.loadPath && cfg.loadPath.length > 1 ?
                cfg.loadPath : [0, 0];
        
            // game name (= file name) of the game to load
            this.gameName = cfg.gameName;
            
            if (typeof cfg.sgf == "string") {
            
                // raw SGF data
                var sgf = new eidogo.SgfParser(cfg.sgf);
                this.load(sgf.tree);
        
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
                var noCb = true;
                if (cfg.progressiveLoad) {
                    this.progressiveLoads = 0;
                    this.progressiveUrl = cfg.progressiveUrl
                        || cfg.sgfUrl.replace(/\?.+$/, "");
                }
        
            } else {
        
                // start from scratch
                var boardSize = cfg.boardSize || "19";
                var blankGame = {nodes: [], trees: [{nodes: [{SZ: boardSize}], trees: []}]};
            
                // AI opponent (e.g. GNU Go)
                if (cfg.opponentUrl) {
                    this.opponentUrl = cfg.opponentUrl;
                    this.opponentColor = cfg.opponentColor == "B" ? cfg.opponentColor : "W";
                    var root = blankGame.trees.first().nodes.first();
                    root.PW = t['you'];
                    root.PB = "GNU Go"
                    this.gameName = "gnugo";
                }
            
                this.load(blankGame);
            }
            if (!noCb && typeof completeFn == "function") {
                completeFn();
            }
        },
    
        /**
         * Sets up a new game for playing. Can be called repeatedly (e.g., for
         * dynamically-loaded games).
        **/
        initGame: function(target) {
            this.handleDisplayPrefs();
            var gameRoot = target.trees.first().nodes.first();
            var size = gameRoot.SZ;
            if (!this.board) {
                // first time
                this.createBoard(size || 19);
            }
            this.unsavedChanges = false;
            this.resetCursor(true);
            this.totalMoves = 0;
            var moveCursor = new eidogo.GameCursor(this.cursor.node);
            while (moveCursor.next()) { this.totalMoves++; }
            this.totalMoves--;
            this.showInfo();
            this.enableNavSlider();
            this.selectTool("play");
            this.hook("initGame");
        },
        
        /**
         * Shows or hides interface elements as configured
        **/
        handleDisplayPrefs: function() {
            (this.prefs.showGameInfo || this.prefs.showPlayerInfo ? show : hide)(this.dom.info);
            (this.prefs.showGameInfo ? show : hide)(this.dom.infoGame);
            (this.prefs.showPlayerInfo ? show : hide)(this.dom.infoPlayers);  
            (this.prefs.showTools ? show : hide)(this.dom.toolsContainer);
            (this.prefs.showComments ? show : hide)(this.dom.comments);
            (this.prefs.showSave ? show : hide)(this.dom.options);
        },
    
        /**
         * Create our board, tie it to a Rules instance, and add appropriate event
         * handlers. This can be called multiple times.
        **/
        createBoard: function(size) {
            size = size || 19;
            if (this.board && this.board.renderer && this.board.boardSize == size) return;
            try {
                this.dom.boardContainer.innerHTML = "";
                var renderer = new eidogo.BoardRendererHtml(this.dom.boardContainer, size);
                this.board = new eidogo.Board(renderer, size);
            } catch (e) {
                if (e == "No DOM container") {
                    this.croak(t['error board']);
                    return;
                }
            }
        
            if (size != 19) {
                removeClass(this.dom.boardContainer, "with-coords");
            } else {
                addClass(this.dom.boardContainer, "with-coords");
            }
        
            // add the search region selection box for later use
            this.board.renderer.domNode.appendChild(this.dom.searchRegion);
        
            this.rules = new eidogo.Rules(this.board);  
        
            var domBoard = this.board.renderer.domNode;
            
            addEvent(domBoard, "mousemove", this.handleBoardHover, this, true);
            addEvent(domBoard, "mousedown", this.handleBoardMouseDown, this, true);
            addEvent(domBoard, "mouseup", this.handleBoardMouseUp, this, true);
        },
    
        /**
         * Loads game data into a given target. If no target is given, creates
         * a new gameTree and initializes the game.
        **/
        load: function(data, target) {
            if (!target) {
                // load from scratch
                target = new eidogo.GameTree();
                this.gameTree = target;
            }
            target.loadJson(data);
            target.cached = true;
            this.doneLoading();
            if (!target.parent) {
                this.initGame(target);
            } else {
                this.progressiveLoads--;
            }
            
            if (this.loadPath.length) {
                this.goTo(this.loadPath, false);
                if (!this.progressiveLoad) {
                    this.loadPath = [0,0];
                }
            } else {
                this.refresh();
            }
        },
    
        /**
         * Load game data given as raw SGF or JSON from a URL within the same
         * domain.
         * @param {string} url URL to load game data from
         * @param {GameTree} target inserts data into this tree if given
         * @param {boolean} useSgfPath if true, prepends sgfPath to url
         * @param {Array} loadPath gameTree path to load
        **/
        remoteLoad: function(url, target, useSgfPath, loadPath, completeFn) {
            useSgfPath = useSgfPath == "undefined" ? true : useSgfPath;
            
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
            
            var success = function(req) {
                var data = req.responseText;
            
                // trim leading space
                var first = data.charAt(0);
                var i = 1;
                while (i < data.length && (first == " " || first == "\r" || first == "\n")) {
                    first = data.charAt(i++);
                }
                
                // infer the kind of file we got
                if (first == '(') {
                    // SGF
                    var sgf = new eidogo.SgfParser(data);
                    this.load(sgf.tree, target);
                } else if (first == '{') {
                    // JSON
                    data = eval("(" + data + ")");
                    this.load(data, target);
                } else {
                    this.croak(t['invalid data']);
                }
                
                if (typeof completeFn == "function") {
                    completeFn();
                }
            }
        
            var failure = function(req) {
                this.croak(t['error retrieving']);
            }
            
            ajax('get', url, null, success, failure, this, 30000);
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
            var params = {
                sgf: this.gameTree.trees[0].toSgf(),
                move: this.currentColor,
                size: this.gameTree.trees.first().nodes.first().SZ
            };
            
            ajax('post', this.opponentUrl, params, success, failure, this, 45000);  
        },
    
        /**
         * Navigates to a location within the gameTree. Takes progressive loading
         * into account.
        **/
        goTo: function(path, fromStart) {
            fromStart = typeof fromStart != "undefined" ? fromStart : true;
            var position;
            var vars;
            if (path instanceof Array) {
                // Go to an absolute path.
                if (!path.length) return;
                if (fromStart) {
                    this.resetCursor(true);
                }
                while (path.length) {
                    position = path[0];
                    if (isNaN(parseInt(position, 10))) {
                        // move (coord) path item
                        vars = this.getVariations(true);
                        if (!vars.length || vars[0].move == null) {
                            this.variation(null, true);
                            if (this.progressiveLoads) {
                                this.loadPath.push(position);
                                return;
                            }
                        }
                        for (var i = 0; i < vars.length; i++) {
                            if (vars[i].move == position) {
                                this.variation(vars[i].treeNum, true);
                                break;
                            }
                        }
                        path.shift();
                    } else {
                        // tree/node integer position
                        position = parseInt(path.shift(), 10);
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
                                    this.execNode(true, true);
                                }
                            }
                        }
                    }
                    if (this.progressiveLoads) return;
                }
                this.refresh();
            } else if (!isNaN(parseInt(path, 10))) {
                // Go to a move number.
                var steps = parseInt(path, 10);
                if (fromStart) {
                    this.resetCursor(true);
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

        /**
         * Resets the game cursor to the first node
        **/
        resetCursor: function(noRender, firstGame) {
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
    
        /**
         * Refresh the current node (and wait until progressive loading is
         * finished before doing so)
        **/
        refresh: function(noRender) {
            if (this.progressiveLoads) {
                var me = this;
                setTimeout(function() { me.refresh.call(me); }, 10);
                return;
            }
            this.moveNumber--;
            if (this.moveNumber < 0) this.moveNumber = 0;
            this.board.revert(1);
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
                this.resetLastLabels();
                // Should we continue after loading finishes or just stop
                // like we do here?
                if (this.progressiveLoads) return false;
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
         *      considerations. Useful when executing to the end of a sibling
         *      line when a variation load is still in progress.
         */
        execNode: function(noRender, ignoreProgressive) {
            // don't execute a node while it's being loaded
            if (!ignoreProgressive && this.progressiveLoads) {
                var me = this;
                setTimeout(function() { me.execNode.call(me, noRender); }, 10);
                return;
            }
        
            if (!noRender) {
                this.dom.comments.innerHTML = "";
                this.board.clearMarkers();
            }
        
            if (this.moveNumber < 1) {
                this.currentColor = "B";
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
            
            // progressive loading?
            if (!ignoreProgressive && this.progressiveUrl && !this.cursor.node.parent.cached) {
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
            this.variations = this.getVariations(this.prefs.markNext);
        },
        
        getVariations: function(includeSibling) {
            var vars = [];
            if (!this.cursor.node) return vars;
            if (includeSibling && this.cursor.node.nextSibling != null) {
                // handle next sibling move as variation 1
                vars.push({
                    move: this.cursor.node.nextSibling.getMove(),
                    treeNum: null
                });
            }
            if (this.cursor.node.nextSibling == null
                && this.cursor.node.parent
                && this.cursor.node.parent.trees.length) {
                var varTrees = this.cursor.node.parent.trees;
                for (var i = 0; i < varTrees.length; i++) {
                    vars.push({
                        move: varTrees[i].nodes.first().getMove(),
                        treeNum: i
                    });
                }
            }
            return vars;
        },
    
        back: function(e, obj, noRender) {
            if (this.cursor.previous()) {
                this.moveNumber--;
                if (this.moveNumber < 0) this.moveNumber = 0;
                this.board.revert(1);
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
                    this.variation(this.variations[i].treeNum);
                    return;
                }
            }
            this.createMove('tt');
        },
    
        /**
         *  Gets the board coordinates (0-18) for a mouse event
        **/
        getXY: function(e) {
            var clickXY = getElClickXY(e, this.board.renderer.domNode);
            
            var m = this.board.renderer.margin;
            var pw = this.board.renderer.pointWidth;
            var ph = this.board.renderer.pointHeight;
            
            var x = Math.round((clickXY[0] - m - (pw / 2)) / pw);
            var y = Math.round((clickXY[1] - m - (ph / 2)) / ph);
        
            return [x, y];
        },
    
        handleBoardMouseDown: function(e) {
            if (this.domLoading) return;
            var xy = this.getXY(e);
            var x = xy[0];
            var y = xy[1];
            if (!this.boundsCheck(x, y, [0, this.board.boardSize-1])) return;
            this.mouseDown = true;
            this.mouseDownX = x;
            this.mouseDownY = y;
            // begin region selection
            if (this.mode == "region" && x >= 0 && y >= 0 && !this.regionBegun) {
                this.regionTop = y;
                this.regionLeft = x;
                this.regionBegun = true;
            }
        },
    
        handleBoardHover: function(e) {
            if (this.domLoading) return;
            if (this.mouseDown || this.regionBegun) {
                var xy = this.getXY(e);
                var x = xy[0];
                var y = xy[1];
                if (!this.boundsCheck(x, y, [0, this.board.boardSize-1])) return;
                if (this.searchUrl && !this.regionBegun && (x != this.mouseDownX || y != this.mouseDownY)) {
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
    
        handleBoardMouseUp: function(e) {
            if (this.domLoading) return;
            
            this.mouseDown = false;
        
            var xy = this.getXY(e);
            var x = xy[0];
            var y = xy[1];
        
            var coord = this.pointToSgfCoord({x: x, y: y});
        
            if (this.mode == "play") {
                // click on a variation?
                for (var i = 0; i < this.variations.length; i++) {
                    var varPt = this.sgfCoordToPoint(this.variations[i].move);
                    if (varPt.x == x && varPt.y == y) {
                        this.variation(this.variations[i].treeNum);
                        stopEvent(e);
                        return;
                    }
                }
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
                    show(this.dom.searchAlgo, "inline");
                    show(this.dom.searchButton, "inline");
                    stopEvent(e);
                }
            } else {
                // place black stone, white stone, labels
                var prop;
                var stone = this.board.getStone({x:x,y:y});
                if (this.mode == "add_b" || this.mode == "add_w") {
                    this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
                    if (stone != this.board.BLACK && this.mode == "add_b") {
                        prop = "AB";
                    } else if (stone != this.board.WHITE && this.mode == "add_w") {
                        prop = "AW";
                    } else {
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
                    }    
                }
                this.cursor.node.pushProperty(prop, coord);
                this.refresh();
            }
        },
        
        handleDocMouseUp: function(evt) {
            if (this.domLoading) return true;
            if (this.mode == "region" && this.regionBegun && !this.regionClickSelect) {
                // end of region selection
                this.mouseDown = false;
                this.regionBegun = false;
                show(this.dom.searchAlgo, "inline");
                show(this.dom.searchButton, "inline");
            }
            return true;
        },
        
        boundsCheck: function(x, y, region) {
            if (region.length == 2) {
                region[3] = region[2] = region[1];
                region[1] = region[0];
            }
            return (x >= region[0] && y >= region[1] &&
                x <= region[2] && y <= region[3]);
        },
    
        getRegionBounds: function() {
            // top, left, width, height
            var l = this.regionLeft;
            var w = this.regionRight - this.regionLeft;
            if (w < 0) {
                l = this.regionRight;
                w = -w + 1;
            }
            var t = this.regionTop;
            var h = this.regionBottom - this.regionTop;
            if (h < 0) {
                t = this.regionBottom;
                h = -h + 1;
            }
            return [t, l, w, h];
        },
    
        showRegion: function() {
            var bounds = this.getRegionBounds();
            this.dom.searchRegion.style.top = (this.board.renderer.margin +
                this.board.renderer.pointHeight * bounds[0]) + "px";
            this.dom.searchRegion.style.left = (this.board.renderer.margin +
                this.board.renderer.pointWidth * bounds[1]) + "px";
            this.dom.searchRegion.style.width = this.board.renderer.pointWidth *
                bounds[2] + "px";
            this.dom.searchRegion.style.height = this.board.renderer.pointHeight *
                bounds[3] + "px";
            show(this.dom.searchRegion);
        },
        
        loadSearch: function(q, dim, p, a) {
            var blankGame = {nodes: [], trees: [{nodes: [{SZ: this.board.boardSize}], trees: []}]};
            this.load(blankGame);
            a = a || "corner";
            this.dom.searchAlgo.value = a;
            p = this.uncompressPattern(p);
            dim = dim.split("x");
            var w = dim[0];
            var h = dim[1];
            var bs = this.board.boardSize;
            var l;
            var t;
            switch (q) {
                case "nw": l = 0; t = 0; break;
                case "ne": l = bs - w; t = 0; break;
                case "se": l = bs - w; t = bs - h; break;
                case "sw": l = 0; t = bs - h; break;
            }
            var c;
            var x;
            var y;
            for (y = 0; y < h; y++) {
                for (x = 0; x < w; x++) {
                    c = p.charAt(y * w + x);
                    if (c == "o") {
                        c = "AW";
                    } else if (c == "x") {
                        c = "AB";
                    } else {
                        c = "";
                    }
                    this.cursor.node.pushProperty(c, this.pointToSgfCoord({x:l+x, y:t+y}));
                }
            }
            
            this.refresh();

            this.regionLeft = l;
            this.regionTop = t;
            this.regionRight = l + x;
            this.regionBottom = t + y;
            
            // highlight the selected search region by dimming surroundings
            var b = this.getRegionBounds();
            var r = [b[1], b[0], b[1]+b[2], b[0]+b[3]];
            for (y = 0; y < this.board.boardSize; y++) {
                for (x = 0; x < this.board.boardSize; x++) {
                    if (!this.boundsCheck(x, y, r)) {
                        this.board.renderer.renderMarker({x:x,y:y}, "dim");
                    }
                }
            }
            
            this.searchRegion();
        },
        
        searchRegion: function() {
            if (this.searching) return;
            this.searching = true;
            
            if (!this.searchUrl) {
                show(this.dom.comments);
                hide(this.dom.searchContainer);
                this.prependComment(t['no search url']);
                return;
            }
            
            var algo = this.dom.searchAlgo.value;
            
            var bounds = this.getRegionBounds();
            var region = this.board.getRegion(bounds[0], bounds[1], bounds[2], bounds[3]);
            var pattern = region.join("")
                .replace(new RegExp(this.board.EMPTY, "g"), ".")
                .replace(new RegExp(this.board.BLACK, "g"), "x")
                .replace(new RegExp(this.board.WHITE, "g"), "o");
            
            // check for empty or meaningless searches
            var empty = /^\.*$/.test(pattern);
            var oneW = /^\.*O\.*$/.test(pattern);
            var oneB = /^\.*X\.*$/.test(pattern);
            if (empty || oneW || oneB) {
                this.searching = false;
                show(this.dom.comments);
                hide(this.dom.searchContainer);
                this.prependComment(t['two stones']);
                return;
            }
            
            // make sure corner search regions touch two adjacent edges of the board
            var edges = [];
            if (bounds[0] == 0) edges.push('n');
            if (bounds[1] == 0) edges.push('w')
            if (bounds[0] + bounds[3] == this.board.boardSize) edges.push('s');
            if (bounds[1] + bounds[2] == this.board.boardSize) edges.push('e');
            if (algo == "corner" && !(edges.length == 2 &&
                 ((edges.contains('n') && edges.contains('e')) ||
                  (edges.contains('n') && edges.contains('w')) ||
                  (edges.contains('s') && edges.contains('e')) ||
                  (edges.contains('s') && edges.contains('w'))))) {
                this.searching = false;
                show(this.dom.comments);
                hide(this.dom.searchContainer);
                this.prependComment(t['two edges']);
                return;
            }
            
            var quadrant = (edges.contains('n') ? "n" : "s");
            quadrant += (edges.contains('w') ? "w" : "e");
        
            this.showComments("");
            this.gameName = "search";

            var success = function(req) {
                this.searching = false;
                this.doneLoading();
                hide(this.dom.comments);
                show(this.dom.searchContainer);
                if (req.responseText == "ERROR") {
                    this.croak(t['error retrieving']);
                    return;
                } else if (req.responseText == "NONE") {
                    hide(this.dom.searchResultsContainer);
                    this.dom.searchCount.innerHTML = "No";
                    return;
                }
                var results = eval("(" + req.responseText + ")");
                var result;
                var html = "";
                var odd;
                for(var i = 0; result = results[i]; i++) {
                    odd = odd ? false : true;
                    html += "<a class='search-result" + (odd ? " odd" : "") + "' href='#'>\
                        <span class='id'>" + result.id + "</span>\
                        <span class='mv'>" + result.mv + "</span>\
                        <span class='pw'>" + result.pw + " " + result.wr + "</span>\
                        <span class='pb'>" + result.pb + " " + result.br + "</span>\
                        <span class='re'>" + result.re + "</span>\
                        <span class='dt'>" + result.dt + "</span>\
                        <div class='clear'>&nbsp;</div>\
                        </a>";
                }
                show(this.dom.searchResultsContainer);
                this.dom.searchResults.innerHTML = html;
                this.dom.searchCount.innerHTML = results.length;
            }
            var failure = function(req) {
                this.croak(t['error retrieving']);
            }
            var params = {
                q: quadrant,
                w: bounds[2],
                h: bounds[3],
                p: pattern,
                a: algo,
                t: (new Date()).getTime()
            };
            
            this.progressiveLoad = false;
            this.progressiveUrl = null;
            this.prefs.markNext = false;
            this.prefs.showPlayerInfo = true;
            
            this.hook("searchRegion", params);
            
            this.nowLoading();
            ajax('get', this.searchUrl, params, success, failure, this, 45000);     
        },
        
        loadSearchResult: function(e) {
            this.nowLoading();
            var target = e.target || e.srcElement;
            if (target.nodeName == "SPAN") {
                target = target.parentNode;
            }
            if (target.nodeName == "A") {
                var span;
                var id;
                var mv;
                for (var i = 0; span = target.childNodes[i]; i++) {
                    if (span.className == "id") {
                        id = span.innerHTML;
                    }
                    if (span.className == "mv") {
                        mv = parseInt(span.innerHTML, 10);
                    }
                }
            }
            this.remoteLoad(id, null, true, [0, mv], function() {
                this.doneLoading();
                this.setPermalink();
                this.prefs.showSave = true;
                this.handleDisplayPrefs();
            }.bind(this));
            stopEvent(e);
        },
        
        closeSearch: function() {
            hide(this.dom.searchContainer);
            show(this.dom.comments);
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
            props['MN'] = (++this.moveNumber).toString();
            var varNode = new eidogo.GameNode(props);
            this.totalMoves++;
            if (this.cursor.hasNext()) {
                // new variation tree
                if (this.cursor.node.nextSibling) {
                    // No variation trees at this point; create a new one
                    this.cursor.node.parent.createVariationTree(
                        this.cursor.node.getPosition());
                }
                this.cursor.node.parent.appendTree(new eidogo.GameTree(
                    {nodes: [varNode], trees: []}));
                this.variation(this.cursor.node.parent.trees.length-1);
            } else {
                // at the end of the main line -- easy peasy
                this.cursor.node.parent.appendNode(varNode);
                this.variation();
            }
            this.unsavedChanges = true;
        },
    
        handleKeypress: function(e) {
            var charCode = e.keyCode || e.charCode;
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
                    stopEvent(e);
                    return;
                }
            }
        
            // tool shortcuts
            if (charCode == 112 || charCode == 27) { 
                // f1 or esc
                this.selectTool("play");
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
                        var movesLeft = this.totalMoves - this.moveNumber;
                        var steps = (movesLeft > 9 ? 9 : movesLeft-1);
                        for (var i = 0; i < steps; i++) {
                            this.forward(null, null, true);
                        }
                    }
                    this.forward();
                    break;
                case 37: // left
                    if (e.shiftKey) {
                        var steps = (this.moveNumber > 9 ? 9 : this.moveNumber-1);
                        for (var i = 0; i < steps; i++) {
                            this.back(null, null, true);
                        }
                    }
                    this.back();
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
                stopEvent(e);
            }
        },
    
        showInfo: function() {
            this.dom.infoGame.innerHTML = "";
            this.dom.whiteName.innerHTML = "";
            this.dom.blackName.innerHTML = "";
            var gameInfo = this.gameTree.trees.first().nodes.first();
            var dl = document.createElement('dl');
            for (var propName in this.infoLabels) {
                if (gameInfo[propName]) {
                    if (propName == "PW") {
                        this.dom.whiteName.innerHTML = gameInfo[propName] +
                            (gameInfo['WR'] ? ", " + gameInfo['WR'] : "");
                        continue;
                    } else if (propName == "PB") {
                        this.dom.blackName.innerHTML = gameInfo[propName] +
                            (gameInfo['BR'] ? ", " + gameInfo['BR'] : "");
                        continue;
                    }
                    if (propName == "WR" || propName == "BR") {
                        continue;
                    }
                    if (propName == "DT") {
                        var dateParts = gameInfo[propName].split(/[\.-]/);
                        if (dateParts.length == 3) {
                            gameInfo[propName] = dateParts[2].replace(/^0+/, "") + " "
                                + this.months[dateParts[1]-1] + " " + dateParts[0];
                        }
                    }
                    var dt = document.createElement('dt');
                    dt.innerHTML = this.infoLabels[propName] + ':';
                    var dd = document.createElement('dd');
                    dd.innerHTML = gameInfo[propName];
                    dl.appendChild(dt);
                    dl.appendChild(dd);
                }
            }
            this.dom.infoGame.appendChild(dl);
        },
    
        selectTool: function(tool) {
            var cursor;
            if (tool == "region") {
                cursor = "crosshair";
            } else {
                cursor = "default";
                this.regionBegun = false;
                hide(this.dom.searchRegion);
                hide(this.dom.searchButton);
                hide(this.dom.searchAlgo);
            }
            this.board.renderer.domNode.style.cursor = cursor;
            this.mode = tool;
            this.dom.toolsSelect.value = tool;
        },
    
        updateControls: function() {
            this.dom.moveNumber.innerHTML = (this.moveNumber ?
                (t['move'] + " " + this.moveNumber) :
                (this.permalinkable ? "permalink" : ""));
        
            this.dom.whiteCaptures.innerHTML = t['captures'] +
                ": <span>" + this.board.captures.W + "</span>";
            this.dom.blackCaptures.innerHTML = t['captures'] +
                ": <span>" + this.board.captures.B + "</span>";
        
            this.dom.whiteTime.innerHTML = t['time left'] + ": <span>" +
                (this.timeW ? this.timeW : "--") + "</span>";
            this.dom.blackTime.innerHTML = t['time left'] + ": <span>" +
                (this.timeB ? this.timeB : "--") + "</span>";

            removeClass(this.dom.controlPass, "pass-on");
            
            // variations?
            this.dom.variations.innerHTML = "";
            for (var i = 0; i < this.variations.length; i++) {
                var varLabel = i + 1;
                if (!this.variations[i].move || this.variations[i].move == "tt") {
                    // 'pass' variation
                    addClass(this.dom.controlPass, "pass-on");
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
                addEvent(
                    varNav,
                    "click",
                    function(e, arg) { arg.me.variation(arg.treeNum); },
                    {me: this, treeNum: this.variations[i].treeNum}
                );
                this.dom.variations.appendChild(varNav);
            }
            if (!this.variations.length) {
                this.dom.variations.innerHTML = "<div class='variation-nav none'>" +
                    t['no variations'] + "</div>";
            }
        
            if (this.cursor.hasNext()) {
                addClass(this.dom.controlForward, "forward-on");
                addClass(this.dom.controlLast, "last-on");
            } else {
                removeClass(this.dom.controlForward, "forward-on");
                removeClass(this.dom.controlLast, "last-on");
            }
            if (this.cursor.hasPrevious()) {
                addClass(this.dom.controlBack, "back-on");
                addClass(this.dom.controlFirst, "first-on");
            } else {
                removeClass(this.dom.controlBack, "back-on");
                removeClass(this.dom.controlFirst, "first-on");
            }
            
            if (!this.progressiveLoad) {
                this.updateNavSlider();
            }
        },
    
        setColor: function(color) {
            this.prependComment(color == "B" ? t['black to play'] :
                t['white to play']);
            this.currentColor = color;
        },
    
        setMoveNumber: function(num) {
            this.moveNumber = num;
        },
    
        playMove: function(coord, color, noRender) {
            color = color || this.currentColor;
            this.currentColor = (color == "B" ? "W" : "B");
            color = color == "W" ? this.board.WHITE : this.board.BLACK;
            var pt = this.sgfCoordToPoint(coord);
            if (!this.cursor.node['MN']) {
                this.moveNumber++;
            }
            if ((!coord || coord == "tt" || coord == "") && !noRender) {
                this.prependComment((color == this.board.WHITE ?
                    t['white'] : t['black']) + " " + t['passed'], "comment-pass");
            } else if (coord == "resign") {
                this.prependComment((color == this.board.WHITE ?
                    t['white'] : t['black']) + " " + t['resigned'], "comment-resign");
            } else {
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
                    case "LB": label = (coord[i].split(":"))[1]; coord[i]; break;
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
            this.dom.comments.innerHTML += comments.replace(/\n/g, "<br />");
        },
    
        prependComment: function(content, cls) {
            cls = cls || "comment-status";
            this.dom.comments.innerHTML = "<div class='" + cls + "'>" + content + "</div>" +
                this.dom.comments.innerHTML;
        },
        
        downloadSgf: function(evt) {            
            stopEvent(evt);
            if (this.unsavedChanges) {
                alert(t['unsaved changes']);
                return;
            }
            location.href = this.downloadUrl + this.gameName;
        },
        
        save: function(evt) {
            stopEvent(evt);
            var success = function(req) {
                this.hook("saved", [req.responseText]);
            }
            var failure = function(req) {
                this.croak(t['error retrieving']);
            }
            var sgf = this.gameTree.trees.first().toSgf();
            ajax('POST', this.saveUrl, {sgf: sgf}, success, failure, this, 30000);
        },
    
        /**
         * Create the Player layout and insert it into the page. Also store
         * references to all our DOM elements for later use, and add
         * appropriate event handlers.
        **/
        constructDom: function() {
        
            this.dom.player = document.createElement('div');
            this.dom.player.className = "eidogo-player";
            this.dom.player.id = "player-" + this.uniq;
            this.dom.container.innerHTML = "";
            eidogo.util.show(this.dom.container);
            this.dom.container.appendChild(this.dom.player);
        
            var domHtml = "\
                <div id='board-container' class='board-container with-coords'></div>\
                <div id='controls-container' class='controls-container'>\
                    <ul id='controls' class='controls'>\
                        <li id='control-first' class='control first'>First</li>\
                        <li id='control-back' class='control back'>Back</li>\
                        <li id='control-forward' class='control forward'>Forward</li>\
                        <li id='control-last' class='control last'>Last</li>\
                        <li id='control-pass' class='control pass'>Pass</li>\
                    </ul>\
                    <div id='move-number' class='move-number" + (this.permalinkable ? " permalink" : "") + "'></div>\
                    <div id='nav-slider' class='nav-slider'>\
                        <div id='nav-slider-thumb' class='nav-slider-thumb'></div>\
                    </div>\
                    <div id='variations-container' class='variations-container'>\
                        <div id='variations-label' class='variations-label'>" + t['variations'] + ":</div>\
                        <div id='variations' class='variations'></div>\
                    </div>\
                    <div class='controls-stop'></div>\
                </div>\
                <div id='tools-container' class='tools-container'" + (this.prefs.showTools ? "" : " style='display: none'") + ">\
                    <div id='tools-label' class='tools-label'>" + t['tool'] + ":</div>\
                    <select id='tools-select' class='tools-select'>\
                        <option value='play'>" + t['play'] + "</option>\
                        <option value='add_b'>" + t['add_b'] + "</option>\
                        <option value='add_w'>" + t['add_w'] + "</option>\
                        " + (this.searchUrl ? ("<option value='region'>" + t['region'] + "</option>") : "") +"\
                        <option value='tr'>" + t['triangle'] + "</option>\
                        <option value='sq'>" + t['square'] + "</option>\
                        <option value='cr'>" + t['circle'] + "</option>\
                        <option value='x'>" + t['x'] + "</option>\
                        <option value='letter'>" + t['letter'] + "</option>\
                        <option value='number'>" + t['number'] + "</option>\
                        <option value='dim'>" + t['dim'] + "</option>\
                    </select>\
                    <select id='search-algo' class='search-algo'>\
                        <option value='corner'>" + t['search corner'] + "</option>\
                        <option value='center'>" + t['search center'] + "</option>\
                    </select>\
                    <input type='button' id='search-button' class='search-button' value='" + t['search'] + "'>\
                </div>\
                <div id='comments' class='comments'></div>\
                <div id='search-container' class='search-container'>\
                    <div id='search-close' class='search-close'>close search</div>\
                    <p class='search-count'><span id='search-count'></span>&nbsp;matches found.</p>\
                    <div id='search-results-container' class='search-results-container'>\
                        <div class='search-result'>\
                            <span class='pw'><b>White</b></span>\
                            <span class='pb'><b>Black</b></span>\
                            <span class='re'><b>Result</b></span>\
                            <span class='dt'><b>Date</b></span>\
                            <div class='clear'></div>\
                        </div>\
                        <div id='search-results' class='search-results'></div>\
                    </div>\
                </div>\
                <div id='info' class='info'>\
                    <div id='info-players' class='players'>\
                        <div id='white' class='player white'>\
                            <div id='white-name' class='name'></div>\
                            <div id='white-captures' class='captures'></div>\
                            <div id='white-time' class='time'></div>\
                        </div>\
                        <div id='black' class='player black'>\
                            <div id='black-name' class='name'></div>\
                            <div id='black-captures' class='captures'></div>\
                            <div id='black-time' class='time'></div>\
                        </div>\
                    </div>\
                    <div id='info-game' class='game'></div>\
                </div>\
                <div id='options' class='options'>\
                    " + (this.saveUrl ? "<a id='option-save' class='option-save' href='#' title='Save this game'>Save</a>" : "") + "\
                    " + (this.downloadUrl ? "<a id='option-download' class='option-download' href='#' title='Download this game as SGF'>Download SGF</a>" : "") + "\
                </div>\
                <div id='preferences' class='preferences'>\
                    <div><input type='checkbox'> Show variations on board</div>\
                    <div><input type='checkbox'> Mark current move</div>\
                </div>\
                <div id='footer' class='footer'></div>\
            ";
            
            // unique ids for each element so we can have multiple Player
            // instances on a page
            domHtml = domHtml.replace(/ id='([^']+)'/g, " id='$1-" + this.uniq + "'");
            
            this.dom.player.innerHTML = domHtml;
            
            // grab all the dom elements for later use
            var re = / id='([^']+)-\d+'/g;
            var match;
            var id;
            var jsName;
            while (match = re.exec(domHtml)) {
                id = match[0].replace(/'/g, "").replace(/ id=/, "");
                jsName = "";
                // camel-case the id
                match[1].split("-").forEach(function(word, i) {
                    word = i ? word.charAt(0).toUpperCase() + word.substring(1) : word;
                    jsName += word
                });
                this.dom[jsName] = byId(id);
            }
            
            // this has to be inserted after the board is created
            this.dom.searchRegion = document.createElement('div');
            this.dom.searchRegion.id = "search-region-" + this.uniq;
            this.dom.searchRegion.className = "search-region";
            
            // for speedup
            this.dom.navSlider._width = this.dom.navSlider.offsetWidth;
            this.dom.navSliderThumb._width = this.dom.navSliderThumb.offsetWidth;
            
            // dom element      handler
            [['moveNumber',     'setPermalink'],
             ['controlFirst',   'first'],
             ['controlBack',    'back'],
             ['controlForward', 'forward'],
             ['controlLast',    'last'],
             ['controlPass',    'pass'],
             ['searchButton',   'searchRegion'],
             ['searchResults',  'loadSearchResult'],
             ['searchClose',    'closeSearch'],
             ['optionDownload', 'downloadSgf'],
             ['optionSave',     'save']
            ].forEach(function(eh) {
                if (this.dom[eh[0]]) onClick(this.dom[eh[0]], this[eh[1]], this);
            }.bind(this));
            
            addEvent(this.dom.toolsSelect, 'change', function(e) {
                this.selectTool.apply(this, [(e.target || e.srcElement).value]);
            }, this, true);
        },
        
        enableNavSlider: function() {
            // don't use slider for progressively-loaded games
            if (this.progressiveLoad) {
                hide(this.dom.navSliderThumb);
                return;
            }
        
            this.dom.navSlider.style.cursor = "pointer";
    
            var sliding = false;
            var timeout = null;
            
            addEvent(this.dom.navSlider, "mousedown", function(e) {
                sliding = true;
                stopEvent(e);
            }, this, true);
            
            addEvent(document, "mousemove", function(e) {
                if (!sliding) return;
                var xy = getElClickXY(e, this.dom.navSlider);
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    this.updateNavSlider(xy[0]);
                }.bind(this), 10);
                stopEvent(e);
            }, this, true);
            
            addEvent(document, "mouseup", function(e) {
                if (!sliding) return true;
                sliding = false;
                var xy = getElClickXY(e, this.dom.navSlider);
                this.updateNavSlider(xy[0]);
                return true;
            }, this, true);
        },
        
        updateNavSlider: function(offset) {
            var width = this.dom.navSlider._width - this.dom.navSliderThumb._width;
            var steps = this.totalMoves;
            var offsetGiven = !!offset;
            offset = offset || (this.moveNumber / steps * width);
            offset = offset > width ? width : offset;
            offset = offset < 0 ? 0 : offset;
            var moveOffset = parseInt(offset / width * steps, 10);
            
            // only update the board when we're given an offset; otherwise,
            // assume we're just reflecting the board position
            if (offsetGiven) {
                this.nowLoading();
                var delta = moveOffset - this.cursor.node.getPosition() ;
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
                this.doneLoading();
                this.refresh();
            }
            
            // snap to move interval
            offset = parseInt(moveOffset / steps * width, 10) || 0;
            this.dom.navSliderThumb.style.left = offset + "px";
        },
    
        resetLastLabels: function() {
            this.labelLastNumber = 1;
            this.labelLastLetter = "A";
        },
        
        getGameDescription: function() {
            var root = this.gameTree.trees.first().nodes.first();
            var desc = root.GN || this.gameName;
            if (root.PW && root.PB) {
                var wr = root.WR ? " " + root.WR : "";
                var br = root.BR ? " " + root.BR : "";
                desc += " - " + root.PW + wr + " vs " + root.PB + br;
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
            if (!pt || !this.boundsCheck(pt.x, pt.y, [0, this.board.boardSize-1])) {
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
    
        /**
         * Permalink delegator. An outside hook must handle the actual
         * permalink creation.
        **/
        setPermalink: function() {
            if (this.unsavedChanges) {
                alert(eidogo.i18n['unsaved changes']);
                return;
            }
            this.hook("setPermalink");
        },
    
        nowLoading: function(msg) {
            if (this.croaked) return;
            msg = msg || t['loading'] + "...";
            if (byId('eidogo-loading-' + this.uniq)) return;
            this.domLoading = document.createElement('div');
            this.domLoading.id = "eidogo-loading-" + this.uniq;
            this.domLoading.className = "eidogo-loading";
            this.domLoading.innerHTML = msg;
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
            this.dom.player.innerHTML += "<div class='eidogo-error'>" +
                msg.replace(/\n/g, "<br />") + "</div>";
            this.croaked = true;
        }
    };
    
})();
