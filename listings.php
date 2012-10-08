<?php
include_once "db_helper.php";
include_once "debug.php";
include_once "user.php";

class listing
{
	public $listingID;
	public $listingCreationDate;
	public $listingExpirationDate;
	public $listingPrice;
	public $listingQuantity;
	public $listingStatus;
	
	public $itemID;
	public $itemEdition;
	public $itemAuthor;
	public $itemTitle;
	public $itemISBN;
	public $itemDescription;
}

function fetchListings() {
//	eval(_debug("fetchListings"));
	global $_USER;
	$userid=getUser($_USER['uid'])->id;
	

//-------------------------fetch listings listing-------------------------

    $dbQuery = "
		SELECT 
			`Listing`.`ID` as `ListingID`, 
			`Listing`.`CreationDate` as `ListingCreationDate`, 
			`Listing`.`ExpirationDate` as `ListingExpirationDate`, 
			`Listing`.`Price` as `ListingPrice`, 
			`Listing`.`Condition` as `ListingCondition`, 
			`Listing`.`Quantity` as `ListingQuantity`, 
			`Listing`.`Status` as `ListingStatus`, 
	
			`Item`.`ID` as `ItemID`, 
			`Item`.`Edition` as `ItemEdition`, 
			`Item`.`Author` as `ItemAuthor`, 
			`Item`.`Title` as `ItemTitle`, 
			`Item`.`ISBN` as `ItemISBN`, 
			`Item`.`Description` as `ItemDescription`
		FROM `Listing`, `Item`
		WHERE
			`Listing`.`ItemID`=`Item`.`ID`
		AND
			`SellerID`=".mysql_real_escape_string($userid)."
    ";
	
    $dataset = getDBResultsArray($dbQuery,true);
	

    $resultArray = array();
	foreach ($dataset as $datarow) {
		$myListing = new listing();
		
		$myListing->listingID=$datarow['ListingID'];
		$myListing->listingCreationDate=$datarow['ListingCreationDate'];
		$myListing->listingExpirationDate=$datarow['ListingExpirationDate'];
		$myListing->listingPrice=$datarow['ListingPrice'];
		$myListing->listingCondition=$datarow['ListingCondition'];
		$myListing->listingQuantity=$datarow['ListingQuantity'];
		$myListing->listingStatus=$datarow['ListingStatus'];
	
		$myListing->itemID=$datarow['ItemID'];
		$myListing->itemEdition=$datarow['ItemEdition'];
		$myListing->itemAuthor=$datarow['ItemAuthor'];
		$myListing->itemTitle=$datarow['ItemTitle'];
		$myListing->itemISBN=$datarow['ItemISBN'];
		$myListing->itemDescription=$datarow['ItemDescription'];
		
		$resultArray[] = $myListing;
	}
	

//-------------------------return result-----------------------------------------
    header("Content-type: application/json");
	echo json_encode($resultArray);

}

function fetchListing($listingID) {
//	eval(_debug("fetchListing"));
	global $_USER;
	$userid=getUser($_USER['uid'])->id;
	

//-------------------------fetch listings listing-------------------------

    $dbQuery = "
		SELECT 
			`Listing`.`ID` as `ListingID`, 
			`Listing`.`CreationDate` as `ListingCreationDate`, 
			`Listing`.`ExpirationDate` as `ListingExpirationDate`, 
			`Listing`.`Price` as `ListingPrice`, 
			`Listing`.`Condition` as `ListingCondition`, 
			`Listing`.`Quantity` as `ListingQuantity`, 
			`Listing`.`Status` as `ListingStatus`, 
	
			`Item`.`ID` as `ItemID`, 
			`Item`.`Edition` as `ItemEdition`, 
			`Item`.`Author` as `ItemAuthor`, 
			`Item`.`Title` as `ItemTitle`, 
			`Item`.`ISBN` as `ItemISBN`, 
			`Item`.`Description` as `ItemDescription`
		FROM `Listing`, `Item`
		WHERE
			`Listing`.`ID`=".mysql_real_escape_string($listingID)."
		AND
			`Listing`.`ItemID`=`Item`.`ID`
    ";
	
    $dataset = getDBResultsArray($dbQuery,true);
	

	$myListing = new listing();
	$myListing->listingID=$dataset[0]['ListingID'];
	$myListing->listingCreationDate=$dataset[0]['ListingCreationDate'];
	$myListing->listingExpirationDate=$dataset[0]['ListingExpirationDate'];
	$myListing->listingPrice=$dataset[0]['ListingPrice'];
	$myListing->listingCondition=$dataset[0]['ListingCondition'];
	$myListing->listingQuantity=$dataset[0]['ListingQuantity'];
	$myListing->listingStatus=$dataset[0]['ListingStatus'];

	$myListing->itemID=$dataset[0]['ItemID'];
	$myListing->itemEdition=$dataset[0]['ItemEdition'];
	$myListing->itemAuthor=$dataset[0]['ItemAuthor'];
	$myListing->itemTitle=$dataset[0]['ItemTitle'];
	$myListing->itemISBN=$dataset[0]['ItemISBN'];
	$myListing->itemDescription=$dataset[0]['ItemDescription'];
	

//-------------------------return result-----------------------------------------
    header("Content-type: application/json");
	echo json_encode($myListing);

}

