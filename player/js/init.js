/**
 * EidoGo -- Web-based SGF Replayer
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Initialize things for EidoGo to function: stylesheets, etc
 */

/**
 * Search for DIV elements with the class 'eidogo-player-auto' and insert a
 * Player into each.
**/
(function() {
    
    var autoCfg = window.eidogoConfig || {};

    // auto-detect path of player folder
    var scripts = document.getElementsByTagName('script');
    var scriptPath;
    [].forEach.call(scripts, function(script) {
        if (/(all\.compressed\.js|eidogo\.js)/.test(script.src)) {
            scriptPath = script.src.replace(/\/js\/[^\/]+$/, "");
        }
    });
    
    var path = (autoCfg.playerPath || scriptPath || 'player').replace(/\/$/);
    
    if (!autoCfg.skipCss) {
        eidogo.util.addStyleSheet(path + '/css/player.css');
        var isIE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
        if (isIE6) {
            eidogo.util.addStyleSheet(path + '/css/player-ie6.css');
        }
        autoCfg.theme = autoCfg.theme || "compact";
        if (autoCfg.theme && autoCfg.theme != "standard") {
            eidogo.util.addStyleSheet(path + '/css/player-' + autoCfg.theme + '.css');
        }
    }
    
    eidogo.util.addEvent(window, "load", function() {        
        
        eidogo.autoPlayers = [];
        var els = eidogo.util.byClass("eidogo-player-auto");
        
        [].forEach.call(els, function(el) {
        
            var cfg = {container: el, disableShortcuts: true};
            for (var key in autoCfg) {
                cfg[key] = autoCfg[key];
            }
            
            var sgfUrl = el.getAttribute('sgf');
            if (sgfUrl) cfg.sgfUrl = sgfUrl;
            else if (el.innerHTML) cfg.sgf = el.innerHTML;
            
            el.innerHTML = "";
            eidogo.util.show(el);
            
            var player = new eidogo.Player(cfg);
            eidogo.autoPlayers.push(player);
        });
        
    });
    
})();