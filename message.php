<?php
include_once "messageResult.php";
include_once "db_helper.php";
include_once "user.php";
include_once "debug.php";

    function fetchMessage($input) {
//        eval(_debug('fetchMessage'));
        
        list($transactionID, $dateSent) = explode("&", $input, 2);
        $dbQuery = "SELECT Sender, Receiver, TransactionID, DateSent, Date1, Date2, Date3, Location1, Location2, Note FROM Message WHERE TransactionID = '".$transactionID."' AND DateSent = '".$dateSent."';";
        
        $dataset = getDBResultsArray($dbQuery);
        
        $resultArray = array();
        $i = 0;
        foreach ($dataset as $datarow) {
            $messageResultObj = new MessageResult();
            $messageResultObj->senderID = $datarow["Sender"];
            
            $senderObj = getUserFromID($datarow["Sender"]);
            $senderName = $senderObj->name;
            $messageResultObj->senderName = $senderName;
            
            $messageResultObj->receiverID = $datarow["Receiver"];
            
            $receiverObj = getUserFromID($datarow["Receiver"]);
            $receiverName = $receiverObj->name;
            $messageResultObj->receiverName = $receiverName;
            
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

	function addMessage($data) {
		global $_USER; 

		if(!isset($_USER['uid'])) {
			//Ideally this code path should never be hit in production
			$GLOBALS["_PLATFORM"]->sandboxHeader('HTTP/1.1 401 Unauthorized');
			die();
		}

		$data =json_decode($data);
		$sender = getUser($_USER['uid']);

		$dbQuery = "INSERT INTO Message (TransactionID, DateSent, Date1, Date2, Date3, Location1, Location2, Note, Sender, Receiver) 
		            VALUES (".$data->tranid
                            .", NOW(), '".$data->date1
                            ."', '".$data->date2
                            ."', '".$data->date3
                            ."', '".$data->location1
                            ."', '".$data->location2
                            ."', '".$data->note
                            ."', ".$sender->id
                            .", ".$data->receiverID
                            .")";

        $result = getDBResultInserted($dbQuery,'messageid');

		header("Content-type: application/json");
		echo json_encode($result);
    }

?>
