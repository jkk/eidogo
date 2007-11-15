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
    
    var path = (autoCfg.playerPath || 'player').replace(/\/$/);
    
    if (!autoCfg.skipCss) {
        eidogo.util.addStyleSheet(path + '/css/player.css');
        var isIE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
        if (isIE6) {
            eidogo.util.addStyleSheet(path + '/css/player-ie6.css');
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