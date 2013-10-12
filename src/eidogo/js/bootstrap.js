YUI().use('node','querystring-stringify-simple', 'eidogo-player', 'eidogo-toolbar','eidogo-navtree', function (Y) {
    Y.one('body').addClass("yui3-skin-sam");
    
    for(div in  Y.all('div.eidogo-player') )
    {
        var doComments = JSON.parse(div.getAttribute("eidogo-show-comments"));
        var doToolbar = JSON.parse(div.getAttribute("eidogo-show-toolbar"));
        var doNavtree = JSON.parse(div.getAttribute("eidogo-show-navtree"));
        
        var sgfUrl = div.getAttribute("eidogo-sgf-url");
        var sgfData = div.get('text');;

        div.set('text', ''); //Prevent sgf data from displaying.

        div.append("<div class='eidogo-canvas'></div>");
        doToolbar && div.append("<div class='eidogo-toolbar'></div>");
        doComments && div.append("<div class='eidogo-comments'></div>");
        doNavtree && div.append("<div class='eidogo-navtree'></div>");

        var prefs = {
            srcNode: div.one("eidogo-canvas"),
            sgfUrl:sgfUrl,
            sgfData: sgfData 
        };
        
        var player = new Y.Eidogo.Player(prefs);
        
        player.on('execNode', function (e) 
                  {
                      div.one('eidogo-comments').setHTML('<p><b>Move ' + window.player.moveNumber + ': </b>' + window.player.comments + '</p>');
                  });
        
        doToolbar && new Y.Eidogo.Toolbar({srcNode: div.one('.eidogo-toolbar'), player:player});
        doNavtree && new Y.Eidogo.NavTree({srcNode: div.one('.eidogo-navtree'), player:player});  
    }
});