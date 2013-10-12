YUI({filter: 'debug'}).use( , function(Y) {
    window.player = new Y.Eidogo.Player({
        srcNode: '#goban',
        sgf: sgfData
    });
    

    
    window.player.loadSgf();
});