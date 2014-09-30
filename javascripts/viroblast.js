function checkform(form, value) {
	var dbSelected = false;
	var submitForm = true;	
	
	for (var i = 0; i < form.dbList.length; i++) {
		if (form.dbList.options[i].selected == true) {
			dbSelected = true;
			break;
		}
	}
	
	if (form.querySeq.value.match(/^\s*$/) && form.queryfile.value.match(/^\s*$/)) {
		alert ("Please enter your query sequence or upload your sequence fasta file");
		submitForm = false;
		return;
	}else if (form.blastagainstfile.value == "" && dbSelected == false) {
		alert ("Please choose database(s) or upload your sequence fasta file to blast against");
		submitForm = false;
		return;
	}
	if (value == "Advanced search") {
		var advanceInput = document.createElement("input");
		advanceInput.setAttribute("type", "hidden");
		advanceInput.setAttribute("name", "searchType");
		advanceInput.setAttribute("value", "advanced");
		form.appendChild(advanceInput);
		if (form.OTHER_ADVANCED.value) {
			var advancedStr = form.OTHER_ADVANCED.value;
			if (!advancedStr.match(/^\s+$/) && !advancedStr.match(/^\s*\-[A-Za-z]/)) {
				alert ("Other parameters field must start with \"-\" followed by options");
				submitForm = false;
				return;
			}
		}
		if (form.expect.value.match(/^\s*$/) || (!form.expect.value.match(/^\s*\d*\.?\d+\s*$/) && !form.expect.value.match(/^\s*\d*[eE][\+\-]\d+\s*$/))) {
			alert ("Please enter real number for Expact value");
			submitForm = false;
			return;
		}
	}else {
		var advanceInput = document.createElement("input");
		advanceInput.setAttribute("type", "hidden");
		advanceInput.setAttribute("name", "searchType");
		advanceInput.setAttribute("value", "basic");
		form.appendChild(advanceInput);
	}
	
	if (submitForm) {
		form.submit();
	}
}

function removeChildNodes(parentNode) {
	var kids = parentNode.childNodes;    // Get the list of children
    var numkids = kids.length;  // Figure out how many children there are
    for(var i = numkids-1; i >= 0; i--) {  // Loop backward through the children
        var c = parentNode.removeChild(kids[i]);    // Remove a child
    }
}

function changeDBList (value, dbListObj, dbvalue) {
	var dbHash = dbvalue.split(",");
	removeChildNodes (dbListObj);
	for (var i = 0; i < dbHash.length; i++) {
		var dbArray = dbHash[i].split("=>");
		var dbOption = document.createElement("option");
		dbOption.setAttribute("value", dbArray[0]);
		dbOption.appendChild(document.createTextNode(dbArray[1]));
		dbListObj.appendChild(dbOption);
	}
}

