<?php

$id = $_GET['id'];
$id = preg_replace("/[^a-zA-Z-_0-9]/", "", $id);

header("Content-Type: application/x-go-sgf; name=$id.sgf");
header("Content-Disposition: attachment; filename=$id.sgf");

if (file_exists("../sgf/$id.sgf")) {
    echo file_get_contents("../sgf/$id.sgf");
} elseif (file_exists("../sgf/games/$id.sgf")) {
   echo file_get_contents("../sgf/games/$id.sgf");
} elseif (file_exists("../sgf/saved/$id.sgf")) {
   echo file_get_contents("../sgf/saved/$id.sgf");
}

?>