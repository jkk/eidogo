var player;

(function() {
    
    // Provide handlers for frontend things (page title, permalinks) that
    // aren't handled by Player directly
    var hooks = {
        initGame: function() {
            var gameRoot = this.gameTree.trees.first().nodes.first();
            var gn = gameRoot.GN || this.gameName;
            if (gn) {
                // set the page title
                document.title = "EidoGo - " + gn;
                if (gameRoot.PW && gameRoot.PB) {
                    var wr = gameRoot.WR ? " " + gameRoot.WR : "";
                    var br = gameRoot.BR ? " " + gameRoot.BR : "";
                    document.title += " - " + gameRoot.PW + wr +
                        " vs " + gameRoot.PB + br;
                }
            }
        },
        setPermalink: function() {
            var hash = (this.gameName ? this.gameName : "") + ":" +
                this.cursor.getPath().join(",");
            addHistory(hash);
        },
        searchRegion: function(params) {
            this.hooks.initGame.call(this); // update title
            var hash = "search:" + params.q + ":" + params.w + "x" + params.h +
                ":" + this.compressPattern(params.p) + ":" + params.a;
            if (hash != location.hash.replace(/^#/, "")) {
                addHistory(hash);
            }
        },
        saved: function(gn) {
            loadGame({gameName: gn, loadPath: [0,0]}, function() {
                var url = location.href.replace(/#[^#]+$/, "") + "#" + this.gameName;
                this.setPermalink();
                this.prependComment("Game saved to <a href='" + url + "'>" + url + "</a>");
            }.bind(this));
        }
    };
    
    // Create a new Player from scratch or load in new game data
    function loadGame(params, completeFn) {
        params = params || {};
        var cfg = {
            progressiveLoad:    false,
            markCurrent:        true,
            markVariations:     true,
            markNext:           false,
            showGameInfo:       true,
            showPlayerInfo:     true,
            showSave:           true,
            showTools:          true
        };
        for (var key in params) {
            cfg[key] = params[key];
        }
        if (!player) {
            player = new eidogo.Player({
                domId:              "player-container",
                mode:               "play",
                sgfPath:            "sgf/",
                searchUrl:          "php/search.php",
                saveUrl:            "php/save.php",
                downloadUrl:        "php/download.php?id=",
                hooks:              hooks
            });
        }
        player.loadSgf(cfg, completeFn);
    }
    
    var notLoaded = true;
    
    function loadState(hash) {
        notLoaded = false;
        var hashParts = hash ? hash.replace(/^#/, "").split(/:/) : [];
        var gameName = hashParts[0] || "";
        var loadPath = hashParts[1] ? hashParts[1].split(",") : null;
        var rest = hashParts.slice(1);
        if (!gameName || gameName == "kjd") {
            loadGame({
                gameName:           "kjd",
                sgfUrl:             "php/kjd_progressive.php",                
                loadPath:           loadPath,
                progressiveLoad:    true,
                markNext:           true,
                showPlayerInfo:     false,
                showSave:           false
            });
            return;
        }
        if (gameName == "url") {
            loadGame({
                gameName:   "url",
                sgfUrl:     "php/fetch.php?url=" + hash.replace(/^#?url:/, "")
            });
            return;
        }
        if (gameName == "search") {
            if (loadPath) {
                loadGame({showSave: false});
                player.loadSearch.apply(player, rest);
            } else {
                loadGame({
                    gameName:   "search",
                    showSave:   false,
                    loadPath:   [0,0]
                });
            }
            return;
        }
        if (gameName.indexOf("gnugo") === 0) {
            var params = {
                gameName:       "",
                opponentUrl:    "php/gnugo.php",
                opponentColor:  "B"
            };
            var parts = gameName.split("-");
            if (parts[1]) {
                params.boardSize = parts[1];
            }
            loadGame(params);
            return;
        }
        loadGame({
            gameName:   gameName,
            loadPath:   loadPath
        });
    }
    
    function addHistory(hash) {
        if (dhtmlHistory.isSafari) {
            // this doesn't really work, but oh well
            location.hash = hash;
        } else {
            dhtmlHistory.add(hash);
        }
    }
    
    window.dhtmlHistory.create({
        toJSON: function(o) {
            return JSON.stringify(o);
        },
        fromJSON: function(s) {
            return JSON.parse(s);
        }
    });
    
    eidogo.util.addEvent(window, "load", function() {
        eidogo.util.addEvent(document, "click", function(evt) {
            var target = eidogo.util.getTarget(evt)
            if (target.nodeName.toUpperCase() != "A" || target.href.indexOf("#") == -1) return true;
            var hash = target.href.replace(/^.*#/, "");
            addHistory(hash);
            loadState(hash);
            eidogo.util.stopEvent(evt);
        });
        dhtmlHistory.initialize();
        dhtmlHistory.addListener(loadState);
        if (notLoaded) {
            // make sure we load our state on first page load (RSH quirk)
            loadState(location.hash.replace(/^#/, ""));
        }
    }); 
    
})();