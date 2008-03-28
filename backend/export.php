<?php

require("db.php");

mysql_connect(DB_HOST, DB_USER, DB_PASS);
mysql_select_db("go_games");

function to_base($numstring, $frombase, $tobase) {
    $chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
   $tostring = substr($chars, 0, $tobase);

   $length = strlen($numstring);
   $result = '';
   for ($i = 0; $i < $length; $i++) {
       $number[$i] = strpos($chars, $numstring{$i});
   }
   do {
       $divide = 0;
       $newlen = 0;
       for ($i = 0; $i < $length; $i++) {
           $divide = $divide * $frombase + $number[$i];
           if ($divide >= $tobase) {
               $number[$newlen++] = (int)($divide / $tobase);
               $divide = $divide % $tobase;
           } elseif ($newlen > 0) {
               $number[$newlen++] = 0;
           }
       }
       $length = $newlen;
       $result = $tostring{$divide} . $result;
   }
   while ($newlen != 0);
   return $result;
}

$q = mysql_query("select ID, SGF from games");
while ($r = mysql_fetch_array($q)) {
    $stamp = microtime(true) * (rand() / getrandmax()) * 100;
    $id = to_base((string)$stamp, 10, 62);
    $fn = sprintf("%s.sgf", substr($id, 0, 6));
    file_put_contents("../sgf/games/$fn", $r[1]);
}

?>
