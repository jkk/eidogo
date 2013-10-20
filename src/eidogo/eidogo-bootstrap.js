/*
  Shammah Chancellor 2013
  This code should be appended to the eidogo.js minified output.   
  It will look for div's with the eidogo-player class and take them over.

  It also injects the eidogo-css into the page.
*/
EidogoConfig = {
    filter: 'raw',
    combine: 'false',
    groups: {
        eidogo: {
            base: 'build/', //Path to where you put the eidogo/ directory
            modules: {
                'eidogo': {
                    use: ["eidogo-lang", "eidogo-gametree", "eidogo-sgfparser", "eidogo-board", "eidogo-rules", "eidogo-renderer-canvas", "eidogo-toolbar", "eidogo-navtree", "eidogo-player" ]
                },
                'eidogo-lang': {
                    requires: ['intl'],
                    lang: ["en", "es", "de", "fr", "pt", "zh-Hans-CN"]
                },
                'eidogo-sgfparser': {
                    requires:  [ "eidogo-gametree" ]
                },
                'eidogo-board': {
                    requires:  [ "base", "eidogo-gametree" ]
                },
                'eidogo-rules': {
                    requires: [ ]
                },
                'eidogo-renderer-canvas': {
                    requires:[ "node", "widget", "event"  ]
                },
                'eidogo-gametree': {
                    requires: [ ]
                },
                'eidogo-navtree': {
                    requires: [ "node-base", "widget", "event", "eidogo-gametree"  ]
                },
                'eidogo-toolbar': {
                    requires:  [ "widget", "event", "node-base", "event", "button" ]
                },
                'eidogo-player': {
                    requires: [ "querystring-stringify-simple", "event", "node-base", "io", "eidogo-lang", "eidogo-gametree", "eidogo-sgfparser", "eidogo-renderer-canvas", "eidogo-board", "eidogo-rules" ]
                }
            }
        }
    }
}

YUI(EidogoConfig).use('node','get', 'eidogo', function (Y) {
    Y.one('body').addClass("yui3-skin-sam");

    //Inject our css
 
    Y.Get.css(EidogoConfig.groups.eidogo.base + 'css/eidogo.css',  function(err) {
        Y.all('div.eidogo-player').each( function(div) {
            //Load up the preferences for this eidogo-player
            var 
            doComments = JSON.parse(div.getAttribute("eidogo-show-comments") || 'true'),
            doToolbar = JSON.parse(div.getAttribute("eidogo-show-toolbar") || 'true'),
            doNavtree = JSON.parse(div.getAttribute("eidogo-show-navtree") || 'true'),
            doSidebar = true,
            player, prefs,
            sgfUrl = div.getAttribute("eidogo-sgf-url"),
            sgfData = div.get('text'),
            sideDiv;

            div.set('text', ''); //Prevent sgf data from displaying.
            div.addClass('eidogo-g-r');

            div.append("<div class='eidogo-canvas eidogo-u-2-3'></div>");
            if( doSidebar ) 
            { sideDiv =  div.appendChild("<div class='eidogo-sidebar eidogo-u-1-3'></div>");}
            else
            { sideDiv = div }

            if( doToolbar ) { sideDiv.append("<div class='eidogo-toolbar'></div>")}
            if( doComments ) { sideDiv.append("<div class='eidogo-comments'></div>"); }
            if( doNavtree ) { sideDiv.append("<div class='eidogo-navtree'></div>"); }
            
            prefs = {
                srcNode: div.one(".eidogo-canvas"),
                sgfUrl:sgfUrl,
                sgf: sgfData 
            };

            //TODO: Maybe we want to add some js property to the div, so we can find the player again later?
            
            player = new Y.Eidogo.Player(prefs);
            
            if (doComments) { 
                player.on('execNode', function (e) 
                          {
                              div.one('.eidogo-comments').setHTML('<p><b>Move ' + this.moveNumber + ': </b>' + this.comments + '</p>');
                          }, player);
            }
            
            if ( doToolbar ) { new Y.Eidogo.Toolbar({srcNode: div.one('.eidogo-toolbar'), player:player}); }
            if ( doNavtree ) { new Y.Eidogo.NavTree({srcNode: div.one('.eidogo-navtree'), player:player}); }

            player.loadSgf();
        }, this);
    });
});