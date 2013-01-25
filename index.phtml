<?php include("header.phtml"); ?>

<script type="text/javascript" src="js/rsh.compressed.js"></script>

<div id="options"></div>

<div id="options-joseki" style="display: none">
    <strong>Joseki Tutor:</strong>
    <a href="/#kjd">Kogo's Joseki Dictionary</a> |
    <a href="/#kombilo">Kombilo / Pro Game Database</a>
</div>

<div id="options-gnugo" style="display: none">
    <strong>GNU Go</strong>
    &nbsp;&nbsp;&nbsp;&nbsp; Board Size:
    <a href="/#gnugo">19x19</a> |
    <a href="/#gnugo-9">9x9</a> |
    <a href="/#gnugo-13">13x13</a>
    &nbsp;&nbsp; Your Color: <select id="human-color">
        <option value="W">White</option>
        <option value="B">Black</option>
    </select>
    &nbsp;&nbsp; Handicap: <select id="handicap">
        <option value="0">None</option>
        <option value="1">1 stone</option>
        <option value="2">2 stones</option>
        <option value="3">3 stones</option>
        <option value="4">4 stones</option>
        <option value="5">5 stones</option>
        <option value="6">6 stones</option>
        <option value="7">7 stones</option>
        <option value="8">8 stones</option>
        <option value="9">9 stones</option>
    </select>
</div>

<div id="options-blank" style="display: none">
    <strong>Blank Board:</strong>
    <a href="/#blank">19x19</a> |
    <a href="/#blank-9">9x9</a> |
    <a href="/#blank-13">13x13</a>
</div>

<div id="player-container"></div>

<script type="text/javascript">

var player;

