<?php

#######################################################################################
# ViroBLAST
# blastresult.php
# Copyright © University of Washington. All rights reserved.
# Written by Wenjie Deng in the Department of Microbiology at University of Washington.
#######################################################################################

?>

<html>
<head><title>ViroBLAST Result Page</title>
<link href="stylesheets/viroblast.css"  rel="Stylesheet" type="text/css" />
<script type="text/javascript" src='javascripts/sorttable.js'></script>
<script type="text/javascript">
	function checkform(form) {
		var checkbox_checked = 0;
		if (form.dldseq.checked) {
			checkbox_checked++;
		}else {
			for (var i = 0; i < form.checkedSeq.length; i++) {
				if (form.checkedSeq[i].checked) {
					checkbox_checked++;
					break;
				}
			}
		}
		
		if (checkbox_checked == 0) {
			alert ("Please check the sequence(s) you want to download");
			return false;
		}
		return true;
	}
</script>
</head>
<body>
    <div id="header">
	    <div class="spacer">&nbsp;</div>    
		<span class="logo"><a name="top"></a>ViroBLAST Result</span>   
    </div>
    
    <div id="nav">
    	<span class='nav'><a href="viroblast.php" class="nav">Home</a></span>
		<span class='nav'><a href=docs/aboutviroblast.html class="nav">About ViroBLAST</a></span>
		<span class='nav'><a href=docs/viroblasthelp.html class="nav">Help</a></span>
		&nbsp;
	</div>
	
	<div class="spacer">&nbsp;</div>
    
    <div id="indent">

<?php

include("include/path.inc");

$jobid = (empty($_GET['jobid'])) ? '' : $_GET['jobid'];
$blastdb = (empty($_POST['blastdb'])) ? '' : $_POST['blastdb'];
$blastpath = (empty($_POST['blastpath'])) ? '' : $_POST['blastpath'];
$patientIDarray = (empty($_POST['patientIDarray'])) ? '' : $_POST['patientIDarray'];
$opt = (empty($_GET['opt'])) ? '' : $_GET['opt'];
$blast_flag = (empty($_POST['blast_flag'])) ? '' : $_POST['blast_flag'];
$filter_flag = (empty($_POST['filter_flag'])) ? '' : $_POST['filter_flag'];
$filt_val = (empty($_POST['filt_val'])) ? '' : $_POST['filt_val'];
$cutoffType = (empty($_POST['cutoffType'])) ? '' : $_POST['cutoffType'];
$pct_cutoff = (empty($_POST['pct_cutoff'])) ? '' : $_POST['pct_cutoff'];
$blst_cutoff = (empty($_POST['blst_cutoff'])) ? '' : $_POST['blst_cutoff'];
$searchType = (empty($_POST['searchType'])) ? '' : $_POST['searchType'];
$program = (empty($_POST['program'])) ? '' : $_POST['program'];
$dot = (empty($_GET['dot'])) ? '' : $_GET['dot'];
$querySeq = (empty($_POST['querySeq'])) ? '' : $_POST['querySeq'];
$blastagainstfile = (empty($_FILES['blastagainstfile']['name'])) ? '' : $_FILES['blastagainstfile']['name'];
$alignmentView = (empty($_GET['alignmentView'])) ? '' : $_GET['alignmentView'];

if ($blast_flag == 1) {
	$jobid = time().rand(10, 99);
}
if (!$blast_flag && !$jobid) {
	echo "<p>Error: No job submitted.</p>";	
	footer();
	exit;
}

