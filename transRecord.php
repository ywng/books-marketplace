<?php
include_once "db_helper.php";


class transRecord
{
        public $transID;
	public $listingID;
	public $Price;
	public $Title;
	public $counterpart;
        public $LastModifiedDate;
        public $BuyerRating;
        public $SellerRating;
        public $BuyerFeedback;
        public $SellerFeedback;
        
}

function fetchTransRecords($transID) {

    $transID=mysql_real_escape_string($transID);
    $dbQuery = "SELECT list.ID, list.Price, Item.Title, User.Name as BuyerName, tran.TransactionID AS transactionID,tran.LastModificationDate AS Date,
tran.BuyerRating, tran.SellerRating, tran.BuyerFeedback, tran.SellerFeedback FROM Listing as list
INNER JOIN Transaction as tran ON list.ID = tran.ListingID AND tran.TransactionID ="
.$transID.
" INNER JOIN Item ON list.ItemID = Item.ID
INNER JOIN Status ON tran.StatusID = Status.ID 
INNER JOIN User ON tran.BuyerID = User.ID";

    $dataset = getDBResultsArray($dbQuery);
   
    $resultArray = array();
    $i = 0;
   foreach ($dataset as $datarow) {
       $transRecord = new transRecord();

       $transRecord->listingID = $datarow["ID"];
       $transRecord->LastModifiedDate = $datarow["Date"];
       $transRecord->transID= $datarow["transactionID"];
       $transRecord->Price = $datarow["Price"];
       $transRecord->Title = $datarow["Title"];
       $transRecord->counterpart = $datarow["BuyerName"];

       //additional infomation if needed and have 
       $transRecord->BuyerRating= $datarow["BuyerRating"];
       $transRecord->SellerRating= $datarow["SellerRating"];
       $transRecord->BuyerFeedback= $datarow["BuyerFeedback"];
       $transRecord->SellerFeedback= $datarow["SellerFeedback"];
   
      $resultArray[$i] = $transRecord;
        $i++;
   }

    header("Content-type: application/json");
    echo json_encode($resultArray);

}

function updateTransRecord($transID,$itemValue){
    $transID=mysql_real_escape_string($transID);
   
    list($str1,$str2, $str3,$str4) = explode('.', $itemValue);
    
    $BuySell=$str2;
    

    if($str1!="cancel"){
	$rating=mysql_real_escape_string($str3);
	$feedback=mysql_real_escape_string($str4);
        $feedback=urldecode ( $feedback);

	$dbQuery = "UPDATE Transaction
	SET LastModificationDate=NOW(), StatusID=3,";

	if($BuySell=="Buy")
	$dbQuery=$dbQuery." SellerRating=".$rating.", SellerFeedback=\"".$feedback."\" ";
	else 
	$dbQuery=$dbQuery." BuyerRating=".$rating.", BuyerFeedback=\"".$feedback."\" ";

	$dbQuery=$dbQuery."WHERE TransactionID=".$transID;


	echo $dbQuery;
	
    }
    else{
        if(BuySell=="Buy")
          $message="Cancelled by buyer!";
        else
          $message="Cancelled by seller!";

        $dbQuery = "UPDATE Transaction
	SET LastModificationDate=".$date.", StatusID=1, SellerFeedback=\"".$message."\", 
        BuyerFeedback=\"".$message."\" WHERE TransactionID=".$transID;
	echo $dbQuery;
	
    }

    getDBResultAffected($dbQuery);
    echo "Updated Sucessfully!";

}

?>
