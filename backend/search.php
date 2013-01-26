<?php

$kombilo_dir = "../kombilo";

if (!$_SERVER['QUERY_STRING']) {
    $q = "ne";
    $w = 7;
    $h = 7;
    $p = ".................................................";
    $a = "continuations";
} else {
    // safety checks
    $q = preg_replace("/[^nsew]/", "", $_GET['q']);
    $w = (int)$_GET['w'];
    $h = (int)$_GET['h'];
    $p = preg_replace("/[^\.OX]/", "", strtoupper($_GET['p']));
    $a = preg_replace("/[^a-z]/", "", $_GET['a']);
    $o = (int)$_GET['o'];
}

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
    
    file_put_contents($cache_fn, join("\n", $output));
}

if (!count($output)) {
    echo "[]";
    exit;
}

$total = count($output) - 1;
if ($total > 50) {
    $output = array_slice($output, $o, 50);
}

$odd = true;

$results = array();

if ($a == "continuations") {
    foreach ($output as $line) {
        list($label, $x, $y, $count) = split("\t", $line);
        if (!$label) continue;
        array_push($results, array(
            "label" => $label,
            "x"     => $x,
            "y"     => $y,
            "count" => $count));
    }
} else {
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
            "mv"    => $mv));
        $odd = $odd ? false : true;
    }
    $results = array("total" => $total, "offset" => $o, "results" => $results);
}

echo json_encode($results);

?>
