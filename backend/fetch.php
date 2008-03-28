<?php

$url = $_GET['url'];
$content = file_get_contents($url);
if (strlen($content) > 30000) {
    // ~30 KB limit
    exit;
}
echo $content;

?>