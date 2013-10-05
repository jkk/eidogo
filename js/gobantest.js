YUI({filter: 'debug'}).use( 'eidogo-player', function(Y)
			    {
				var params = {};
				var sgfData = "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]\nRU[Japanese]SZ[19]KM[0.00]\nPW[White]PB[Black]AW[ed][hd][eg][hg]AB[fe][ge][ff][gf]\n;B[aa]\n(;W[ab]\n;B[ba]\n;W[bb]CR[eg][eh][ei]LB[ca:B][da:A][ef:1][ff:2][gf:3]TR[hd][id][jd][je]SQ[cd][dd][ed]C[what to do?]\n(;B[da]C[jump!]\n(;W[ca]TR[da]C[marked stone is stupid])\n(;W[cb]\n;B[ea]\n;W[ca]))\n(;B[ca]C[run!]\n;W[cb]\n;B[ea]\n;W[da])\n(;B[]C[give up!]\n;W[ca]))\n(;AE[ed][hd][fe][ge][ff][gf][eg][hg]))\n";

				window.player = new Y.Eidogo.Player({
				    srcNode:       "#goban",
				    renderer:  Y.Eidogo.Renderers.CanvasRenderer,
				    sgf:          sgfData
				}); 
			    });