<?php
    include_once "messageResult.php";
	include_once "db_helper.php";
    include_once "user.php";
	
	function fetchInboxMessages() {
        global $_USER;
        $userObj = getUser($_USER['uid']);
        
        $receiverID = $userObj->id;
        $receiverName = $userObj->name;
        
        $dbQuery = "SELECT Receiver, Sender, TransactionID, DateSent, Date1 , Date2, Date3, Location1, Location2, Note FROM Message WHERE Receiver = '".$receiverID."';";
        
        $dataset = getDBResultsArray($dbQuery);
        $resultArray = array();
        $i = 0;
        foreach($dataset as $datarow){
            $messageResultObj = new MessageResult();
            $messageResultObj->receiverID = $datarow["Receiver"];
            $messageResultObj->receiverName = $receiverName;
            $messageResultObj->senderID = $datarow["Sender"];

            $senderObj = getUserFromID($datarow["Sender"]);
            $senderName = $senderObj->name;
            $messageResultObj->senderName = $senderName;
            
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
    
    function fetchOutboxMessages($sender) {
        global $_USER;
        $userObj = getUser($_USER['uid']);
        $senderID = $userObj->id;
        $senderName = $userObj->name;
        
        $dbQuery = "SELECT Receiver, Sender, TransactionID, DateSent, Date1 , Date2, Date3, Location1, Location2, Note FROM Message WHERE Sender = '".$senderID."';";
        
        $dataset = getDBResultsArray($dbQuery);
        $resultArray = array();
        $i = 0;
        foreach($dataset as $datarow){
            $messageResultObj = new MessageResult();
            $messageResultObj->receiverID = $datarow["Receiver"];
            
            $receiverObj = getUserFromID($datarow["Receiver"]);
            $receiverName = $receiverObj->name;
            $messageResultObj->receiverName = $receiverName;
            
            $messageResultObj->senderID = $datarow["Sender"];
            $messageResultObj->senderName = $senderName;
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
    
?>
