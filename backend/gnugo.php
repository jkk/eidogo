<?php
// Disable for now
echo "tt";
exit;

if ($_SERVER['HTTP_HOST'] == "eidogo.com") {
    define("PATH_GNUGO", "/usr/bin/nice -n 20 /var/www/eidogo.com/gnugo/interface/gnugo");
} else {
    define("PATH_GNUGO", "/usr/bin/nice -n 20 /Users/tin/Sites/eidogo/gnugo/gnugo/interface/gnugo");
}

$sgf = $_REQUEST['sgf'];
$color = $_REQUEST['move'] == "W" ? "W" : "B";
$size = (int)$_REQUEST['size']; // needed for coordinate conversion
$komi = (float)($_REQUEST['komi'] ? $_REQUEST['komi'] : 0);
$mn = (int)$_REQUEST['mn'];

// give gnugo our current game state
$sgf_file = tempnam("/tmp", "eidogo");
file_put_contents($sgf_file, $sgf);

if ($_REQUEST['move'] == "est") {
    $result= shell_exec(PATH_GNUGO . " --score --komi $komi --infile $sgf_file --until $mn");
    unlink($sgf_file);
    echo $result;
    exit;
}

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