<?php
require("sgf.php");
require("json.php");

$filename = preg_replace("/[^0-9a-zA-Z _\-\.]/", "", $_REQUEST['file']);

if (file_exists("../sgf/$filename.serialized")) {
	$sgf = unserialize(file_get_contents("../sgf/$filename.serialized"));
	$json = new Services_JSON();
	echo $json->encode($sgf);
	exit;
} else {	
	$sgf = new SGF(file_get_contents("../sgf/$filename"));

	// modified pre-order tree transversal
	function mptt(&$tree, $lt) {
		$rt = $lt + 1;
	
		for ($i = 0; $i < count($tree['trees']); $i++) {
			$rt = mptt($tree['trees'][$i], $rt);
		}
	
		$tree['lt'] = $lt;
		$tree['rt'] = $rt;
	
		return $rt + 1;
	}

	mptt($sgf->tree, 1);

	$json = new Services_JSON();
	echo $json->encode($sgf->tree);
}
?>
