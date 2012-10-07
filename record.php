<?php
include_once "db_helper.php";
include_once "user.php";

class pendingRecord
{
        public $transID;
        public $BuySell;
	public $listingID;
	public $Price;
	public $Title;
	public $counterpart;
        public $counterpartID;

}

function fetchRecords($userid) {
    
    //$userid=mysql_real_escape_string($userid);

    global $_USER;

    if(!isset($_USER['uid'])) {
        //Ideally this code path should never be hit in production
        $GLOBALS["_PLATFORM"]->sandboxHeader('HTTP/1.1 401 Unauthorized');
        die();
    }
    
    $userObj = getUser($_USER['uid']); 

//-------------------------fetch pending transaction record-------------------------

//fetch pending sale transaction
    $dbQuery = "SELECT list.ID, list.Price, Item.Title, User.Name as BuyerName, User.ID as counterpartID, tran.TransactionID AS transactionID
FROM Listing as list
INNER JOIN Transaction as tran ON list.ID = tran.ListingID AND list.SellerID ="
.$userObj->id.
" INNER JOIN Item ON list.ItemID = Item.ID
INNER JOIN Status ON tran.StatusID = Status.ID AND Status.Name = 'in progress'
INNER JOIN User ON tran.BuyerID = User.ID";

    $dataset = getDBResultsArray($dbQuery,true);

    $resultArray = array();
    $i = 0;
   foreach ($dataset as $datarow) {
       $pendingRecord = new pendingRecord();
       $pendingRecord->BuySell = "Sell";
       $pendingRecord->listingID = $datarow["ID"];
       $pendingRecord->transID = $datarow["transactionID"];
       $pendingRecord->Price = $datarow["Price"];
       $pendingRecord->Title = $datarow["Title"];
       $pendingRecord->counterpart = $datarow["BuyerName"];
       $pendingRecord->counterpartID = $datarow["counterpartID"];
   
      $resultArray[$i] = $pendingRecord;
        $i++;
   }

//fetch pending buy transaction
      $dbQuery = "SELECT list.ID,  list.Price, Item.Title, User.Name AS SellerName, User.ID as counterpartID, tran.TransactionID AS transactionID
FROM Listing AS list 
INNER JOIN Transaction AS tran ON list.ID = tran.ListingID AND tran.BuyerID ="
.$userObj->id.
" INNER JOIN Item ON list.ItemID = Item.ID
INNER JOIN Status ON tran.StatusID = Status.ID AND Status.Name = 'in progress'
INNER JOIN User ON list.SellerID = User.ID";


    $dataset = getDBResultsArray($dbQuery,true);

    foreach ($dataset as $datarow) {
       $pendingRecord = new pendingRecord();
       $pendingRecord->BuySell = "Buy";
       $pendingRecord->listingID = $datarow["ID"];
       $pendingRecord->transID = $datarow["transactionID"];
       $pendingRecord->Price = $datarow["Price"];
       $pendingRecord->Title = $datarow["Title"];
       $pendingRecord->counterpart = $datarow["SellerName"];
       $pendingRecord->counterpartID = $datarow["counterpartID"];

      $resultArray[$i] = $pendingRecord;
        $i++;
   }

//-------------------------fetch past transaction record-------------------------
     $resultArray[$i] ="Past_Transaction_Record_Starts";
     $i++;
    $dbQuery = "SELECT list.ID, list.Price, Item.Title, User.Name as BuyerName,  User.ID as counterpartID, tran.TransactionID AS transactionID
FROM Listing as list
INNER JOIN Transaction as tran ON list.ID = tran.ListingID AND list.SellerID ="
.$userObj->id.
" INNER JOIN Item ON list.ItemID = Item.ID
INNER JOIN Status ON tran.StatusID = Status.ID AND Status.Name = 'completed'
INNER JOIN User ON tran.BuyerID = User.ID";

    $dataset = getDBResultsArray($dbQuery,true);

    foreach ($dataset as $datarow) {
       $pendingRecord = new pendingRecord();
       $pendingRecord->BuySell = "Sell";
       $pendingRecord->listingID = $datarow["ID"];
       $pendingRecord->transID = $datarow["transactionID"];
       $pendingRecord->Price = $datarow["Price"];
       $pendingRecord->Title = $datarow["Title"];
       $pendingRecord->counterpart = $datarow["BuyerName"];
       $pendingRecord->counterpartID = $datarow["counterpartID"];

      $resultArray[$i] = $pendingRecord;
        $i++;
   }

      $dbQuery = "SELECT list.ID,  list.Price, Item.Title, User.Name AS SellerName,  User.ID as counterpartID, tran.TransactionID AS transactionID
FROM Listing AS list
INNER JOIN Transaction AS tran ON list.ID = tran.ListingID AND tran.BuyerID ="
.$userObj->id.
" INNER JOIN Item ON list.ItemID = Item.ID
INNER JOIN Status ON tran.StatusID = Status.ID AND Status.Name = 'completed'
INNER JOIN User ON list.SellerID = User.ID";


    $dataset = getDBResultsArray($dbQuery,true);

    foreach ($dataset as $datarow) {
       $pendingRecord = new pendingRecord();
       $pendingRecord->BuySell = "Buy";
       $pendingRecord->listingID = $datarow["ID"];
       $pendingRecord->transID = $datarow["transactionID"];
       $pendingRecord->Price = $datarow["Price"];
       $pendingRecord->Title = $datarow["Title"];
       $pendingRecord->counterpart = $datarow["SellerName"];
       $pendingRecord->counterpartID = $datarow["counterpartID"];

      $resultArray[$i] = $pendingRecord;
        $i++;
   }

    

//-------------------------return result-----------------------------------------
    header("Content-type: application/json");
    echo json_encode($resultArray);

}

?>