function changeGapcostsOptions (value, id) {
	var gapcostsSelectNode = document.getElementById(id);
	removeChildNodes(gapcostsSelectNode);
	var gapcostsOptions = Array ();
	if (value == '1,-2') {
		gapcostsOptions[0] = 'Existence: 5, Extension: 2';
		gapcostsOptions[1] = 'Existence: 2, Extension: 2';
		gapcostsOptions[2] = 'Existence: 1, Extension: 2';
		gapcostsOptions[3] = 'Existence: 0, Extension: 2';
		gapcostsOptions[4] = 'Existence: 3, Extension: 1';
		gapcostsOptions[5] = 'Existence: 2, Extension: 1';
		gapcostsOptions[6] = 'Existence: 1, Extension: 1';
	}else if (value == '1,-3') {
		gapcostsOptions[0] = 'Existence: 5, Extension: 2';
		gapcostsOptions[1] = 'Existence: 2, Extension: 2';
		gapcostsOptions[2] = 'Existence: 1, Extension: 2';
		gapcostsOptions[3] = 'Existence: 0, Extension: 2';
		gapcostsOptions[4] = 'Existence: 2, Extension: 1';
		gapcostsOptions[5] = 'Existence: 1, Extension: 1';
	}else if (value == '1,-4') {
		gapcostsOptions[0] = 'Existence: 5, Extension: 2';
		gapcostsOptions[1] = 'Existence: 1, Extension: 2';
		gapcostsOptions[2] = 'Existence: 0, Extension: 2';
		gapcostsOptions[3] = 'Existence: 2, Extension: 1';
		gapcostsOptions[4] = 'Existence: 1, Extension: 1';
	}else if (value == '2,-3') {
		gapcostsOptions[0] = 'Existence: 5, Extension: 2';
		gapcostsOptions[1] = 'Existence: 4, Extension: 4';
		gapcostsOptions[2] = 'Existence: 2, Extension: 4';
		gapcostsOptions[3] = 'Existence: 0, Extension: 4';
		gapcostsOptions[4] = 'Existence: 3, Extension: 3';
		gapcostsOptions[5] = 'Existence: 6, Extension: 2';
		gapcostsOptions[6] = 'Existence: 4, Extension: 2';
		gapcostsOptions[7] = 'Existence: 2, Extension: 2';
	}else if (value == '1,-1') {
		gapcostsOptions[0] = 'Existence: 5, Extension: 2';
		gapcostsOptions[1] = 'Existence: 3, Extension: 2';
		gapcostsOptions[2] = 'Existence: 2, Extension: 2';
		gapcostsOptions[3] = 'Existence: 1, Extension: 2';
		gapcostsOptions[4] = 'Existence: 0, Extension: 2';
		gapcostsOptions[5] = 'Existence: 4, Extension: 1';
		gapcostsOptions[6] = 'Existence: 3, Extension: 1';
		gapcostsOptions[7] = 'Existence: 2, Extension: 1';
	}else if (value == '4,-5') {
		gapcostsOptions[0] = 'Existence: 12, Extension: 8';
		gapcostsOptions[1] = 'Existence: 6, Extension: 5';
		gapcostsOptions[2] = 'Existence: 5, Extension: 5';
		gapcostsOptions[3] = 'Existence: 4, Extension: 5';
		gapcostsOptions[4] = 'Existence: 3, Extension: 5';
	}else if (value == 'BLOSUM62') {
		gapcostsOptions[0] = 'Existence: 11, Extension: 1';
		gapcostsOptions[1] = 'Existence: 9, Extension: 2';
		gapcostsOptions[2] = 'Existence: 8, Extension: 2';
		gapcostsOptions[3] = 'Existence: 7, Extension: 2';
		gapcostsOptions[4] = 'Existence: 12, Extension: 1';
		gapcostsOptions[5] = 'Existence: 10, Extension: 1';
	}else if (value == 'PAM30') {
		gapcostsOptions[0] = 'Existence: 9, Extension: 1';
		gapcostsOptions[1] = 'Existence: 7, Extension: 2';
		gapcostsOptions[2] = 'Existence: 6, Extension: 2';
		gapcostsOptions[3] = 'Existence: 5, Extension: 2';
		gapcostsOptions[4] = 'Existence: 10, Extension: 1';
		gapcostsOptions[5] = 'Existence: 8, Extension: 1';
	}else if (value == 'PAM70' || value == 'BLOSUM80') {
		gapcostsOptions[0] = 'Existence: 10, Extension: 1';
		gapcostsOptions[1] = 'Existence: 8, Extension: 2';
		gapcostsOptions[2] = 'Existence: 7, Extension: 2';
		gapcostsOptions[3] = 'Existence: 6, Extension: 2';
		gapcostsOptions[4] = 'Existence: 11, Extension: 1';
		gapcostsOptions[5] = 'Existence: 9, Extension: 1';
	}else if (value == 'BLOSUM45') {
		gapcostsOptions[0] = 'Existence: 15, Extension: 2';
		gapcostsOptions[1] = 'Existence: 13, Extension: 3';
		gapcostsOptions[2] = 'Existence: 12, Extension: 3';
		gapcostsOptions[3] = 'Existence: 11, Extension: 3';
		gapcostsOptions[4] = 'Existence: 10, Extension: 3';
		gapcostsOptions[5] = 'Existence: 14, Extension: 2';
		gapcostsOptions[6] = 'Existence: 13, Extension: 2';
		gapcostsOptions[7] = 'Existence: 12, Extension: 2';
		gapcostsOptions[8] = 'Existence: 19, Extension: 1';
		gapcostsOptions[9] = 'Existence: 18, Extension: 1';
		gapcostsOptions[10] = 'Existence: 17, Extension: 1';
		gapcostsOptions[11] = 'Existence: 16, Extension: 1';
	}
	for (var i = 0; i < gapcostsOptions.length; i++) {
		var gapcostsOption = document.createElement("option");
		gapcostsOption.value = gapcostsOptions[i];
		if (i == 0) {
			gapcostsOption.selected = true;
		}
		gapcostsOption.appendChild(document.createTextNode(gapcostsOptions[i]));
		gapcostsSelectNode.appendChild(gapcostsOption);
	}
}


