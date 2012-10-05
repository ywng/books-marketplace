<?php
include_once "listingentity.php";
include_once "db_helper.php";

function fetchListingDetails($listingid) {

    $dbQuery = "SELECT Item.Title, Item.Edition, Item.Author, User.Name as SellerName, lst.Condition, lst.Price, lst.Quantity
                    FROM Listing as lst
                    INNER JOIN User ON lst.SellerID = User.ID
                    INNER JOIN Item ON lst.ItemID = Item.ID
                    WHERE lst.ID = ".$listingid.";";

    $dataset = getDBResultsArray($dbQuery);
        
    $listingEntityObj = new ListingEntity();
    if (count($dataset) > 0) {
        $listingEntityObj->itemtitle = $dataset[0]["Title"];
        $listingEntityObj->itemedition = $dataset[0]["Edition"];
        $listingEntityObj->itemauthor = $dataset[0]["Author"];
        $listingEntityObj->sellername = $dataset[0]["SellerName"];
        $listingEntityObj->condition = $dataset[0]["Condition"];
        $listingEntityObj->price = $dataset[0]["Price"];
        $listingEntityObj->quantity = $dataset[0]["Quantity"];

    }

    header("Content-type: application/json");
    echo json_encode($listingEntityObj);
}

?>
