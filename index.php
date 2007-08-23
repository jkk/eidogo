<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>EidoGo - Go Games, Pattern Search, Joseki Tutor, SGF Editor</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" href="site-style.css">
<link media="only screen and (max-device-width: 480px)" rel="stylesheet" href="site-style-iphone.css">
<link rel="stylesheet" href="player/player.css">
<!--[if IE 6]>
<link rel="stylesheet" href="player/player-ie6.css">
<![endif]-->
<meta name="viewport" content="width=421, minimum-scale=0.76">
<link media="only screen and (max-device-width: 480px)" href="player/player-iphone.css" type="text/css" rel="stylesheet">
<!--
    For international support, uncomment the following line and put in the
    appropriate language code (see the 'player/i18n' folder).
-->
<!-- <script type="text/javascript" src="player/i18n/pt_br.js"></script> -->

<!-- <script type="text/javascript" src="player/player.compressed.js"></script> -->

<!--
    Uncomment the following to work with the original source.
-->
<!-- <script type="text/javascript" src="js/yui-dom-event.js"></script>
<script type="text/javascript" src="js/yui-connection.js"></script>
<script type="text/javascript" src="js/yui-history.js"></script> -->
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.dimensions.js"></script>
<script type="text/javascript" src="js/jquery.history.js"></script>
<script type="text/javascript" src="js/lang.js"></script>
<script type="text/javascript" src="js/eidogo.js"></script>
<script type="text/javascript" src="js/util.js"></script>
<script type="text/javascript" src="js/i18n.js"></script>
<script type="text/javascript" src="js/gametree.js"></script>
<script type="text/javascript" src="js/sgf.js"></script>
<script type="text/javascript" src="js/board.js"></script>
<script type="text/javascript" src="js/rules.js"></script>
<script type="text/javascript" src="js/player.js"></script>

<script type="text/javascript">

var player;

(function() {
    
    // To Detect iPhone Safari (420+) and Safari 3 (500+)
    var sfVersion = parseInt(jQuery.browser.version, 10);
    
    // Provide handlers for frontend things (page title, permalinks) that
    // aren't handled by Player directly
    var hooks = {
        initGame: function() {
            var gameRoot = this.gameTree.trees.first().nodes.first();
            if (this.gameName == "kjd" || this.gameName == "gnugo" || this.gameName == "search") {
                this.dom.optionSave.style.display = "none";
                this.dom.optionDownload.style.display = "none";
            } else {
                this.dom.optionSave.style.display = "block";
                this.dom.optionDownload.style.display = "block";
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
            if (jQuery.browser.safari && sfVersion < 420) {
                // Safari 2 is broken; provide a workaround
                hooks.initDone = function() {
                    player.loadSearch.apply(player, rest);
                }
                loadGame({
                    gameName:   "blank",
                    loadPath:   [0,0]
                });
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
        } else {
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
            if (jQuery.browser.safari && sfVersion < 420) return; // safari 2 sucks
            
            if (first) {
                first = false;
                return;
            }
            var input = parseHash(hash);
            var gameName = input[0];
            var loadPath = input[1];
            var rest = input[2];
            if (gameName.indexOf("gnugo") === 0) return;
            if (typeof gameName != "undefined" && gameName != player.gameName) {
                if (!gameName || gameName == "kjd") {
                    location.href = "kjd";
                } else if (gameName == "url") {
                    loadGame({
                        gameName:   "url",
                        sgfUrl:     "php/fetch.php?url=" + hash.replace(/^#?url:/, "")
                    });
                    return;
                } else if (gameName == "search" && loadPath) {
                    // alert(rest);
                    player.loadSearch.apply(player, rest);
                    return;
                }
                loadGame({
                    gameName:   gameName,
                    loadPath:   loadPath
                });
            }
        });
        
        loadGame(params);
        
        if (!jQuery.browser.safari || (jQuery.browser.safari && sfVersion >= 420)) {
            jQuery.historyLoad(location.hash.replace(/^#/, ""));
        }

    }
    
    eidogo.util.addEvent(window, "load", init);
    
})();

</script>

</head>
<body>
    
<div id="container">
    
    <div id="header">

        <h1>Eido<span>Go</span></h1>

        <p id="ownership">EidoGo is <a href="source.html">Open Source</a>.
            &nbsp;Maintained by <a href="http://tin.nu/">Justin Kramer</a>.</p>

        <ul id="links">
            <li><a href="kjd">Joseki Tutor</a></li>
            <!-- <li><a href="games">Game Archive</a></li> -->
            <li><a href="search">Pattern Search</a></li>
            <li><a href="gnugo" style='padding-right: 5px'>GNU Go</a></li>
            <li><a href="gnugo;9" style='padding-left: 5px; padding-right: 5px'>9x9</a></li>
            <li><a href="gnugo;13" style='padding-left: 5px'>13x13</a></li>
            <li><a href="blank">Blank Board</a></li>
            <!-- <li><a href="upload">Upload</a></li> -->
            <li><a href="http://senseis.xmp.net/?EidoGo">Info</a></li>
        </ul>

    </div>

    <div id="content">

        <div id="player-container"></div>

    </div>

</div>

</body>
</html>