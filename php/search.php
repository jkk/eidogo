<?php

require("json.php");

$kombilo_dir = "../kombilo";

// safety checks
$q = preg_replace("/[^nsew]/", "", $_GET['q']);
$w = (int)$_GET['w'];
$h = (int)$_GET['h'];
$p = preg_replace("/[^\.OX]/", "", $_GET['p']);
$a = preg_replace("/[^a-z]/", "", $_GET['a']);

$output = null;

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
} else {
    /*exec("python $kombilo_dir/search.py " .
        escapeshellcmd($q) . " " .
        escapeshellcmd($w) . " " .
        escapeshellcmd($h) . " " .
        escapeshellcmd($p) . " " .
        escapeshellcmd($a),
        $output, $retval);
    if ($retval) {
        echo "ERROR $retval"; 
        exit;
    }
    */
    $fp = fsockopen("127.0.0.1", 6060, $errno, $errstr, 10);
    if (!$fp) {
        echo "$errstr ($errno)<br />\n";
        exit;
    }    
    fwrite($fp, "$q $w $h $p $a\n");
    $output = "";
    while (!feof($fp)) {
        $output .= fgets($fp, 2048);
    }
    fclose($fp);
    
    $output = split("\n", $output);
    // print_r($output);
    
    file_put_contents($cache_fn, join("\n", $output));
}

if (!count($output)) {
    echo "NONE";
    exit;
}

if (count($output) > 50) {
    $output = array_slice($output, 0, 50);
}

$odd = true;

$results = array();

foreach ($output as $line) {
    list($fn, $pw, $wr, $pb, $br, $re, $dt, $mv) = split("\t", $line);
    if (!$fn) continue;
    $id = str_replace(".sgf", "", $fn);
    $mv = split(",", $mv);
    $mv = (int)$mv[count($mv)-2];
    array_push($results, array(
        "id"    => $id,
        "pw"    => $pw,
        "wr"    => $wr,
        "pb"    => $pb,
        "br"    => $br,
        "re"    => $re,
        "dt"    => $dt,
        "mv"    => $mv,
    ));
    $odd = $odd ? false : true;
}

$json = new Services_JSON();
echo $json->encode($results);

?>