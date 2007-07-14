<?php

// safety checks
$q = preg_replace("/[^nsew]/", "", $_GET['q']);
$w = (int)$_GET['w'];
$h = (int)$_GET['h'];
$p = preg_replace("/[^\.OX]/", "", $_GET['p']);
$a = preg_replace("/[^a-z]/", "", $_GET['a']);

$output = null;
$retval = null;

exec("../kombilo/search.py " .
    escapeshellcmd($q) . " " .
    escapeshellcmd($w) . " " .
    escapeshellcmd($h) . " " .
    escapeshellcmd($p) . " " .
    escapeshellcmd($a),
    $output, $retval);

if ($retval) {
    echo "Error searching database.";
    exit;
}

if (!count($output)) {
    echo "No games found matching the given pattern.";
    exit;
}

// echo "<table>
//     <tr>
//     <th>White</th>
//     <th>Black</th>
//     <th>Result</th>
//     <th>Date</th>
//     <th>&nbsp;</th>
//     </tr>";

echo "<p class='search-count'><span>" . count($output) . "</span> matches found.</p>";

echo "<div class='search-results'>";
echo "<div class='search-result'>
    <span class='pw'><b>White</b></span>
    <span class='pb'><b>Black</b></span>
    <div class='clear'></div>
    </div>";

$odd = true;

foreach ($output as $line) {
    list($fn, $pw, $pb, $re, $dt, $mv) = split("\t", $line);
    $id = str_replace(".sgf", "", $fn);
    $mv = split(",", $mv);
    $mv = (int)$mv[count($mv)-2];
    $href = "/eidogo/games/$id#0,$mv";
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

// echo "</table>";
echo "</div>";

?>