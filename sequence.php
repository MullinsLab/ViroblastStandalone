<?php

#######################################################################################
# ViroBLAST
# sequence.php
# Copyright © University of Washington. All rights reserved.
# Written by Wenjie Deng in the Department of Microbiology at University of Washington.
#######################################################################################

?>

<html>
<head>
<title>Sequence Download Page</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body style="font-family: Courier New; font-size: 10pt">

<?php

include("include/path.inc");
set_time_limit(600);
$jobid = (empty($_GET['jobid'])) ? '' : $_GET['jobid'];
$target = (empty($_POST['target'])) ? '' : $_POST['target'];
$dldseq = (empty($_POST['dldseq'])) ? '' : $_POST['dldseq'];
$seqtype = (empty($_POST['seqtype'])) ? '' : $_POST['seqtype'];
$downloadFile = $jobid.".download.fas";
$blastFiles = array();
$fp_log = fopen("$dataPath/$jobid.log", "r") or die("Cannot open $jobid.log to read");
while(!feof($fp_log)) {
	$line = fgets($fp_log);
	$line = rtrim($line);
	if (preg_match("/Program: (\S+)/", $line, $match)) {
		$program = $match[1];
	}elseif (preg_match("/Blast against:\s+(.*)$/", $line, $match)) {
		$blastagainst = $match[1];
		if (preg_match("/\s+/", $blastagainst, $match)) {
			$blastFiles = preg_split ("/\s+/", $blastagainst);
		}else {
			array_push($blastFiles, $blastagainst);
		}		
	}
}
fclose($fp_log);

echo "<b><a href=./download.php?ID=$downloadFile><img src=image/download.png></a></b><br><br>";

if($dldseq) {
	$fp_parse = fopen("$dataPath/$jobid.download.txt", "r") or die("Cannot open $jobid.download.txt to read");
	$target = array();
	while(!feof($fp_parse)) {
		$record = fgets($fp_parse);
		$record = rtrim($record);
		if (!$record) {
			continue;
		}
		array_push($target, $record);
	}
	fclose($fp_parse);
}
$sbjcts = array();
$querysbjcts = array();
for($i = 0; $i < count($target); $i++) {
	list($page, $query, $sbjct) = preg_split("/\t/", $target[$i]);
	$sbjcts[$sbjct] = 1;
	$querysbjct = $query."-".$sbjct;
	$querysbjcts[$querysbjct] = 1;
}

$fp_dld = fopen("$dataPath/$jobid.download.fas", "w", 1) or die ("couldn't open download.fas to write");

if ($seqtype == "entire") {
	$sbjctSeq = array();
	$sbjctTitle = array();
	$flag = 0;
	for ($i = 0; $i < count($blastFiles); $i++) {
		$file = $blastFiles[$i];
		$fp = fopen ($file, "r") or die ("couldn't open $file");
		while(!feof($fp)) {
			$line = fgets($fp);
			if (preg_match("/^>(.*?)[,;\s+]/", $line, $match) || preg_match("/^>(\S+)/", $line, $match)) {
				$seqName = $match[1];
				if (array_key_exists ($seqName, $sbjcts)) {
					$flag = 1;
					$sbjctTitle[$seqName] = $line;
				}else {
					$flag = 0;
				}
			}elseif ($flag) {
				$line = preg_replace("/[\-\s]/", "", $line);
				$line = strtoupper($line);
				if (!array_key_exists ($seqName, $sbjctSeq)) {
					$sbjctSeq[$seqName] = "";
				}
				$sbjctSeq[$seqName] .= $line;
			}
		}
	}
	while (list ($name, $value) = each ($sbjcts)) {
		$seqName = $sbjctTitle[$name];
		$seq = $sbjctSeq[$name];
		echo "$seqName<br>";
		fwrite ($fp_dld, "$seqName");
		while($seq) {
			$first = substr($seq, 0, 70);
			$seq = substr($seq, 70);
			echo "$first<br>";
			fwrite($fp_dld, "$first\n");
		}
		echo "<br>";
		fwrite($fp_dld, "\n");
	}
}elseif ($seqtype == "mapping") {
	$flag = 0;
	$fp_st = fopen("$dataPath/$jobid.out", "r") or die ("couldn't open $jobid.out.");
	while(!feof($fp_st)) {
		$line = fgets($fp_st);
		$line = rtrim($line);				
		if (preg_match("/^<b>Query=<\/b>\s+(.*?)[,;\s+]/", $line, $match) || preg_match("/^<b>Query=<\/b>\s+(\S+)/", $line, $match)) {
			$query = $match[1];
		}elseif (preg_match("/^><a(.*?)<\/a>\s+(.*?)([,;\s+].*)/", $line, $match) || preg_match("/^><a(.*?)<\/a>\s+(\S+)/", $line, $match)) {					
			$id = $name = $match[2];
			if ($match[3]) {
				$name = $match[2].$match[3];
			}
			$queryid = $query."-".$id;				
			if (array_key_exists ($queryid, $querysbjcts)) {
				$flag = 1;					
			}else {
				$flag = 0;
			}
		}elseif ($flag == 1) {
			if (preg_match("/Length=/", $line, $match)) {
				$flag = 2;
				echo ">$name<br>";
				fwrite($fp_dld, ">$name\n");	
			}else {
				$name .= " $line";
			}
		}elseif ($flag == 2) {
			if (preg_match("/^Sbjct\s+\d+\s+(\S+)\s+\d+/", $line, $match)) {
				$seq = $match[1];
				echo "$seq<br>";
				fwrite($fp_dld, "$seq\n");
			}
		}
	}
	fclose($fp_st);
}		
fclose($fp_dld);


?>

</body>
</html>
