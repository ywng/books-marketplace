<?php
include "user.php";

function check()
{
	global $_USER;
	if (!isset($_USER['uid'])) {echo json_encode('REDIRECT');}
	else {echo json_encode('STAY');}
}
?>
