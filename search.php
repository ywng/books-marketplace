<?php
include_once "searchresult.php";
include_once "db_helper.php";

function fetchSearchResults($query) {
    //if (!isset($query) || $query == "")$query = S_REST['search'];
    $query = mysql_real_escape_string($query);
   
    $dbQuery = "SELECT Item.ID as ItemID, Item.Title, Item.Author, Item.Edition, COUNT(1) as NumItemsForSale, MIN(Listing.Price) AS StartingPrice
                FROM Item
                INNER JOIN Listing on Listing.ItemID = Item.ID
                WHERE Item.Author like '%".$query
                ."%' OR Item.Title like '%".$query
                ."%' OR Item.Description like '%".$query
                ."%' OR Item.ISBN like '%".$query
                ."%' GROUP BY Item.ID";
    $dataset = getDBResultsArray($dbQuery);

    $resultArray = array();
    $i = 0;
    foreach ($dataset as $datarow) {
        $searchResultObj = new SearchResult();
        $searchResultObj->itemid = $datarow["ItemID"];
        $searchResultObj->title = $datarow["Title"];
        $searchResultObj->author = $datarow["Author"];
        $searchResultObj->edition = "Edition#".$datarow["Edition"];
        $searchResultObj->startingPrice = $datarow["StartingPrice"]; 
        $searchResultObj->numItemsForSale = $datarow["NumItemsForSale"]; 

        $resultArray[$i] = $searchResultObj;    
        $i++;
    }   

    header("Content-type: application/json");
    echo json_encode($resultArray);
}

?>