function changeParameters(value, parameters) {
	var adv_parameters_obj = document.getElementById(parameters);
	removeChildNodes (adv_parameters_obj);
	var expectRow = document.createElement("div");
	expectRow.className = 'row';
	var expectLabel = document.createElement("span");
	expectLabel.className = 'label';
	var expectLink = document.createElement("a");
	expectLink.href = "docs/parameters.html#expect";
	var expectFormw = document.createElement("span");
	expectFormw.className = 'formw';
	var expectObj = document.createElement("input");
	expectObj.type = 'text';
	expectObj.name = 'expect';
	expectObj.id = 'expect';
	expectObj.value = 10;
	expectObj.size = 10;
	expectLink.appendChild(document.createTextNode("Expect threshold"));	
	expectLabel.appendChild(expectLink);
	expectFormw.appendChild(expectObj);
	expectRow.appendChild(expectLabel);
	expectRow.appendChild(expectFormw);
	adv_parameters_obj.appendChild(expectRow);
	
	var wordRow = document.createElement("div");
	wordRow.className = 'row';
	var wordLabel = document.createElement("span");
	wordLabel.className = 'label';
	var wordsizeLink = document.createElement("a");
	wordsizeLink.href = "docs/parameters.html#wordsize";
	var wordFormw = document.createElement("span");
	wordFormw.className = 'formw';
	var wordObj = document.createElement("select");
	wordObj.name = 'wordSize';
	var wordOptions = Array ();
	if (value == 'blastn') {
		wordOptions[0] = 7;
		wordOptions[1] = 11;
		wordOptions[2] = 15;
	}else {
		wordOptions[0] = 2;
		wordOptions[1] = 3;
	}
	for (var i = 0; i < wordOptions.length; i++) {
		var wordOption = document.createElement("option");
		wordOption.value = wordOptions[i];
		if (value == 'blastn') {
			if (wordOptions[i] == 11) {
				wordOption.selected = true;
			}
		}else {
			if (wordOptions[i] == 3) {
				wordOption.selected = true;
			}
		}
		
		wordOption.appendChild(document.createTextNode(wordOptions[i]));
		wordObj.appendChild(wordOption);
	}
	wordsizeLink.appendChild(document.createTextNode("Word size"));	
	wordLabel.appendChild(wordsizeLink);
	wordFormw.appendChild(wordObj);
	wordRow.appendChild(wordLabel);
	wordRow.appendChild(wordFormw);
	adv_parameters_obj.appendChild(wordRow);
	
	var targetRow = document.createElement("div");
	targetRow.className = 'row';
	var targetLabel = document.createElement("span");
	targetLabel.className = 'label';
	var targetLink = document.createElement("a");
	targetLink.href = "docs/parameters.html#targetseqs";
	var targetFormw = document.createElement("span");
	targetFormw.className = 'formw';
	var targetObj = document.createElement("select");
	targetObj.name = 'targetSeqs';
	var targetOptions = Array ();
	targetOptions[0] = 10;
	targetOptions[1] = 50;
	targetOptions[2] = 100;
	targetOptions[3] = 250;
	targetOptions[4] = 500;
	targetOptions[5] = 1000;
	targetOptions[6] = 5000;
	targetOptions[7] = 10000;
	for (var i = 0; i < targetOptions.length; i++) {
		var targetOption = document.createElement("option");
		targetOption.value = targetOptions[i];
		if (targetOptions[i] == 50) {
			targetOption.selected = true;
		}		
		targetOption.appendChild(document.createTextNode(targetOptions[i]));
		targetObj.appendChild(targetOption);
	}
	targetLink.appendChild(document.createTextNode("Max target sequences"));
	targetLabel.appendChild(targetLink);	
	targetFormw.appendChild(targetObj);
	targetRow.appendChild(targetLabel);
	targetRow.appendChild(targetFormw);
	adv_parameters_obj.appendChild(targetRow);
	
	if (value == 'blastn') {
		var mmScoreRow = document.createElement("div");
		mmScoreRow.className = 'row';
		var mmScoreLabel = document.createElement("span");
		mmScoreLabel.className = 'label';
		var mmScoreLink = document.createElement("a");
		mmScoreLink.href = "docs/parameters.html#mmscore";
		var mmScoreFormw = document.createElement("span");
		mmScoreFormw.className = 'formw';
		var mmScoreObj = document.createElement("select");
		mmScoreObj.name = 'mmScore';
		mmScoreObj.onchange = function () {changeGapcostsOptions(this.value, 'gapCost')};
		var mmScoreOptions = Array ();
		mmScoreOptions[0] = '1,-1';
		mmScoreOptions[1] = '1,-2';
		mmScoreOptions[2] = '1,-3';
		mmScoreOptions[3] = '1,-4';
		mmScoreOptions[4] = '2,-3';
		mmScoreOptions[5] = '4,-5';
		for (var i = 0; i < mmScoreOptions.length; i++) {
			var mmScoreOption = document.createElement("option");
			mmScoreOption.value = mmScoreOptions[i];
			if (mmScoreOptions[i] == '2,-3') {
				mmScoreOption.selected = true;
			}		
			mmScoreOption.appendChild(document.createTextNode(mmScoreOptions[i]));
			mmScoreObj.appendChild(mmScoreOption);
		}	
		mmScoreLink.appendChild(document.createTextNode("Match/Mismatch scores"));
		mmScoreLabel.appendChild(mmScoreLink);	
		mmScoreFormw.appendChild(mmScoreObj);
		mmScoreRow.appendChild(mmScoreLabel);
		mmScoreRow.appendChild(mmScoreFormw);
		adv_parameters_obj.appendChild(mmScoreRow);
	}else {
		var matrixRow = document.createElement("div");
		matrixRow.className = 'row';
		var matrixLabel = document.createElement("span");
		matrixLabel.className = 'label';
		var matrixLink = document.createElement("a");
		matrixLink.href = "docs/parameters.html#matrix";
		var matrixFormw = document.createElement("span");
		matrixFormw.className = 'formw';
		var matrixObj = document.createElement("select");
		matrixObj.name = 'matrix';
		matrixObj.onchange = function () {changeGapcostsOptions(this.value, 'gapCost')};
		var matrixOptions = Array ();
		matrixOptions[0] = 'PAM30';
		matrixOptions[1] = 'PAM70';
		matrixOptions[2] = 'BLOSUM80';
		matrixOptions[3] = 'BLOSUM62';
		matrixOptions[4] = 'BLOSUM45';
		for (var i = 0; i < matrixOptions.length; i++) {
			var matrixOption = document.createElement("option");
			matrixOption.value = matrixOptions[i];
			if (matrixOptions[i] == 'BLOSUM62') {
				matrixOption.selected = true;
			}		
			matrixOption.appendChild(document.createTextNode(matrixOptions[i]));
			matrixObj.appendChild(matrixOption);
		}	
		matrixLink.appendChild(document.createTextNode("Matrix"));	
		matrixLabel.appendChild(matrixLink);	
		matrixFormw.appendChild(matrixObj);
		matrixRow.appendChild(matrixLabel);
		matrixRow.appendChild(matrixFormw);
		adv_parameters_obj.appendChild(matrixRow);
	}
	
	if (value != 'tblastx') {
		var gapcostRow = document.createElement("div");
		gapcostRow.className = 'row';
		var gapcostLabel = document.createElement("span");
		gapcostLabel.className = 'label';
		var gapcostLink = document.createElement("a");
		gapcostLink.href = "docs/parameters.html#gapcost";
		var gapcostFormw = document.createElement("span");
		gapcostFormw.className = 'formw';
		var gapcostObj = document.createElement("select");
		gapcostObj.name = 'gapCost';
		gapcostObj.id = 'gapCost';
		var gapcostOptions = Array ();
		if (value == 'blastn') {
			gapcostOptions[0] = 'Existence: 5, Extension: 2';
			gapcostOptions[1] = 'Existence: 4, Extension: 4';
			gapcostOptions[2] = 'Existence: 2, Extension: 4';
			gapcostOptions[3] = 'Existence: 0, Extension: 4';
			gapcostOptions[4] = 'Existence: 3, Extension: 3';
			gapcostOptions[5] = 'Existence: 6, Extension: 2';
			gapcostOptions[6] = 'Existence: 4, Extension: 2';
			gapcostOptions[7] = 'Existence: 2, Extension: 2';
		}else {
			gapcostOptions[0] = 'Existence: 11, Extension: 1';
			gapcostOptions[1] = 'Existence: 8, Extension: 2';
			gapcostOptions[2] = 'Existence: 9, Extension: 2';
			gapcostOptions[3] = 'Existence: 10, Extension: 1';
			gapcostOptions[4] = 'Existence: 7, Extension: 2';
			gapcostOptions[5] = 'Existence: 12, Extension: 1';
		}
		for (var i = 0; i < gapcostOptions.length; i++) {
			var gapcostOption = document.createElement("option");
			gapcostOption.value = gapcostOptions[i];
			if (i == 0) {
				gapcostOption.selected = true;
			}				
			gapcostOption.appendChild(document.createTextNode(gapcostOptions[i]));
			gapcostObj.appendChild(gapcostOption);
		}	
		gapcostLink.appendChild(document.createTextNode("Gap costs"));	
		gapcostLabel.appendChild(gapcostLink);	
		gapcostFormw.appendChild(gapcostObj);
		gapcostRow.appendChild(gapcostLabel);
		gapcostRow.appendChild(gapcostFormw);
		adv_parameters_obj.appendChild(gapcostRow);
	}
	
	var filterRow = document.createElement("div");
	filterRow.className = 'row';
	var filterLabel = document.createElement("span");
	filterLabel.className = 'label';
	var filterLink = document.createElement("a");
	filterLink.href = "docs/parameters.html#filter";
	var filterFormw = document.createElement("span");
	filterFormw.className = 'formw';
	var filterObj;
	var innerHTML;
	if (value != 'blastp') {
		innerHTML = "<input type='checkbox' name='filter' value='T' checked=true>";
	}else {
		innerHTML = "<input type='checkbox' name='filter' value='T'>";
	}
	try {
		filterObj = document.createElement(innerHTML);
	}catch (err) {
		filterObj = document.createElement("input");
		filterObj.type = 'checkbox';
		filterObj.name = 'filter';
		filterObj.value = 'T';
		if (value != 'blastp') {
			filterObj.checked = true;
		}	
	}	
	filterLink.appendChild(document.createTextNode("Filter"));	
	filterLabel.appendChild(filterLink);	
	filterFormw.appendChild(filterObj);
	filterFormw.appendChild(document.createTextNode("Low complexity regions"));
	filterRow.appendChild(filterLabel);
	filterRow.appendChild(filterFormw);
	adv_parameters_obj.appendChild(filterRow);
	
	var lookupRow = document.createElement("div");
	lookupRow.className = 'row';
	var lookupLabel = document.createElement("span");
	lookupLabel.className = 'label';
	var lookupLink = document.createElement("a");
	lookupLink.href = "docs/parameters.html#lookup";
	var lookupFormw = document.createElement("span");
	lookupFormw.className = 'formw';	
	var lookupObj;
	if (value == 'blastn') {
		innerHTML = "<input type='checkbox' name='softMask' value='m' checked=true>";
	}else {
		innerHTML = "<input type='checkbox' name='softMask' value='m'>";
	}
	try {
		lookupObj = document.createElement(innerHTML);
	}catch (err) {
		lookupObj = document.createElement("input");
		lookupObj.type = 'checkbox';
		lookupObj.name = 'softMask';
		lookupObj.value = 'm';
		if (value == 'blastn') {
			lookupObj.checked = true;
		}	
	}	
	var lowercaseObj;
	innerHTML = "<input type='checkbox' name='lowerCaseMask' value='L'>";
	try {
		lowercaseObj = document.createElement(innerHTML);
	}catch (err) {
		lowercaseObj = document.createElement("input");
		lowercaseObj.type = 'checkbox';
		lowercaseObj.name = 'lowerCaseMask';
		lowercaseObj.value = 'L';
	}
	lookupLink.appendChild(document.createTextNode("Mask"));
	lookupLabel.appendChild(lookupLink);	
	lookupFormw.appendChild(lookupObj);
	lookupFormw.appendChild(document.createTextNode("Mask for lookup table only "));
	lookupFormw.appendChild(lowercaseObj);
	lookupFormw.appendChild(document.createTextNode("Mask for lower case letters"));
	lookupRow.appendChild(lookupLabel);
	lookupRow.appendChild(lookupFormw);
	adv_parameters_obj.appendChild(lookupRow);
	
	if (value != 'tblastx') {
		var gapalignRow = document.createElement("div");
		gapalignRow.className = 'row';
		var gapalignLabel = document.createElement("span");
		gapalignLabel.className = 'label';
		var gapalignLink = document.createElement("a");
		gapalignLink.href = "docs/parameters.html#gapalign";
		var gapalignFormw = document.createElement("span");
		gapalignFormw.className = 'formw';
		var gapalignObj = document.createElement("input");
		gapalignObj.type = 'checkbox';
		gapalignObj.name = 'ungapAlign';
		gapalignObj.value = 'T';
		gapalignLink.appendChild(document.createTextNode("Alignment"));
		gapalignLabel.appendChild(gapalignLink);	
		gapalignFormw.appendChild(gapalignObj);
		gapalignFormw.appendChild(document.createTextNode("Perform ungapped alignment"));
		gapalignRow.appendChild(gapalignLabel);
		gapalignRow.appendChild(gapalignFormw);
		adv_parameters_obj.appendChild(gapalignRow);
	}
	
	var outfmtRow = document.createElement("div");
	outfmtRow.className = 'row';
	var outfmtLabel = document.createElement("span");
	outfmtLabel.className = 'label';
	var outfmtLink = document.createElement("a");
	outfmtLink.href = "docs/parameters.html#outfmt";
	var outfmtFormw = document.createElement("span");
	outfmtFormw.className = 'formw';
	var outfmtObj = document.createElement("select");
	outfmtObj.name = 'outFmt';
	var outfmtOptions = Array ();
	outfmtOptions[0] = 'pairwise';
	outfmtOptions[1] = 'query-anchored with identities';
	outfmtOptions[2] = 'query-anchored without identities';
	outfmtOptions[3] = 'flat query-anchored with identities';
	outfmtOptions[4] = 'flat query-anchored without identities';
	outfmtOptions[5] = 'XML BLAST output';
	outfmtOptions[6] = 'tabular';
	outfmtOptions[7] = 'tabular with comment lines';
	for (var i = 0; i < outfmtOptions.length; i++) {
		var outfmtOption = document.createElement("option");
		outfmtOption.value = i;
		if (outfmtOptions[i] == 'pairwise') {
			outfmtOption.selected = true;
		}		
		outfmtOption.appendChild(document.createTextNode(outfmtOptions[i]));
		outfmtObj.appendChild(outfmtOption);
	}	
	outfmtLink.appendChild(document.createTextNode("Alignment output format"));
	outfmtLabel.appendChild(outfmtLink);	
	outfmtFormw.appendChild(outfmtObj);
	outfmtRow.appendChild(outfmtLabel);
	outfmtRow.appendChild(outfmtFormw);
	adv_parameters_obj.appendChild(outfmtRow);
	
	if (value == 'blastx' || value == 'tblastx') {
		var qcodeRow = document.createElement("div");
		qcodeRow.className = 'row';
		var qcodeLabel = document.createElement("span");
		qcodeLabel.className = 'label';
		var qcodeLink = document.createElement("a");
		qcodeLink.href = "docs/parameters.html#qcode";
		var qcodeFormw = document.createElement("span");
		qcodeFormw.className = 'formw';
		var qcodeObj = document.createElement("select");
		qcodeObj.name = 'qCode';
		var qcodeOptions = Array ();
		qcodeOptions[0] = 'Standard (1)';
		qcodeOptions[1] = 'Vertebrate Mitochondrial (2)';
		qcodeOptions[2] = 'Yeast Mitochondrial (3)';
		qcodeOptions[3] = 'Mold, Protozoan, and Coelocoel Mitochondrial (4)';
		qcodeOptions[4] = 'Invertebrate Mitochondrial (5)';
		qcodeOptions[5] = 'Ciliate Nuclear (6)';
		qcodeOptions[6] = 'Echinoderm Mitochondrial (9)';
		qcodeOptions[7] = 'Euplotid Nuclear (10)';
		qcodeOptions[8] = 'Bacterial (11)';
		qcodeOptions[9] = 'Alternative Yeast Nuclear (12)';
		qcodeOptions[10] = 'Ascidian Mitochondrial (13)';
		qcodeOptions[11] = 'Flatworm Mitochondrial (14)';
		qcodeOptions[12] = 'Blepharisma Macronuclear (15)';
		var qcodeVlaues = Array ();
		qcodeVlaues[0] = 1;
		qcodeVlaues[1] = 2;
		qcodeVlaues[2] = 3;
		qcodeVlaues[3] = 4;
		qcodeVlaues[4] = 5;
		qcodeVlaues[5] = 6;
		qcodeVlaues[6] = 9;
		qcodeVlaues[7] = 10;
		qcodeVlaues[8] = 11;
		qcodeVlaues[9] = 12;
		qcodeVlaues[10] = 13;
		qcodeVlaues[11] = 14;
		qcodeVlaues[12] = 15;
		for (var i = 0; i < qcodeOptions.length; i++) {
			var qcodeOption = document.createElement("option");
			qcodeOption.value = qcodeVlaues[i];
			if (qcodeOptions[i] == 'Standard (1)') {
				qcodeOption.selected = true;
			}		
			qcodeOption.appendChild(document.createTextNode(qcodeOptions[i]));
			qcodeObj.appendChild(qcodeOption);
		}
		qcodeLink.appendChild(document.createTextNode("Query genetic code"));	
		qcodeLabel.appendChild(qcodeLink);	
		qcodeFormw.appendChild(qcodeObj);
		qcodeRow.appendChild(qcodeLabel);
		qcodeRow.appendChild(qcodeFormw);
		adv_parameters_obj.appendChild(qcodeRow);
	}
	
	if (value == 'tblastn' || value == 'tblastx') {
		var dbcodeRow = document.createElement("div");
		dbcodeRow.className = 'row';
		var dbcodeLabel = document.createElement("span");
		dbcodeLabel.className = 'label';
		var dbcodeLink = document.createElement("a");
		dbcodeLink.href = "docs/parameters.html#dbcode";
		var dbcodeFormw = document.createElement("span");
		dbcodeFormw.className = 'formw';
		var dbcodeObj = document.createElement("select");
		dbcodeObj.name = 'dbCode';
		var dbcodeOptions = Array ();
		dbcodeOptions[0] = 'Standard (1)';
		dbcodeOptions[1] = 'Vertebrate Mitochondrial (2)';
		dbcodeOptions[2] = 'Yeast Mitochondrial (3)';
		dbcodeOptions[3] = 'Mold, Protozoan, and Coelocoel Mitochondrial (4)';
		dbcodeOptions[4] = 'Invertebrate Mitochondrial (5)';
		dbcodeOptions[5] = 'Ciliate Nuclear (6)';
		dbcodeOptions[6] = 'Echinoderm Mitochondrial (9)';
		dbcodeOptions[7] = 'Euplotid Nuclear (10)';
		dbcodeOptions[8] = 'Bacterial (11)';
		dbcodeOptions[9] = 'Alternative Yeast Nuclear (12)';
		dbcodeOptions[10] = 'Ascidian Mitochondrial (13)';
		dbcodeOptions[11] = 'Flatworm Mitochondrial (14)';
		dbcodeOptions[12] = 'Blepharisma Macronuclear (15)';
		var dbcodeVlaues = Array ();
		dbcodeVlaues[0] = 1;
		dbcodeVlaues[1] = 2;
		dbcodeVlaues[2] = 3;
		dbcodeVlaues[3] = 4;
		dbcodeVlaues[4] = 5;
		dbcodeVlaues[5] = 6;
		dbcodeVlaues[6] = 9;
		dbcodeVlaues[7] = 10;
		dbcodeVlaues[8] = 11;
		dbcodeVlaues[9] = 12;
		dbcodeVlaues[10] = 13;
		dbcodeVlaues[11] = 14;
		dbcodeVlaues[12] = 15;
		for (var i = 0; i < dbcodeOptions.length; i++) {
			var dbcodeOption = document.createElement("option");
			dbcodeOption.value = dbcodeVlaues[i];
			if (dbcodeOptions[i] == 'Standard (1)') {
				dbcodeOption.selected = true;
			}		
			dbcodeOption.appendChild(document.createTextNode(dbcodeOptions[i]));
			dbcodeObj.appendChild(dbcodeOption);
		}
		dbcodeLink.appendChild(document.createTextNode("Database genetic code"));	
		dbcodeLabel.appendChild(dbcodeLink);	
		dbcodeFormw.appendChild(dbcodeObj);
		dbcodeRow.appendChild(dbcodeLabel);
		dbcodeRow.appendChild(dbcodeFormw);
		adv_parameters_obj.appendChild(dbcodeRow);
	}
	
	var otherRow = document.createElement("div");
	otherRow.className = 'row';
	var otherLabel = document.createElement("span");
	otherLabel.className = 'label';
	var otherLink = document.createElement("a");
	otherLink.href = "docs/parameters.html#other";
	var otherFormw = document.createElement("span");
	otherFormw.className = 'formw';
	var otherObj = document.createElement("input");
	otherObj.type = 'text';
	otherObj.name = 'OTHER_ADVANCED';
	otherObj.id = 'OTHER_ADVANCED';
	otherObj.value = '';
	otherObj.size = 30;
	otherLink.appendChild(document.createTextNode("Other parameters"));
	otherLabel.appendChild(otherLink);	
	otherFormw.appendChild(otherObj);
	otherRow.appendChild(otherLabel);
	otherRow.appendChild(otherFormw);
	adv_parameters_obj.appendChild(otherRow);
}
