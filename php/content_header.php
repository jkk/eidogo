<?php
$pathinfo = pathinfo($_SERVER['PHP_SELF']);
$extension = $pathinfo['extension'];

if ($extension == "css") {
	header("Content-type: text/css");
}

if ($extension == "js") {
	header("Content-type: text/javascript");
}
?>