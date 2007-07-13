<?php

require("php/db.php");

mysql_connect(DB_HOST, DB_USER, DB_PASS);
mysql_select_db("go_games");
$id = (int)$_GET['id'];
$query = mysql_query("select sgf from games where id='$id'");
$row = mysql_fetch_row($query);
echo trim($row[0]);

?>