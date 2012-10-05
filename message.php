<?php
include_once "messageResult.php";
include_once "db_helper.php";

function fetchMessages($query) {
    //if (!isset($query) || $query == "")$query = S_REST['search'];
    $query = mysql_real_escape_string($query);
   
    $dbQuery = "SELECT Item.Title, Item.Author, Item.Edition, COUNT(1) as NumItemsForSale, MIN(Listing.Price) AS StartingPrice
FROM Item
INNER JOIN Listing on Listing.ItemID = Item.ID
WHERE Item.Author like '%".$query."%' OR Item.Description like '%".$query."%' OR Item.ISBN like '%".$query."%' GROUP BY Item.ID";

    $dataset = getDBResultsArray($dbQuery);

    $resultArray = array();
    $i = 0;
    foreach ($dataset as $datarow) {
        $messageResultObj = new SearchResult();
        $messageResultObj->title = $datarow["Title"];
        $messageResultObj->author = $datarow["Author"];
        $messageResultObj->edition = "Edition#".$datarow["Edition"];
        $messageResultObj->startingPrice = $datarow["StartingPrice"]; 
        $messageResultObj->numItemsForSale = $datarow["NumItemsForSale"]; 

        $resultArray[$i] = $messageResultObj;    
        $i++;
    }   

    header("Content-type: application/json");
    echo json_encode($resultArray);
}

function addMessage($query) {
    //if (!isset($query) || $query == "")$query = S_REST['search'];
    $query = mysql_real_escape_string($query);
   
    $dbQuery = "SELECT Item.Title, Item.Author, Item.Edition, COUNT(1) as NumItemsForSale, MIN(Listing.Price) AS StartingPrice
FROM Item
INNER JOIN Listing on Listing.ItemID = Item.ID
WHERE Item.Author like '%".$query."%' OR Item.Description like '%".$query."%' OR Item.ISBN like '%".$query."%' GROUP BY Item.ID";

    header("Content-type: application/json");
    echo json_encode($resultArray);
}
?>
