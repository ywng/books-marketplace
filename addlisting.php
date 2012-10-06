<?php
include_once "db_helper.php";

function addListing($data) {
    $data = json_decode($data);

    $sellerid = $_USER['uid'];
    if(!isset($_USER['uid'])) {
        //NOTE: This should be a default id used for testing alone
        //Ideally this code path should never be hit in production
        $sellerid = 902954691;
    }

    $dbQuery = "INSERT INTO Listing (SellerID, ItemID, CreationDate, ExpirationDate, Price, Quantity, `Condition`, Status)
                VALUES(".$sellerid
                        .", ".$data->itemid
                        .", NOW(), NOW(), ".$data->price
                        .", ".$data->quantity
                        .", '".$data->condition."', 4);";

    $result = getDBResultInserted($dbQuery,'listingid');

    header("Content-type: application/json");
    echo json_encode($result); 
}
?>
