<?php
include_once "messageResult.php";
include_once "db_helper.php";
include_once "user.php";

function addTransaction($data) {
    global $_USER;
    
    if(!isset($_USER['uid'])) {
        //Ideally this code path should never be hit in production
        $GLOBALS["_PLATFORM"]->sandboxHeader('HTTP/1.1 401 Unauthorized');
        die();
    }
  
	$buyer = getUser($_USER['uid']);

    $dbQuery = "INSERT INTO Transaction (BuyerID, ListingID, CreationDate, LastModificationDate, StatusID) 
				VALUES (" .$buyer->id
				.", " .$data
				. ", NOW(), NOW(), 0);";
	$run = getDBResultInserted($dbQuery, 'tid');
	
    header("Content-type: application/json");
    echo json_encode($run);
}
?>
