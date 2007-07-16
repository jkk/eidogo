<?php

$kombilo_dir = "../kombilo";

// safety checks
$q = preg_replace("/[^nsew]/", "", $_GET['q']);
$w = (int)$_GET['w'];
$h = (int)$_GET['h'];
$p = preg_replace("/[^\.OX]/", "", $_GET['p']);
$a = preg_replace("/[^a-z]/", "", $_GET['a']);

$output = null;
$retval = null;

$cache_fn = "$kombilo_dir/cache/$q-$w-$h-$p-$a";
if (file_exists($cache_fn)) {
    $output = array();
    $fp = @fopen($cache_fn, "r");
    while (!feof($fp)) {
        $output[] = fgets($fp);
    }
    fclose($fp);
    if ($output[0] == "") {
        $output = null;
    }
    $retval = 0;
} else {
    exec("$kombilo_dir/search.py " .
        escapeshellcmd($q) . " " .
        escapeshellcmd($w) . " " .
        escapeshellcmd($h) . " " .
        escapeshellcmd($p) . " " .
        escapeshellcmd($a),
        $output, $retval);
    file_put_contents($cache_fn, join("\n", $output));
}

if ($retval) {
    echo "Error searching database.";
    exit;
}

if (!count($output)) {
    echo "No games found matching the given pattern.";
    exit;
}

if (count($output) > 150) {
    $output = array_slice($output, 0, 150);
}

echo "<p class='search-count'><span>" . count($output) . "</span> matches found.</p>";

echo "<div class='search-results'>";
echo "<div class='search-result'>
    <span class='pw'><b>White</b></span>
    <span class='pb'><b>Black</b></span>
    <span class='re'><b>Result</b></span>
    <span class='dt'><b>Date</b></span>
    <div class='clear'></div>
    </div>";

$odd = true;

foreach ($output as $line) {
    list($fn, $pw, $pb, $re, $dt, $mv) = split("\t", $line);
    $id = str_replace(".sgf", "", $fn);
    $mv = split(",", $mv);
    $mv = (int)$mv[count($mv)-2] - 1;
    $href = "javascript:player.loadPath=[0,$mv];player.remoteLoad(\"sgf/games/$id.sgf\")";
    echo "<div class='search-result" . ($odd ? " odd" : ""). "'>
        <a href='$href'>
        <span class='pw'>$pw</span>
        <span class='pb'>$pb</span>
        <span class='re'>$re</span>
        <span class='dt'>$dt</span>
        <div class='clear'>&nbsp;</div>
        </a>
        </div>";
    $odd = $odd ? false : true;
}

echo "</div>";

?>