if ($searchType == 'advanced') {
	$expect=(empty($_POST['expect'])) ? 10 : $_POST['expect'];
	$wordSize = (empty($_POST['wordSize'])) ? '' : $_POST['wordSize'];
	$targetSeqs = (empty($_POST['targetSeqs'])) ? '' : $_POST['targetSeqs'];
	$mmScore = (empty($_POST['mmScore'])) ? '' : $_POST['mmScore'];
	$matrix = (empty($_POST['matrix'])) ? '' : $_POST['matrix'];
	$gapCost = (empty($_POST['gapCost'])) ? '' : $_POST['gapCost'];	
	$filter = (empty($_POST['filter'])) ? 'F' : $_POST['filter'];
	$softMask = (empty($_POST['softMask'])) ? 'F' : $_POST['softMask'];
	$lowerCaseMask = (empty($_POST['lowerCaseMask'])) ? 'F' : $_POST['lowerCaseMask'];
	$ungapAlign = (empty($_POST['ungapAlign'])) ? 'F' : $_POST['ungapAlign'];
	$alignmentView = (empty($_POST['outFmt'])) ? 0 : $_POST['outFmt'];	
	$geneticCode = (empty($_POST['qCode'])) ? '' : $_POST['qCode'];
	$dbGeneticCode = (empty($_POST['dbCode'])) ? '' : $_POST['dbCode'];
	$otherParam = (empty($_POST['OTHER_ADVANCED'])) ? '' : $_POST['OTHER_ADVANCED'];	
	if ($otherParam) {
		if (!preg_match("/^\s+$/", $otherParam) && !preg_match("/^\s*\-[A-Za-z]/", $otherParam)) {
			echo "Error: The other advanced options must start with \"-\"";
			exit;
		}
	}	
	$advanceParam = "$expect!#%$wordSize!#%$targetSeqs!#%$mmScore!#%$matrix!#%$gapCost!#%$filter!#%$softMask!#%$lowerCaseMask!#%$ungapAlign!#%$alignmentView!#%$geneticCode!#%$dbGeneticCode!#%$otherParam";
}else {
	$advanceParam = "";
}

if (!$alignmentView) {
	$alignmentView = 0;
}

if($blast_flag == 1) {
	$nlstr = chr(10);
	$crstr = chr(13);
		
	if($_FILES['queryfile']['name']) {
		$uploadfile = "$dataPath/$jobid.blastinput.txt";	
		if (move_uploaded_file($_FILES['queryfile']['tmp_name'], $uploadfile)) {
		
		}else {
		   print "Couldn't upload the file. Here's some debugging info:\n";
		   print_r($_FILES);
		   exit;
		}
		
		@ $fp = fopen($uploadfile, "r");
		if(!$fp) {
			echo "<p><strong> Error: couldn't open $uploadfile </strong></p></body></html>";
			exit;
		}
		$buffer = fread($fp, filesize($uploadfile));
		fclose($fp);
	
		if(!preg_match("/>/", $buffer)) {
			echo "<p style='color: red'>Error: The uploading sequence file is not in fasta format. Please format your sequence file and upload again.</p><br>";
			exit;
		}else{
			if(!preg_match("/$nlstr/", $buffer)) {
				$buffer_mod = str_replace($crstr, $nlstr, $buffer);
				$buffer = $buffer_mod;			
			}
				
			$i = 0;
			while(substr($buffer, $i, 1) != ">") {
				$i++;
			}
			$buffer = substr($buffer, $i);
			
			@ $fp = fopen($uploadfile, "w", 1);
			if(!$fp) {
				echo "<p><strong> Error: ouldn't open $uploadfile </strong></p></body></html>";
				exit;
			}
			fwrite($fp, $buffer);
			fclose($fp);
		}		
	}elseif($querySeq && !preg_match("/^\s+$/", $querySeq)) {
		@ $fp1=fopen("$dataPath/$jobid.blastinput.txt", "w",1);
		if (!$fp1)
		{
			echo "<p><strong> Error: couldn't open $dataPath/$jobid.blastinput.txt </strong></p></body></html>";
			exit;
		}
		
		fwrite($fp1, $querySeq);
		fclose($fp1);
	}else {
		echo "<p style='color: red'>Error: please enter your query sequence or upload your fasta sequence file.</p><br>";
		exit;
	}
	
	if(!$_FILES['blastagainstfile']['name'] && !$patientIDarray[0]) {
		echo "<p style='color: red'>Error: please choose database(s) or upload your fasta sequence file to blast against.</p><br>";
		exit;
	}
	
	if($_FILES['blastagainstfile']['name']) {
		$uploadfile = "$dataPath/$jobid.blastagainst.txt";
	
		if (move_uploaded_file($_FILES['blastagainstfile']['tmp_name'], $uploadfile)) {
		}else {
		   print "Couldn't upload file. Here's some debugging info:\n";
		   print_r($_FILES);
		   exit;
		}
	
		@ $fp = fopen($uploadfile, "r");
		if(!$fp) {
			echo "<p><strong> Error: ouldn't open $uploadfile </strong></p></body></html>";
			exit;
		}
		$buffer = fread($fp, filesize($uploadfile));
		fclose($fp);
		
		if(!preg_match("/>/", $buffer)) {
			echo "<p style='color: red'>Error: The uploading sequence file to blast against is not in fasta format. Please format your sequence file and upload again.</p><br>";
			exit;
		}else{
			if(!preg_match("/$nlstr/", $buffer)) {
				$buffer_mod = str_replace($crstr, $nlstr, $buffer);
				$buffer = $buffer_mod;			
			}
				
			$i = 0;
			while(substr($buffer, $i, 1) != ">") {
				$i++;
			}
			$buffer = substr($buffer, $i);
			
			@ $fp = fopen($uploadfile, "w", 1);
			if(!$fp) {
				echo "<p><strong> Error: couldn't open $uploadfile </strong></p></body></html>";
				exit;
			}
			fwrite($fp, $buffer);
			fclose($fp);
		}		
	}
}

