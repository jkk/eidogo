<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>EidoGo - SGF Replayer</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" href="/eidogo/site-style.css">
<link rel="stylesheet" href="/eidogo/player/player.css">
<!--[if IE 6]>
<style type="text/css">
.eidogo-player .board .point.stone.black {
	background: none;
	filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="/eidogo/player/images/b.png");
}
.eidogo-player .board .point.stone.white {
	background: none;
	filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="/eidogo/player/images/w.png");
}
</style>
<![endif]-->

<!--
    For international support, uncomment the following line and put in the
    appropriate language code (see the 'player/i18n' folder).
-->
<!-- <script type="text/javascript" src="player/i18n/pt_br.js"></script> -->

<!-- <script type="text/javascript" src="player/player.compressed.js"></script> -->

<!--
    Uncomment the following to work with the original source.
-->
<script type="text/javascript" src="/eidogo/js/yui-util.js"></script>
<script type="text/javascript" src="/eidogo/js/lang.js"></script>
<script type="text/javascript" src="/eidogo/js/eidogo.js"></script>
<script type="text/javascript" src="/eidogo/js/util.js"></script>
<script type="text/javascript" src="/eidogo/js/i18n.js"></script>
<script type="text/javascript" src="/eidogo/js/gametree.js"></script>
<script type="text/javascript" src="/eidogo/js/sgf.js"></script>
<script type="text/javascript" src="/eidogo/js/board.js"></script>
<script type="text/javascript" src="/eidogo/js/rules.js"></script>
<script type="text/javascript" src="/eidogo/js/player.js"></script>

<?php
$in = $_SERVER['QUERY_STRING'];
if (!$in || $in == "kjd") {
	$cfg = array(
		"domId"				=> "player-container",
		"mode"				=> "play",
		"sgfUrl"			=> "/eidogo/php/kjd_progressive.php",
		"gameName"          => "kjd",
		"searchUrl"         => "/eidogo/php/search.php",
		"sgfPath"           => "/eidogo/sgf/",
		"progressiveLoad"	=> true,
		"markCurrent"		=> true,
		"markVariations"	=> true,
		"markNext"			=> true,
		"showGameInfo"		=> true,
		"showPlayerInfo"	=> false,
	);
} else {
	$cfg = array(
		"domId"				=> "player-container",
		"mode"				=> "play",
		"progressiveLoad"	=> false,
		"searchUrl"         => "/eidogo/php/search.php",
		"markCurrent"		=> true,
		"markVariations"	=> true,
		"markNext"			=> false,
		"showGameInfo"		=> true,
		"showPlayerInfo"	=> true,
	);
	if (strpos($in, "gnugo") === 0) {
	    $cfg['opponentUrl'] = "/eidogo/php/gnugo.php";
	    $cfg['opponentColor'] = "B";
	    list(, $size) = split(";", $in);
	    if ($size) {
	        $cfg['boardSize'] = (string)(int)$size;
	    }
	} elseif (strpos($in, "games/") === 0) {
	    $cfg['sgfUrl'] = "/eidogo/games.php?id=" . str_replace("games/", "", $in);
	} elseif ($in != "blank") {
	    $cfg['sgfPath'] = "/eidogo/sgf/";
	    $cfg['gameName'] = $in;
	    //$cfg['sgfUrl'] = "/eidogo/sgf/$in.sgf";
	}
}
?>
<script type="text/javascript">

var player;

YAHOO.util.Event.on(window, "load", function() {
	var cfg = <?php echo json_encode($cfg); ?>;
	cfg.loadPath = location.hash.replace(/^#/, "").split(/,/);
	/*var hashParts = location.hash ? location.hash.replace(/^#/, "").split(/:/) : [];
	var loadPath = null;
	if (hashParts[1]) {
	    loadPath = hashParts[1].split(",");
	}
	if (hashParts.length && hashParts[0] != "kjd") {
	    cfg = {
	        domId:              "player-container",
	        mode:               "play",
	        sgfPath:            "/eidogo/sgf/",
	        gameName:           hashParts[0],
	        loadPath:           loadPath,
	        progressiveLoad:    false,
	        searchUrl:          "/eidogo/php/search.php",
	        markCurrent:        true,
	        markVariations:     true,
	        markNext:           false,
	        showGameInfo:       true,
	        showPlayerInfo:     true
	    }
	} else {
	    cfg = {
	        domId:              "player-container",
	        mode:               "play",
	        sgfUrl:             "/eidogo/php/kjd_progressive.php",
	        sgfPath:            "/eidogo/sgf/",
	        gameName:           "kjd",
	        loadPath:           loadPath,
	        progressiveLoad:    true,
	        searchUrl:          "/eidogo/php/search.php",
	        markCurrent:        true,
	        markVariations:     true,
	        markNext:           true,
	        showGameInfo:       true,
	        showPlayerInfo:     false
	    }
	}*/
	player = new eidogo.Player(cfg);
});

</script>

</head>
<body>

<div id="container">
    
    <div id="header">

        <h1>Eido<span>Go</span></h1>

        <p id="ownership">EidoGo is <a href="source.html">Open Source</a>.
            &nbsp;Maintained by <a href="http://tin.nu/">Justin Kramer</a>.</p>

        <ul id="links">
        	<li><a href="/eidogo/kjd">Joseki Tutor</a></li>
        	<li><a href="/eidogo/games">Game Archive</a></li>
        	<li><a href="/eidogo/search">Pattern Search</a></li>
        	<li><a href="/eidogo/gnugo">GNU Go</a>
        	<li><a href="/eidogo/blank">Blank Board</a></li>
        	<li><a href="/eidogo/upload">Upload</a></li>
        	<li><a href="http://senseis.xmp.net/?EidoGo">Info</a></li>
        </ul>

    </div>

    <div id="content">

        <div id="player-container"></div>

    </div>

</div>

</body>
</html>