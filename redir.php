<?php

if ($_GET['path'] == "kjd") {
    header("Location: /#kjd");
} elseif ($_GET['path'] == "search") {
    header("Location: /#search");
} elseif ($_GET['path'] == "gnugo") {
    header("Location: /#gnugo");
} elseif ($_GET['path'] == "blank") {
    header("Location: /#blank");
} elseif (file_exists("sgf/saved/" . $_GET['path'] . ".sgf")) {
    header("Location: /#" . $_GET['path']);
} else {
    header("HTTP/1.0 404 Not Found");
    echo "Not Found";
}

?>