if($cutoffType == 'pct') {
	$criterion = $pct_cutoff;
}
if($cutoffType == 'blst') {
	$criterion = $blst_cutoff;
}

if(!$opt || $opt == 'wait') {
	$progressdot = "image/progressdot.png";
	echo "<p><strong>Your job is being processed ";
	for($i = 0; $i <= ($dot%6); $i++) {
		echo "<img src='$progressdot'>";
	}
	echo "</strong></p>";
	$dot += 1;
	echo "<p>Your job id is $jobid.</p>";
	echo "<p>Please wait here to watch the progress of your job.</p>";
	echo "<p>This page will update itself automatically until search is done.</p>";		
}

if(!$opt || $opt == 'wait') {
	echo "<META HTTP-EQUIV=\"refresh\" 
	content=\"10;URL=blastresult.php?jobid=$jobid&alignmentView=$alignmentView&opt=wait&dot=$dot\">";
	echo "<META HTTP-EQUIV=\"expires\" 
		  CONTENT=\"now\">";
}

if($blast_flag == 1) {	
	$blastagainst = "";
	if ($program == "blastn" || $program == "tblastn" || $program == "tblastx") {
		$dbPath = "./db/nucleotide";
	}else {
		$dbPath = "./db/protein";
	}
	
	if($blastagainstfile) {
		$blastagainst = "$dataPath/$jobid.blastagainst.txt";
	}
	
	if ($patientIDarray) {
		for ($i = 0; $i < sizeof($patientIDarray); $i++) {
			$blastagainst .= " $dbPath/$patientIDarray[$i]";			
		}
	}	
	$basicParam = "$jobid!#%$searchType!#%$blastagainst!#%$program!#%$blastpath";	
	/*create child process to run perl script which do the blast search and write output data to apropriate files*/
	system('perl blast.pl '.escapeshellarg($basicParam).' '.escapeshellarg($advanceParam)." >/dev/null &");
}

