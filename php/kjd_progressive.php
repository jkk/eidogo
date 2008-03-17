<?php

require("db.php");

mysql_connect(DB_HOST, DB_USER, DB_PASS);
mysql_select_db("eidogo");

$id = (int)$_REQUEST['id'];
if (!$id) {
	$id = 0; // show root node by default
}

// node data
$res = mysql_query("select id, properties from kjd where id='$id'");
if (!$res)
	die("Error loading game data.");
$row = mysql_fetch_array($res, MYSQL_ASSOC);
$node = json_decode($row['properties'], true);
$node['_id'] = $row['id'];

// data for node's children
$res = mysql_query("select id, properties from kjd where parent='$id'");
$kids = array();
if (!$res)
	die("Error loading game data.");
while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
	$kid = json_decode($row['properties'], true);
	$kid['_id'] = $row['id'];
	$kids[] = $kid;
}
$node['_children'] = $kids;

echo json_encode($node);

?>