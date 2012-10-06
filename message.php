<?php
include_once "messageResult.php";
include_once "db_helper.php";

function fetchMessage($input) {
   
    list($transactionID, $dateSent) = explode("&", $input, 2);
    $dbQuery = "SELECT Sender, Receiver, TransactionID, DateSent, Date1, Date2, Date3, Location1, Location2, Note FROM Message WHERE TransactionID = '".$transactionID."';"; // AND DateSent = ".$dateSent.";";

    $dataset = getDBResultsArray($dbQuery);

    $resultArray = array();
    $i = 0;
    foreach ($dataset as $datarow) {
        $messageResultObj = new MessageResult();
        $messageResultObj->sender = $datarow["Sender"];
        $messageResultObj->receiver = $datarow["Receiver"];
        $messageResultObj->transactionID = $datarow["TransactionID"];
        $messageResultObj->dateSent = $datarow["DateSent"];
        $messageResultObj->date1 = $datarow["Date1"];
        $messageResultObj->date2 = $datarow["Date2"];
        $messageResultObj->date3 = $datarow["Date3"];
        $messageResultObj->location1 = $datarow["Location1"];
        $messageResultObj->location2 = $datarow["Location2"];
        $messageResultObj->note = $datarow["Note"];

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
