/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * Initialize things for EidoGo to function: stylesheets, etc
 */

/**
 * Search for DIV elements with the class 'eidogo-player-auto' and insert a
 * Player into each.
**/
(function() {
    
    var autoCfg = window.eidogoConfig || {};
    var scriptPath = eidogo.util.getPlayerPath();    
    var path = eidogo.playerPath = (autoCfg.playerPath || scriptPath || 'player').replace(/\/$/, "");
    
    var ua = navigator.userAgent.toLowerCase();
    var uav = (ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
    var isIE = /msie/.test(ua) && !/opera/.test(ua);
    
    if (!autoCfg.skipCss) {
        eidogo.util.addStyleSheet(path + '/css/player.css');
        if (isIE && parseInt(uav, 10) <= 6) {
            eidogo.util.addStyleSheet(path + '/css/player-ie6.css');
        }
    }
    
    eidogo.util.addEvent(window, "load", function() {        
        
        eidogo.autoPlayers = [];
        var els = [];
        var divs = document.getElementsByTagName('div');
        var len = divs.length;
        for (var i = 0; i < len; i++) {
            if (eidogo.util.hasClass(divs[i], "eidogo-player-auto")) {
                els.push(divs[i]);
            }
        }
        var el;
        for (var i = 0; el = els[i]; i++) {
            var cfg = {container: el, disableShortcuts: true, theme: "compact"};
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
        }
        
    });
    
})();