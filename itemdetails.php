<?php
include_once "itemlistings.php";
include_once "listingentity.php";
include_once "db_helper.php";

function fetchItemDetailsAndListings($itemid) {

    $dbQuery = "SELECT Item.Title, Item.Author, Item.Edition, Item.ISBN, Item.Description
                FROM Item
                WHERE Item.ID = ".$itemid.";";

    $dataset = getDBResultsArray($dbQuery);

    $itemListingsObj = new ItemListings();
     
    if(count($dataset) > 0) {
        $itemListingsObj->title = $dataset[0]["Title"];
        $itemListingsObj->author = $dataset[0]["Author"];
        $itemListingsObj->edition = $dataset[0]["Edition"];
        $itemListingsObj->isbn = $dataset[0]["ISBN"];
        $itemListingsObj->description = $dataset[0]["Description"];

        $dbQuery = "SELECT Tag FROM Category WHERE ItemID = ".$itemid.";";

        $dataset = getDBResultsArray($dbQuery, true);
       
        $itemListingsObj->tagArray = array();
        $i = 0;
        foreach ($dataset as $datarow) {
            $itemListingsObj->tagArray[$i] = $datarow["Tag"];
            $i++;
        }  
        
        $dbQuery = "SELECT lst.ID as ListingID, User.Name as SellerName, lst.Condition, lst.price
                    FROM Listing as lst
                    INNER JOIN User ON lst.SellerID = User.ID
                    INNER JOIN Status ON lst.Status = Status.ID
                    WHERE (Status.ID = 4 OR Status.ID = 0) AND lst.ItemID = ".$itemid.";";

        $dataset = getDBResultsArray($dbQuery);
        
        $itemListingsObj->listingArray = array();
        $i = 0;
        foreach ($dataset as $datarow) {
            $listingEntityObj = new ListingEntity();

            $listingEntityObj->id = $datarow["ListingID"];
            $listingEntityObj->sellername = $datarow["SellerName"];
            $listingEntityObj->condition = $datarow["Condition"];
            $listingEntityObj->price = $datarow["price"];

            $itemListingsObj->listingArray[$i] = $listingEntityObj;
            $i++;
        }
    }

    header("Content-type: application/json");
    echo json_encode($itemListingsObj);
}

?>
