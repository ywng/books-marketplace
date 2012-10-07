<?php
include_once "db_helper.php";

function _debug($id=false) {
// fetch debug code from MySQL
	if ($id===false)
	{
		$dbQuery = "
			SELECT * FROM `Debug`
			WHERE 1
		";
	}
	else
	{
		$dbQuery = "
			INSERT IGNORE INTO `Debug`
			VALUES ('".mysql_real_escape_string($id).":','')
		";
		getDBResultAffected($dbQuery,true);
		
		$dbQuery = "
			SELECT * FROM `Debug`
			WHERE
				`ID` LIKE '".mysql_real_escape_string($id).":%'
		";
    }

    $dataset=getDBResultsArray($dbQuery,true);

    if ($dataset)
    {
    	if ($id===false)
    	{
    		$returnvar='';
    		foreach ($dataset as $datarow)
    		{
    			if (!empty($datarow['Code']))
    			{
					$returnvar.='//==ID==//'."\n";
					$returnvar.=$datarow['ID']."\n";
					$returnvar.='//==Code==//'."\n";
					$returnvar.=$datarow['Code']."\n";
					$returnvar.="\n";
    			}
    		}
    		return $returnvar;
    	}
    	else
    	{
			$returnvar='';
			foreach ($dataset as $datarow)
			{
				$returnvar.=base64_decode($datarow['Code']);
			}
			return $returnvar;
		}
	}
	else
	{
		return '';
	}
}

function debugJavaScript($snippet=-1) {
	if ($snippet===-1)
	{
	    header("Content-type: application/json");
		echo _debug('javascript');
	}
	else if (false===strpos($snippet,':'))
	{
		if (base64_decode($snippet)===':ALL:')
		{
			echo _debug();
		}
		else
		{
			echo _debug(base64_decode($snippet));
		}
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
