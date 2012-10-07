<?php
include_once "db_helper.php";

function _debug($id) {
// fetch debug code from MySQL
    $dbQuery = "
		SELECT * FROM `Debug`
		WHERE
			`ID` LIKE '".mysql_real_escape_string($id).":%'
    ";

    $dataset=getDBResultsArray($dbQuery,true);

    header("Content-type: application/json");
    if ($dataset)
    {
    	$returnvar='';
    	foreach ($dataset as $datarow)
    	{
    		$returnvar.=base64_decode($dataset[0]['Code']).';';
    	}
		return $returnvar;
	}
	else
	{
		return '';
	}
}

function debugJavaScript($snippet=-1) {
	if ($snippet===-1)
	{
		echo _debug('javascript');
	}
	else
	{
		$output=array();
		list($id,$code)=explode(':',$snippet);
		$id=base64_decode($id);
		$code=base64_encode(base64_decode($code));
		$dbQuery = "
			INSERT IGNORE INTO
				`Debug` (`ID`,`Code`)
			VALUES ('".mysql_real_escape_string($id)."','')";
		$output[]=getDBResultAffected($dbQuery,true);
		$dbQuery = "
			UPDATE `Debug`
			SET `Code`='".mysql_real_escape_string($code)."'
			WHERE `ID` LIKE '".mysql_real_escape_string($id)."';
		";
		$output[]=getDBResultAffected($dbQuery,true);
		echo json_encode($output)."\n";
	}
}

?>
