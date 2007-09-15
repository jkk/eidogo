<?php
$pathinfo = pathinfo($_SERVER['PHP_SELF']);
$extension = $pathinfo['extension'];

if ($extension == "css") {
	header("Content-type: text/css");
}

if ($extension == "js") {
	header("Content-type: text/javascript");
}

if ($extension == "js" || $extension == "css") {
    //header("Content-length: " . filesize();
    header("Last-Modified: " . gmdate("D, d M Y H:i:s",mktime (0,0,0,1,1,2000)) . " GMT"); 
    header("Expires: Mon, 26 Jul 2040 05:00:00 GMT"); 
    header("Cache-Control: max-age=10000000, s-maxage=1000000, proxy-revalidate, must-revalidate, public");
}

?>