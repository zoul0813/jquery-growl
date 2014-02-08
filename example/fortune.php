<?php
header('Access-Control-Allow-Origin: *');
require("fortunes/fortune.php");
$f = new Fortune;
echo $f->quoteFromDir("fortunes/");
?>
