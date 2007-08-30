var player;

(function() {
    
    // To Detect iPhone Safari (420+) and Safari 3 (500+)
    var sfVersion = parseInt(jQuery.browser.version, 10);
    var safari2 = (jQuery.browser.safari && sfVersion < 420);
    
    // Provide handlers for frontend things (page title, permalinks) that
    // aren't handled by Player directly
    var hooks = {
        initGame: function() {
            var gameRoot = this.gameTree.trees.first().nodes.first();
            if (this.gameName == "kjd" || this.gameName == "gnugo" || this.gameName == "search") {
                eidogo.util.hide(this.dom.optionSave);
                eidogo.util.hide(this.dom.optionDownload);
            } else {
                eidogo.util.show(this.dom.optionSave);
                eidogo.util.show(this.dom.optionDownload);
            }
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
            jQuery.historyLoad(hash);
        },
        searchRegion: function(params) {
            this.hooks.initGame.call(this); // update title
            var hash = "search:" + params.q + ":" + params.w + "x" + params.h +
                ":" + this.compressPattern(params.p) + ":" + params.a;
            if (hash != location.hash.replace(/^#/, "")) {
                jQuery.historyLoad(hash);
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
            domId:              "player-container",
            mode:               "play",
            sgfPath:            "sgf/",
            progressiveLoad:    false,
            searchUrl:          "php/search.php",
            saveUrl:            "php/save.php",
            markCurrent:        true,
            markVariations:     true,
            markNext:           false,
            showGameInfo:       true,
            showPlayerInfo:     true,
            hooks:              hooks
        };
        for (var key in params) {
            cfg[key] = params[key];
        }
        if (!player) {
            player = new eidogo.Player(cfg);
        } else {
            if (cfg.sgfUrl) {
                params.gameName = cfg.sgfUrl;
                player.gameName = cfg.gameName;
            }
            player.remoteLoad(params.gameName, null, !cfg.sgfUrl, params.loadPath, completeFn);
        }
    }
    
    // All our input comes from the URL hash
    function parseHash(hash) {
        var hashParts = hash ? hash.replace(/^#/, "").split(/:/) : [];
        var loadPath = null;
        if (hashParts[1]) {
            loadPath = hashParts[1].split(",");
        }
        return [hashParts[0] || "", loadPath, hashParts.slice(1)];
    }
    
    // Start things up
    function init() {
        var params;
        var input = parseHash(location.hash);
        var gameName = input[0];
        var loadPath = input[1];
        var rest = input[2];
        
        if (gameName.indexOf("gnugo") === 0) {
            params = {
                gameName:       "",
                opponentUrl:    "php/gnugo.php",
                opponentColor:  "B"
            };
            var parts = gameName.split(";");
            if (parts[1]) {
                params.boardSize = parts[1];
            }
        } else if (gameName == "search") {
            if (safari2) {
                // Safari 2 is broken; provide a workaround
                hooks.initDone = function() {
                    if (loadPath) {
                        player.loadSearch.apply(player, rest);
                    }
                }
                params = {
                    gameName:   "search",
                    loadPath:   [0,0]
                };
            }
        } else if (gameName == "url") {
            params = {
                gameName:   "url",
                sgfUrl:     "php/fetch.php?url=" + location.hash.replace(/^#?url:/, "")
            };
        } else if (gameName != "" && gameName != "kjd") {
            params = {
                gameName:   gameName,
                loadPath:   loadPath
            };
        } else if (gameName == "kjd") {
            params = {
                gameName:           "kjd",
                sgfUrl:             "php/kjd_progressive.php",                
                loadPath:           loadPath,
                progressiveLoad:    true,
                markNext:           true,
                showPlayerInfo:     false
            };
        }
        
        var first = true;
        
        jQuery.historyInit(function(hash) {
            if (safari2) return; // safari 2 sucks
            
            if (first) {
                first = false;
                return;
            }
            
            eidogo.util.show('player-container');
            
            var input = parseHash(hash);
            var gameName = input[0];
            var loadPath = input[1];
            var rest = input[2];
            if (gameName.indexOf("gnugo") === 0) return;
            
            if (typeof gameName != "undefined" && gameName != player.gameName) {
                if (!gameName) {
                    eidogo.util.hide('player-container');
                    eidogo.util.show('text-content');
                    return;
                } else if(gameName == "kjd") {
                    location.href = "kjd";
                } else if (gameName == "url") {
                    loadGame({
                        gameName:   "url",
                        sgfUrl:     "php/fetch.php?url=" + hash.replace(/^#?url:/, "")
                    });
                    return;
                } else if (gameName == "search" && loadPath) {
                    player.loadSearch.apply(player, rest);
                    return;
                }
                loadGame({
                    gameName:   gameName,
                    loadPath:   loadPath
                });
            }
        });
        
        if (location.pathname == "/" && !gameName) {
            eidogo.util.hide('player-container');
            eidogo.util.show('text-content');
        } else {
            eidogo.util.show('player-container');
            eidogo.util.hide('text-content');
        }
        
        loadGame(params);
        
        if (gameName) {
            jQuery.historyLoad(location.hash.replace(/^#/, ""));
        }

    }
    
    if (location.pathname == "/") {
       eidogo.util.addEvent(window, "load", init); 
    }
    
})();