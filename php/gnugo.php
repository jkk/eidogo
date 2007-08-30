<?php

if ($_SERVER['HTTP_HOST'] == "eidogo.com") {
    define("PATH_GNUGO", "/usr/games/gnugo");
} else {
    define("PATH_GNUGO", "/opt/local/bin/gnugo");
}

$sgf = $_REQUEST['sgf'];
$color = $_REQUEST['color'] == "W" ? "W" : "B";
$size = (int)$_REQUEST['size']; // needed for coordinate conversion

// give gnugo our current game state
$sgf_file = tempnam("/tmp", "eidogo");
file_put_contents($sgf_file, $sgf);

// tell gnugo to generate a move
$command_file = tempnam("/tmp", "eidogo");
file_put_contents($command_file, "genmove $color\nquit\n");

$result = shell_exec(PATH_GNUGO . " --level 7 --mode gtp --infile $sgf_file --gtp-input $command_file");

unlink($sgf_file);
unlink($command_file);

$move = substr($result, 2, strpos($result, "\n")-2);

if (preg_match("/([A-Z])([0-9]+)/", $move, $matches)) {
    // convert the move to SGF coordinates
    list(,$x, $y) = $matches;
    $x = strtolower($x);
    if (ord($x) >= ord('i')) {
        $x = chr(ord($x)-1);
    }
    $y = chr(($size - $y) + ord('a'));
    echo "$x$y";
} elseif ($move == "PASS") {
    echo "tt";
} elseif (strpos($move, "resign") !== false) {
    echo "resign";
} else {
    echo $result;
}


?>