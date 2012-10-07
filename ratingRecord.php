<?php
include_once "db_helper.php";

class  ratingRecord
{
	public $OverallBuyerRating;
	public $OverallSellerRating;
}

function fetchRating($userID) {
 
    //echo $userID;
 
    $userID=mysql_real_escape_string($userID);
    $ratingRecord = new ratingRecord();
    $resultArray = array();
    $dbQuery = "SELECT COUNT(*) as myCount FROM Transaction WHERE BuyerID=".$userID." AND (BuyerRating=1 OR BuyerRating=-1)";
    $dataset=getDBResultsArray($dbQuery);
    $total_no_rate = $dataset[0]["myCount"];

    $dbQuery = "SELECT COUNT(*) as myCount FROM Transaction WHERE BuyerID=".$userID." AND BuyerRating=1";
    $dataset=getDBResultsArray($dbQuery);
    $total_no_like = $dataset[0]["myCount"];
    

    $ratingRecord->OverallBuyerRating=(string)$total_no_like." out of ".(string)$total_no_rate." sellers like this buyer";
 
    $dbQuery ="SELECT COUNT( * ) as myCount FROM Transaction AS tran INNER JOIN Listing AS list ON list.ID = tran.ListingID AND list.SellerID =".$userID." AND (SellerRating =1 OR SellerRating = -1)";
    $dataset=getDBResultsArray($dbQuery);
    $total_no_rate = $dataset[0]["myCount"];

    $dbQuery ="SELECT COUNT( * ) as myCount FROM Transaction AS tran INNER JOIN Listing AS list ON list.ID = tran.ListingID AND list.SellerID =".$userID." AND SellerRating =1";
    $dataset=getDBResultsArray($dbQuery);
    $total_no_like = $dataset[0]["myCount"];
    
    $ratingRecord->OverallSellerRating=(string)$total_no_like." out of ".(string)$total_no_rate." buyers like this seller";
    
    $resultArray[0] = $ratingRecord;
    header("Content-type: application/json");
    echo json_encode($resultArray);     
    

}


?>
