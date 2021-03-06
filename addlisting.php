<?php
include_once "db_helper.php";
include_once "user.php";

function addListing($data) {
    global $_USER;
    $data = json_decode($data);
    
    if(!isset($_USER['uid'])) {
        //Ideally this code path should never be hit in production
        $GLOBALS["_PLATFORM"]->sandboxHeader('HTTP/1.1 401 Unauthorized');
        die();
    }

    $userObj = getUser($_USER['uid']);    
   
    $itemid = $data->itemid;
    if ($itemid < 0) {
        $dbQuery = "INSERT INTO `Item` (`Edition`, `Author`, `Title`, `ISBN`, `Description`) 
                    VALUES (".$data->edition
                            .", '".$data->author
                            ."', '".$data->title
                            ."', '".$data->isbn
                            ."', '".$data->description
                            ."');";
        $result = getDBResultInserted($dbQuery,'itemid');
        $itemid = $result['itemid'];
    }

    $dbQuery = "INSERT INTO Listing (SellerID, ItemID, CreationDate, ExpirationDate, Price, Quantity, `Condition`, Status)
                VALUES(".$userObj->id
                        .", ".$itemid
                        .", NOW(), NOW(), ".$data->price
                        .", ".$data->quantity
                        .", '".$data->condition."', 4);";

    $result = getDBResultInserted($dbQuery,'listingid');
    
    if (!empty($data->newtags)) {
        $tagArray = array_unique(preg_split('/[^[:alnum:]]+/', $data->newtags));
        
        foreach ($tagArray as $tag) {
            if(strlen($tag) > 0) {
                $dbQuery = "INSERT INTO Category (ItemID, Tag)
                             VALUES(".$itemid
                            .", '".$tag."');";
                getDBResultInserted($dbQuery,'itemtagid');
            }
        }
    }

    header("Content-type: application/json");
    echo json_encode($result); 
}
?>
