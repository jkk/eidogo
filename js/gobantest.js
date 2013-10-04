YUI.GlobalConfig = 
    {
        filter: 'raw',
	modules:
	{
	    
	}
    };

YUI({ filter: 'debug' }).use('eidigo-player', 'eidigo-graphicrenderer', function(Y)
			     {
				 var params = {};
				 
				 window.player = new Y.Eidogo.Player({
				     srcNode:       "#goban",
				     renderer:        new Y.Eidogo.GraphicRenderer({srcNode: '#goban'}),
				     sgfUrl:          "sgf/" + (params.sgf ? params.sgf : "example.sgf")
				 }); 
			     });