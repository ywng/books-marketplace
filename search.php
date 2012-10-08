<?php
include_once "searchresult.php";
include_once "db_helper.php";

function fetchSearchResults($query) {
    $query = urldecode($query);
    //if (!isset($query) || $query == "")$query = S_REST['search'];
    $query = mysql_real_escape_string($query);
    
    $resultArray = array();
    $dbQuery = "SELECT DISTINCT Item.ID
                FROM Item
                INNER JOIN Listing on Listing.ItemID = Item.ID
                INNER JOIN User on User.ID = Listing.SellerID
                LEFT JOIN Category on Item.ID = Category.ItemID
                WHERE Item.Author like '%".$query
                ."%' OR Item.Title like '%".$query
                ."%' OR Item.Description like '%".$query
                ."%' OR Item.ISBN like '%".$query
                ."%' OR User.Name like '%".$query
                ."%' OR Category.Tag like '%".$query
                ."%' GROUP BY Item.ID";

    $dataset = getDBResultsArray($dbQuery, true);
    
    if(count($dataset) > 0)
    {
        $itemIdList = "";
        $numDataRows = count($dataset);
        for ($i = 0; $i < $numDataRows; $i++) {
            $itemIdList = $itemIdList."'".$dataset[$i]["ID"]."'";
            if ($i != $numDataRows - 1) {
                $itemIdList = $itemIdList.", ";
            }
        }    
        
        $dbQuery = "SELECT Item.ID as ItemID, Item.Title, Item.Author, Item.Edition, COUNT(1) as NumItemsForSale, MIN(Listing.Price) AS StartingPrice
                FROM Item
                INNER JOIN Listing on Listing.ItemID = Item.ID
                INNER JOIN Status on Listing.Status = Status.ID
                WHERE (Status.ID = 4 OR Status.ID = 0) AND Item.ID IN (".$itemIdList.")
                GROUP BY Item.ID;";
        $dataset = getDBResultsArray($dbQuery, true);
    
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
    }   

    header("Content-type: application/json");
    echo json_encode($resultArray);
}

?>