(function() {
    
    var byId = eidogo.util.byId,
        hide = eidogo.util.hide,
        show = eidogo.util.show,
        addEvent = eidogo.util.addEvent;
    
    // Provide handlers for frontend things (page title, permalinks) that
    // aren't handled by Player directly
    var hooks = {
        initGame: function() {
            document.title = "EidoGo - " + this.getGameDescription();
        },
        showGameInfo: function(info) {
            if (this.gameName == "kjd") {
                ['KM', 'HA', 'CP', 'DT'].forEach(function(p) { delete info[p]; });
                info.GC = "Available from " +
                    "<a href='http://waterfire.us/joseki.htm'>http://waterfire.us/joseki.htm</a><br><br>" +
                    "KJD Copyright 2006-2007 by Andre Ay. Copyright 1998-2005 " +
                    "by Gary Odom. Portions copyright 2000-2001 by Stefan " +
                    "Verstraeten. Used with permission.";
            } else if (this.gameName == "kombilo") {
                info.GN = "Kombilo / Pro Game Database";
                info.GC = "Continuations derived from around 10,000 pro games.\n\n" +
                    "Since the continuations are computed automatically, there is a certain " +
                    "amount of spurious, non-fuseki moves included.";
            }
        },
        setPermalink: function() {
            if (!this.gameName || ['search', 'gnugo', 'url'].contains(this.gameName)) return;
            var gn = this.gameName || "";
            // Use move-based path for josekis to future-proof permalinks
            var path = (gn == "kjd" || gn == "kombilo" ?
                this.cursor.getPathMoves().join("") :
                this.cursor.getPath().join(","));
            var hash = gn + (path ? ":" + path : "");
            addHistory(hash);
        },
        searchRegion: function(params) {
            this.hooks.initGame.call(this); // update title
            var hash = "search:" + params.q + ":" + params.w + "x" + params.h +
                ":" + this.compressPattern(params.p);
            if (params.a && params.a != "corner") hash += ":" + params.a;
            if (hash != location.hash.replace(/^#/, ""))
                addHistory(hash);
        },
        saved: function(gn) {
            loadGame({gameName: gn, loadPath: [0,0]}, function() {
                var url = location.href.replace(/#[^#]+$/, "") + "#" + this.gameName;
                this.setPermalink();
                this.prependComment("Game saved to <a href='" + url + "'>" + url + "</a>");
            }.bind(this));
        }
    };
    
    // Load game data; create a Player instance if necessary
    function loadGame(params, completeFn) {
        params = params || {};
        var cfg = {
            progressiveLoad:    false,
            markCurrent:        true,
            markVariations:     true,
            markNext:           false,
            showGameInfo:       true,
            showPlayerInfo:     true,
            showOptions:        true,
            showTools:          true,
            showNavTree:        true,
            problemMode:        false
        };
        for (var key in params) {
            cfg[key] = params[key];
        }
        if (!player) {
            player = new eidogo.Player({
                container:          "player-container",
                sgfPath:            "sgf/",
                searchUrl:          "backend/search.php",
                saveUrl:            "backend/save.php",
                downloadUrl:        "backend/download.php?id=",
                scoreEstUrl:        "",//"backend/gnugo.php",
                hooks:              hooks,
                enableShortcuts:    true
            });
            // Temporary notice for score est
            addEvent(player.dom.scoreEst, "click", function(e) {
                alert("Sorry, Score Estimate is temporarily unavailable.\n\nIt was using excessive server resources. If you have a server with lots of spare CPU cycles, let me know.");
                eidogo.util.stopEvent(e);
                return false;
            });
        }
        player.loadSgf(cfg, completeFn && completeFn.bind(player));
    }
    
    var notLoaded = true;
    
    // Perform the appriate loading action depending on what hash is given
    function loadState(hash) {
        notLoaded = false;
        var hashParts = hash ? hash.replace(/^#/, "").split(/:/) : [];
        var gameName = hashParts[0] || "";
        var loadPath = hashParts[1] ? hashParts[1].split(",") : null;
        var rest = hashParts.slice(1);
        
        hide("options");
        
        if (!gameName || gameName == "kjd" || gameName == "kombilo")
            loadJoseki(gameName, loadPath);
        else if (gameName == "url")
            loadUrl(hash.replace(/^#?url:/, ""));
        else if (gameName == "raw")
            loadRaw(decodeURIComponent(hash.replace(/^#?raw:/g, "").replace(/\+/g, " ")));
        else if (gameName == "search")
            loadSearch(rest);
        else if (gameName.indexOf("gnugo") === 0)
            loadGnuGo(gameName);
        else if (gameName.indexOf("blank") === 0)
            loadBlank(gameName);
        else
            loadGame({gameName: gameName, loadPath: loadPath});
    }
    
    function loadJoseki(gameName, loadPath) {
        byId("options").innerHTML = byId("options-joseki").innerHTML;
        show("options");
        if (loadPath) {
            // Parse moves out of string like "aepqnctt"
            var s = loadPath[0];
            var coord;
            loadPath = [];
            while (coord = s.substring(0, 2)) {
                loadPath.push(coord);
                s = s.substring(2);
            }
        }
        loadGame({
            gameName:           gameName || "kjd",
            progressiveUrl:     gameName == "kombilo" ? "backend/search.php" : "backend/kjd_progressive.php",
            loadPath:           loadPath,
            progressiveLoad:    true,
            progressiveMode:    gameName == "kombilo" ? "pattern" : "id",
            markNext:           true,
            showPlayerInfo:     false,
            showOptions:        false});
    }
    
    function loadSearch(args) {
        if (args.length) {
            loadGame({showOptions: false});
            player.loadSearch.apply(player, args);
        } else {
            loadGame({
                gameName:    "search",
                showOptions: false,
                loadPath:    [0,0]});
        }
    }
    
    function loadUrl(url) {
        loadGame({
            gameName:   "url",
            sgfUrl:     "backend/fetch.php?url=" + url});
    }
    
    function loadRaw(data) {
        loadGame({
            gameName:   "raw",
            sgf:        data});
    }
    
    function loadGnuGo(gameName) {
        loadGame({gameName: ""}, function() {
            this.showComments("<p>Sorry, GNU Go is temporarily unavailable.</p><p>It was using excessive server resources. If you have a server with lots of spare CPU cycles, let me know.</p>");
        });
        return;
        byId("options").innerHTML = byId("options-gnugo").innerHTML;
        show("options");
        var params = {
            gameName:       "",
            opponentUrl:    "backend/gnugo.php",
            opponentColor:  "B",
            opponentLevel:  7,
            handicap:       0
        };
        var parts = gameName.split("-");
        if (parts[1])
            params.boardSize = parts[1];
        var inputColor = byId("human-color"),
            inputHandi = byId("handicap");
        var changeHandler = function() {
            params.opponentColor = inputColor.value == "W" ? "B" : "W";
            params.handicap = inputHandi.value;
            loadGame(params);
        }
        addEvent(inputColor, "change", changeHandler);
        addEvent(inputHandi, "change", changeHandler);
        loadGame(params);
    }
    
    function loadBlank(gameName) {
        byId("options").innerHTML = byId("options-blank").innerHTML;
        show("options");
        loadGame({gameName: gameName});
    }
    
    function addHistory(hash) {
        // Safari 2 sucks
        if (dhtmlHistory.isSafari)
            location.hash = hash;
        else
            dhtmlHistory.add(hash);
    }
    
    // Appease RSH
    window.dhtmlHistory.create({
        toJSON: function(o) { return ''; },
        fromJSON: function(s) { return {}; }});

    // Ajaxify our links
    addEvent(document, "click", function(evt) {
        var target = eidogo.util.getTarget(evt)
        if (target.nodeName.toUpperCase() != "A" || target.href.indexOf("#") == -1) return true;
        var hash = target.href.replace(/^.*#/, "");
        addHistory(hash);
        player.closeSearch();
        loadState(hash);
        eidogo.util.stopEvent(evt);
    });
    
    dhtmlHistory.initialize();
    dhtmlHistory.addListener(loadState);
    
    // Make sure we load our state on first page load (RSH quirk)
    if (notLoaded)
        loadState(location.hash.replace(/^#/, ""));
    
})();

</script>

<?php include("footer.phtml"); ?>