YUI.GlobalConfig = 
    {
        filter: 'raw',
	modules:
	{
	    //   goban: '/js/goban.js'
	}
    };

YUI({ filter: 'debug' }).use('eidigo-player', 'eidigo-graphicrenderer', function(Y)
			     {
				 window.player = new Y.Eidogo.Player({
				     srcNode:       "#goban",
				     renderer:        new Y.Eidogo.GraphicRenderer({srcNode: '#goban'}),
				     sgfUrl:          "sgf/" + (params.sgf ? params.sgf : "example.sgf")
				 }); 
			     });