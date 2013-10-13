YUI().use('node','get', 'querystring-stringify-simple', 'eidogo-player', 'eidogo-toolbar','eidogo-navtree', function (Y) {
    var scriptName = /eidogo\.js$/i;

    //Find eidogo's path
    Y.all('script').each(function (node) {
        var script = node.getAttribute('src')
        if( scriptName.test(script) ) {
            script = script.split('/');
            script[script.length-1] = "";
            Y.Eidogo.Path = script.join('/');
        }
    });

    Y.one('body').addClass("yui3-skin-sam");
    
    Y.Get.css(Y.Eidogo.Path + 'css/eidogo.css',  function(err) {
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