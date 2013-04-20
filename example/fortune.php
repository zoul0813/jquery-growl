<?php
require("fortunes/fortune.php");
$f = new Fortune;
echo $f->quoteFromDir("fortunes/");
?>