function updateListing($postData) {
//	eval(_debug("updateListing"));
	global $_USER;
	$userid=getUser($_USER['uid'])->id;
	$postData=json_decode($postData);
	$listingID=$postData->listingID;
	$returnvar=0;

//-------------------------fetch listings-------------------------

    $dbQuery = "
		SELECT 
			`Listing`.`ID` as `ListingID`, 
			`Listing`.`CreationDate` as `ListingCreationDate`, 
			`Listing`.`ExpirationDate` as `ListingExpirationDate`, 
			`Listing`.`Price` as `ListingPrice`, 
			`Listing`.`Condition` as `ListingCondition`, 
			`Listing`.`Quantity` as `ListingQuantity`, 
			`Listing`.`Status` as `ListingStatus`, 
	
			`Item`.`ID` as `ItemID`, 
			`Item`.`Edition` as `ItemEdition`, 
			`Item`.`Author` as `ItemAuthor`, 
			`Item`.`Title` as `ItemTitle`, 
			`Item`.`ISBN` as `ItemISBN`, 
			`Item`.`Description` as `ItemDescription`
		FROM `Listing`, `Item`
		WHERE
			`Listing`.`ID`=".mysql_real_escape_string($listingID)."
		AND
			`Listing`.`ItemID`=`Item`.`ID`
    ";
	
    $dataset = getDBResultsArray($dbQuery,true);
	

	$myListing = new listing();
	$myListing->listingID=$dataset[0]['ListingID'];
	$myListing->listingCreationDate=$dataset[0]['ListingCreationDate'];
	$myListing->listingExpirationDate=$dataset[0]['ListingExpirationDate'];
	$myListing->listingPrice=$dataset[0]['ListingPrice'];
	$myListing->listingCondition=$dataset[0]['ListingCondition'];
	$myListing->listingQuantity=$dataset[0]['ListingQuantity'];
	$myListing->listingStatus=$dataset[0]['ListingStatus'];

	$myListing->itemID=$dataset[0]['ItemID'];
	$myListing->itemEdition=$dataset[0]['ItemEdition'];
	$myListing->itemAuthor=$dataset[0]['ItemAuthor'];
	$myListing->itemTitle=$dataset[0]['ItemTitle'];
	$myListing->itemISBN=$dataset[0]['ItemISBN'];
	$myListing->itemDescription=$dataset[0]['ItemDescription'];

//-------------------------update item if different------------------------------
	$itemDifferent = false;
	$itemDifferent = $itemDifferent || ($myListing->itemEdition != $postData->itemEdition);
	$itemDifferent = $itemDifferent || ($myListing->itemAuthor != $postData->itemAuthor);
	$itemDifferent = $itemDifferent || ($myListing->itemTitle != $postData->itemTitle);
	$itemDifferent = $itemDifferent || ($myListing->itemISBN != $postData->itemISBN);
	$itemDifferent = $itemDifferent || ($myListing->itemDescription != $postData->itemDescription);
    
	if ($itemDifferent)
	{
		$dbQuery="
			SELECT ID
			FROM `Item`
			WHERE
				`Edition`='".mysql_real_escape_string($postData->itemEdition)."'
			AND
				`Author`='".mysql_real_escape_string($postData->itemAuthor)."'
			AND
				`Title`='".mysql_real_escape_string($postData->itemTitle)."'
			AND
				`ISBN`='".mysql_real_escape_string($postData->itemISBN)."'
			AND
				`Description`='".mysql_real_escape_string($postData->itemDescription)."'
		";
        
		$dataset = getDBResultsArray($dbQuery,true);
		if ($dataset)
		{
			$myListing->itemID=$dataset[0]['ID'];
		}
		else
		{
			$dbQuery="
				INSERT INTO `Item` (`Edition`, `Author`, `Title`, `ISBN`, `Description`)
				VALUES (
					'".mysql_real_escape_string($postData->itemEdition)."',
					'".mysql_real_escape_string($postData->itemAuthor)."',
					'".mysql_real_escape_string($postData->itemTitle)."',
					'".mysql_real_escape_string($postData->itemISBN)."',
					'".mysql_real_escape_string($postData->itemDescription)."'
				)
			";
            
			$returnvar+=intval(getDBResultAffected($dbQuery,true));
			$dbQuery="
				SELECT ID
				FROM `Item`
				WHERE
					`Edition`='".mysql_real_escape_string($postData->itemEdition)."'
				AND
					`Author`='".mysql_real_escape_string($postData->itemAuthor)."'
				AND
					`Title`='".mysql_real_escape_string($postData->itemTitle)."'
				AND
					`ISBN`='".mysql_real_escape_string($postData->itemISBN)."'
				AND
					`Description`='".mysql_real_escape_string($postData->itemDescription)."'
			";
			$dataset = getDBResultsArray($dbQuery,true);
			$myListing->itemID=$dataset[0]['ID'];
		}
	}

//-------------------------update listing if different---------------------------
	$listingDifferent = false;
	$listingDifferent = $listingDifferent || ($myListing->listingPrice != $postData->listingPrice);
	$listingDifferent = $listingDifferent || ($myListing->listingCondition != $postData->listingCondition);
	$listingDifferent = $listingDifferent || ($myListing->listingQuantity != $postData->listingQuantity);
	$listingDifferent = $listingDifferent || ($itemDifferent); // i.e. $myListing->itemID is a new ID.

	if ($listingDifferent)
	{
		$dbQuery="
			UPDATE `Listing`
			SET
				`Price`='".mysql_real_escape_string($postData->listingPrice)."',
				`Condition`='".mysql_real_escape_string($postData->listingCondition)."',
				`Quantity`='".mysql_real_escape_string($postData->listingQuantity)."',
				`ItemID`='".mysql_real_escape_string($myListing->itemID)."'
			WHERE `ID`='".mysql_real_escape_string($listingID)."'
		";
		$returnvar+=intval(getDBResultAffected($dbQuery,true));
	}
//-------------------------return result-----------------------------------------
    header("Content-type: application/json");
	echo json_encode(array('rowsaffected'=>$returnvar));

}

function disableListing($listingID) {
//	eval(_debug("disableListing"));
	global $_USER;
	$userid=getUser($_USER['uid'])->id;
	$returnvar=0;

	$dbQuery="
		UPDATE `Listing`
		SET
			`Status`='1'
		WHERE `ID`='".mysql_real_escape_string($listingID)."'
	";
	$returnvar+=intval(getDBResultAffected($dbQuery,true));

//-------------------------return result-----------------------------------------
    header("Content-type: application/json");
	echo json_encode(array('rowsaffected'=>$returnvar));

}

function enableListing($listingID) {
//	eval(_debug("enableListing"));
	global $_USER;
	$userid=getUser($_USER['uid'])->id;
	$returnvar=0;

	$dbQuery="
		UPDATE `Listing`
		SET
			`Status`='4'
		WHERE `ID`='".mysql_real_escape_string($listingID)."'
	";
	$returnvar+=intval(getDBResultAffected($dbQuery,true));

//-------------------------return result-----------------------------------------
    header("Content-type: application/json");
	echo json_encode(array('rowsaffected'=>$returnvar));

}

?>
