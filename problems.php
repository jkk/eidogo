<?php
$title = "Source Code";
include("header.phtml");

$collections = array(
    "qjzm"      => "Qi Jing Zhong Miao / Gokyo Shumyo",
    "xuanlan"   => "Xuanlan / Genran",
    "xxqj"      => "Xuan Xuan Qi Jing / Gengen Gokyo");

echo '<div id="text-content">';

list($dir, $num) = explode('/', $_GET['path']);
$dir = preg_replace("/[^a-z]/", "", $dir);
$num = (int)$num;

if ($dir && $collections[$dir] && $num) {
    
    echo "<h2><a href='/problems'>Go Problems</a>: " . $collections[$dir] . "</h2>";
    $sgfs = glob("sgf/problems/$dir/*.sgf");
    echo "<p>Problem " . $num . " of " . count($sgfs) . "</p>";
    echo '<div class="eidogo-player-problem" sgf="/' . $sgfs[$num-1] . '"></div>';
    if ($num < count($sgfs) - 1)
        echo "<p><big><a href='/problems/$dir/" . ($num+1) . "'>Next &raquo;</a></big></p>";
    
} else {
    
    echo "<h2>Go Problems</h2>";
    echo "<p>Note: responses are provided for the problems, but they will not
        tell you when you get it right. This area of the site is still
        being developed.</p>";
    echo "<ul>\n";
    foreach ($collections as $dir => $title) {
        echo "<li><p><a href='/problems/$dir/1'>$title</a></p></li>\n";
    }
    echo "</ul>\n";
}

// 


echo '</div>';

include("footer.phtml"); ?>