/* error log if there is error in BLAST */
$errFile = "$dataPath/$jobid.err";
/* parent process continue here to check child process done or not */
$filename = "$dataPath/$jobid.blaststring.txt";
if (file_exists($errFile) && filesize($errFile) > 0) {
	if(!$opt || $opt == 'wait') {
		echo "<script LANGUAGE=JavaScript>";
		echo "location.replace('blastresult.php?jobid=$jobid&opt=none')";
		echo "</script>";
	}else {
		echo "<p>There is error in executing BLAST. Following is the error message:<p>";
		$fperr = fopen("$dataPath/$jobid.err", "r");
		if(!$fperr) {
			echo "<p><strong> $jobid.err error: $errors  </strong></p></body></html>";
			exit;
		}
	
		while (!feof($fperr))
		{
			$line = rtrim(fgets($fperr)); 
			echo "$line<br>";
		}
		fclose($fperr);
	}	
}elseif(file_exists($filename)) {
	if ($alignmentView) {
		echo "<script LANGUAGE=JavaScript>";
		echo "location.replace('data/$jobid.blast')";
		echo "</script>";
	}else {
		if($blast_flag == 'Parse again') {
			$print_flag = 0;
			$cutoff_count = 0;
		
			@ $fpout=fopen("$dataPath/$jobid.par", "r");
			if (!$fpout)
			{
				echo "<p><strong> $jobid.par error: $phperrormsg  </strong></p></body></html>";
				exit;
			}
			
			@ $fpout3 = fopen("$dataPath/$jobid.out.par", "w", 1);
			if(!$fpout3) {
				echo "<p><strong> $jobid.out.par error: $errors  </strong></p></body></html>";
				exit;
			}
		
			while (!feof($fpout))
			{
				$fpout2_str = '';
				$line = rtrim(fgets($fpout));
				if (!$line) {
					continue;
				}
				list($page, $query_name, $match_name, $score, $identities, $percentage, $e_value, $link) = preg_split("/\t/", $line);
				
				if($cutoffType == 'pct') {
					$subject = $percentage;
				}else {
					$subject = $score;
				}
	
				if($subject >= $criterion) {
					fwrite($fpout3, "$page\t$query_name\t$match_name\t$score\t$identities\t$percentage\t$e_value\t$link\n");
					$cutoff_count++;
				}
			}
	
			fclose ($fpout);
			fclose($fpout3);
			
			@ $fp = fopen("$dataPath/$jobid.blastcount.txt", "w", 1);
			if(!$fp) {
				echo "<p><strong> error: $php_errormsg  </strong></p></body></html>";
				exit;
			}else {
				fwrite($fp, "$cutoff_count\n");
			}
			
			fclose($fp);
		}
		
		$filename = "$dataPath/$jobid.blastcount.txt";
		
		while(!file_exists($filename)) {}
		
		if(!$opt || $opt == 'wait') {
			echo "<script LANGUAGE=JavaScript>";
			echo "location.replace('blastresult.php?jobid=$jobid&opt=none')";
			echo "</script>";
		}else {
			@ $fp = fopen("$dataPath/$jobid.blastcount.txt", "r");
			if(!$fp) {
				echo "<p><strong> error: $php_errormsg  </strong></p></body></html>";
				exit;
			}
			
			if(!feof($fp)) {
				$cutoff_count = fgets($fp);
			}
			fclose($fp);
		
			@ $fp = fopen("$dataPath/$jobid.blaststring.txt", "r");
			if(!$fp) {
				echo "<p><strong> error: $php_errormsg  </strong></p></body></html>";
				exit;
			}
			
			if(!feof($fp)) {
				$blastagainststring = rtrim(fgets($fp));
			}
			fclose($fp);
			
			if($cutoff_count == 0) {
				echo "<p>No comparison meets cutoff criterion. Please change expect value to blast again.</p>";
			}else {
				echo "<p><a href=data/$jobid.blast1.html target='_blank'>Inspect BLAST output</a><br>";			
				echo "<form action='blastresult.php?jobid=$jobid&opt=$opt' method='post'>";		
				echo "<p>Filter current page by score:</p>";
				echo "<p>&nbsp;&nbsp;&nbsp;Show <select name='filt_val'>";
				echo "<option value='0' selected>- All -";
				echo "<option value='1'>Top score";
				echo "<option value='5'>Top 5 scores";
				echo "<option value='10'>Top 10 scores";
				echo "</select> for each query sequence <input type='submit' name='filter_flag' value='Filter'></font></p>";				
				echo "<p>Re-parse current blast results (please select cutoff criterion):</p>";
				echo "<p><table style='font-size: 12px'>";
				echo "<tr><td><input type='radio' checked name='cutoffType' value='pct'>Similarity percentage</td><td></td>";
				echo "<td>Cutoff %: </td><td><input type='text' name='pct_cutoff' value=95 size=6 maxlength=6></td></tr>";				
				echo "<tr><td><input type='radio' name='cutoffType' value='blst'>Blast score</td><td></td>";		
				echo "<td>Cutoff score: </td><td><input type='text' name='blst_cutoff' value=1000 size=6 maxlength=6></td>";
				echo "<td><input type='submit' name='blast_flag' value='Parse again'>";				
				echo "</td></tr></table></p>";
				echo "</form>";		
				echo "<form action='sequence.php?jobid=$jobid' method='post' target='_blank' onsubmit=\"return checkform(this);\">";
				echo "<p>Retrieve and download subject sequences in FASTA format:</p>";		
				echo "<p><input type='checkbox' name='dldseq' value='all'>  Check here to download All sequences... ";
				echo "OR select particular sequences of interest below</p>";	
				echo "<p><input type='submit' value='Submit'> your selection of sequences to download</p>";	
				echo "<p><table border = 1 style='font-size:10px' width=100% class='sortable'>";
				echo "<thead><tr align='center'><th>Query</th><th>Subject</th><th>Score</th><th>Identities (Query length)</th><th>Percentage</th><th>Expect</th></tr></thead>";
				echo "<tbody>";
				@ $fp = fopen("$dataPath/$jobid.download.txt", "w", 1) or die("Cannot open file: $jobid.download.txt");
				
				if($blast_flag == 'Parse again' || ($opt == 'none' && !$filter_flag)) {
					@ $fpout3=fopen("$dataPath/$jobid.out.par", "r");
					if(!$fpout3) {
						echo "<p><strong> error: $php_errormsg  </strong></p></body></html>";
						exit;
					}
					$i = 0;
					$queryName = $preQueryName = "";
					while(!feof($fpout3)) {
						$row = fgets($fpout3);
						if (!$row) {
							continue;
						}
						$element = preg_split("/\t/", $row);		
						$page = $element[0];
						$queryName = $element[1];
						$target_name = $element[7];
						$var_target = $page."\t".$element[1]."\t".$element[2];
						if(count($element) != 1) {
							if($queryName == $preQueryName) {
								$i++;
							}else {
								$i = 0;
							}
							
							if($i < 10) {
								echo "<tr align='center'><td>$element[1]</td><td align=left><input type='checkbox' id='checkedSeq' name='target[]' value=\"$var_target\">$target_name</td><td><a href=data/$jobid.blast$page.html#$element[1]$element[2] target='_blank'>$element[3]</a></td><td>$element[4]</td><td>$element[5]</td><td>$element[6]</td></tr>";
								fwrite($fp, "$var_target\n");
							}					
						}
						$preQueryName = $queryName;
					}
					fclose($fpout3);
				}
				
				if($filter_flag == 'Filter')
				{
					@ $fpout3=fopen("$dataPath/$jobid.out.par", "r");
					if(!$fpout3) {
						echo "<p><strong> error: $php_errormsg  </strong></p></body></html>";
						exit;
					}
					$i = 0;
					while(!feof($fpout3)) {
						$row = fgets($fpout3);
						if (!$row) {
							continue;
						}
						$element = preg_split("/\t/", $row);
						$page = $element[0];
						$target_name = $element[7];
						$var_target = $page."\t".$element[1]."\t".$element[2];
						if(count($element) != 1) {
							if($filt_val != 0) {
								if($i == 0) {
									$query_name = $element[1];
									echo "<tr align='center'><td>$element[1]</td><td align=left><input type='checkbox' id='checkedSeq' name='target[]' value=\"$var_target\">$target_name</td><td><a href=data/$jobid.blast$page.html#$element[1]$element[2] target='_blank'>$element[3]</a></td><td>$element[4]</td><td>$element[5]</td><td>$element[6]</td></tr>";
									fwrite($fp, "$var_target\n");
									$i++;
								}elseif($query_name == $element[1] && $i < $filt_val) {
									echo "<tr align='center'><td>$element[1]</td><td align=left><input type='checkbox' id='checkedSeq' name='target[]' value=\"$var_target\">$target_name</td><td><a href=data/$jobid.blast$page.html#$element[1]$element[2] target='_blank'>$element[3]</a></td><td>$element[4]</td><td>$element[5]</td><td>$element[6]</td></tr>";
									fwrite($fp, "$var_target\n");
									$i++;
								}elseif($query_name != $element[1]) {
									echo "<tr align='center'><td>$element[1]</td><td align=left><input type='checkbox' id='checkedSeq' name='target[]' value=\"$var_target\">$target_name</td><td><a href=data/$jobid.blast$page.html#$element[1]$element[2] target='_blank'>$element[3]</a></td><td>$element[4]</td><td>$element[5]</td><td>$element[6]</td></tr>";
									$query_name = $element[1];
									fwrite($fp, "$var_target\n");
									$i=1;
								}
							}else {
								echo "<tr align='center'><td>$element[1]</td><td align=left><input type='checkbox' id='checkedSeq' name='target[]' value=\"$var_target\">$target_name</td><td><a href=data/$jobid.blast$page.html#$element[1]$element[2] target='_blank'>$element[3]</a></td><td>$element[4]</td><td>$element[5]</td><td>$element[6]</td></tr>";
								fwrite($fp, "$var_target\n");
							}
						}
					}
					fclose($fpout3);
				}
				fclose($fp);
				echo "</tbody></table></form>";
				echo "<p><a href=\"#top\">Top</a>";	
			}	
		}
	}	
}

?>

</div>
	<div id="footer" align="center">
		<p><font color='gray'>&copy; 2005-2010 University of Washington. All rights reserved.&nbsp;<a href=docs/termsofservice.html>Terms of Service</a></p>
	</div>
</body>
</html>
