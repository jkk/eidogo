YUI.GlobalConfig = 
    {
        filter: 'raw',
    };

YUI({ filter: 'debug' }).use(  function(Y)
			     {
				 var params = {};
				 
				 /*window.player = new Y.Eidogo.Player({
				     srcNode:       "#goban",
				     renderer:        new Y.Eidogo.Renderers.CanvasRenderer({srcNode: '#goban'}),
				     sgfUrl:          "sgf/" + (params.sgf ? params.sgf : "example.sgf")
				 }); */
			     });