<?php
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
$stamp = microtime(true) * (rand() / getrandmax()) * 100;
$id = to_base((string)$stamp, 10, 62);

if ($_POST['type'] == "paste") {
    $sgf = $_POST['sgf'];
    if (get_magic_quotes_gpc()) $sgf = stripslashes($_POST['sgf']);
} elseif ($_POST['type'] == "file") {
    $sgf = file_get_contents($_FILES['sgf_file']['tmp_name']);
    @unlink($_FILES['sgf_file']['tmp_name']);
}

if (strlen($_POST['sgf'] > 30000)) {
    exit;
}

file_put_contents("../sgf/saved/$id.sgf", $sgf);
header("location: /#$id");

?>
