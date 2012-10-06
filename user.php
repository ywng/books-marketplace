<?php
include_once 'db_helper.php';

class User 
{
    public $id;
    public $name;
    public $aliasuid;
    public $email;
    public $level;
    public $major;
};

function downloadUserObject($alias)
{
  $userObj = new User();
  
  $url = "http://m2.cip.gatech.edu/proxy/iam-dev01.iam.gatech.edu/directory/people?uid=".$alias;
  
  $curlObj = curl_init();
  curl_setopt($curlObj, CURLOPT_URL, $url);
  curl_setopt($curlObj, CURLOPT_HEADER, 0); 
  curl_setopt($curlObj, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curlObj, CURLOPT_TIMEOUT, 10);
  
  $response = curl_exec($curlObj);
  curl_close($curlObj);
  
  
  $xml = new SimpleXMLElement($response);
  if(!$xml) {
    // could not fetch user object
    return $userObj;
  }

  $person = $xml->people->person[0];
  $userObj->name = $person->displayName;
  $userObj->email = $person->mail;
  $userObj->level = $person->title;
  $userObj->major = $person->ou;

  return $userObj;
}

function getUser($alias) {
    $userObj = new User();
    $dbQuery = "SELECT Id, Name, AliasUID, Email, Level, Major 
                FROM User 
                WHERE AliasUID = '".$alias."';";
    
    $dataset = getDBResultsArray($dbQuery, true);
    if(count($dataset) > 0) { //this user already exists
        $userObj->id = $dataset[0]["Id"];
        $userObj->name = $dataset[0]["Name"];
        $userObj->aliasuid = $dataset[0]["AliasUID"];
        $userObj->email = $dataset[0]["Email"];
        $userObj->level = $dataset[0]["Level"];
        $userObj->major = $dataset[0]["Major"];
    }
    else {
        // use GTDirectory API to get the user
        $downloadedUserObj = downloadUserObject($alias);
        
        //weirldy, this cast is necessary. 
        //else php treats it as key-value pair
        $userObj->name = (string)$downloadedUserObj->name[0];
        $userObj->email = (string)$downloadedUserObj->email[0];
        $userObj->level = (string)$downloadedUserObj->level[0];
        $userObj->major = (string)$downloadedUserObj->major[0];
        $userObj->aliasuid = (string)$alias;

        $dbQuery = "INSERT INTO User(Name, AliasUID, Email, Level, Major)
                    VALUES('".$userObj->name
                    ."', '".$userObj->aliasuid
                    ."', '".$userObj->email
                    ."', '".$userObj->level
                    ."', '".$userObj->major."');";
        
        $result = getDBResultInserted($dbQuery,'userid');
        $userObj->id = $result['userid'];            
    }

    return userObj;
    //header("Content-type: application/json");
    //echo json_encode($userObj);
}
?>
