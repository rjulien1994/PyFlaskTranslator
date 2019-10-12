var fullDict = [englishDict, frenchDict, germanDict];		//puts the language arrays into one matrix
var languageIndex = {'English' : 0, 'French' : 1, 'German' : 2};	//set an index of language to match lang to id

var lIn = 'English';	//here are the default languages until changed
var lOut = 'French';
document.getElementById("LanguageIn").innerHTML = lIn;	//displays the default lamguages into html file
document.getElementById("LanguageOut").innerHTML = lOut;

var points = 0;	//sets mini game point to 0
var randNum = Math.floor(Math.random() * englishDict.length)	//picks random id for minigame
document.getElementById("randomWord").innerHTML = fullDict[languageIndex[lIn]][randNum];	//displays the word to translate
document.getElementById("score").innerHTML = points;	//displays current score of 0

function pullQuery() {	//this function is used to show user the query they are about to delete
	var wordOrigin = document.getElementById("wordCheck").value;	//gets the word from language specified
	var wordID = fullDict[0].indexOf(wordOrigin);	//pulls its unique key
	document.getElementById("frenchCheck").innerHTML = fullDict[1][wordID];	//search french translation and displays it
	document.getElementById("germanCheck").innerHTML = fullDict[2][wordID];	//same for german
	//carefull this doesn't display english
}

function changeRandomWord() {	//activated if user press change word button
	randNum = Math.floor(Math.random() * englishDict.length)	//pick the id of a word in db
	document.getElementById("randomWord").innerHTML = fullDict[languageIndex[lIn]][randNum];	//diplays it on screen
	document.getElementById("correction").innerHTML = ""; //clear the previous input of user
	document.getElementById("wordAnswer").value = "";
}

function checkAnswer() {	//this check if user wrote the write word
	var correctAnswer = fullDict[languageIndex[lOut]][randNum];	//pulls the translation from dulldict

	if(correctAnswer == document.getElementById("wordAnswer").value & document.getElementById("correction").innerHTML != "Well done, it is correct!") {
		//check if word is correct and if it is the first time user pressed the button
		document.getElementById("correction").innerHTML = "Well done, it is correct!";	//if so congratule user
		points += 1;	//add a point
		document.getElementById("score").innerHTML = points;	//displays new score
	}
	else if(correctAnswer != document.getElementById("wordAnswer").value) {
		//if answer not right
		document.getElementById("correction").innerHTML = "Sorry, try again" + correctAnswer;
		points = 0;	//reset points to 0
		document.getElementById("score").innerHTML = points;
	}
}

function changeLanguage() {
	//this changes the default languages if requested
	lIn = document.getElementById("selectIn").value;	//fetches the news languages specified by user
	lOut = document.getElementById("selectOut").value;

	document.getElementById("LanguageIn").innerHTML = lIn;	//changes the display in title box
	document.getElementById("LanguageOut").innerHTML = lOut;
	changeRandomWord();	//changes the word in minigame
	window.alert("Language changes confirmed");	//pop up confirming the language change
}

function translation() {
	//this function gives the translation of the word requested 
	var wordOrigin = document.getElementById("toTranslate").value;	//pulls word from html file
	var wordID = fullDict[languageIndex[lIn]].indexOf(wordOrigin);	//gets id from language set
	if (wordID < 0) {
		//if the word is not found
		var check = fullDict[0].indexOf(wordOrigin) + fullDict[1].indexOf(wordOrigin) + fullDict[2].indexOf(wordOrigin);	//check every language
		if (check == -3) {
			//if word found in no language
			document.getElementById("wordOutput").innerHTML = "Sorry this word hasn't been added to the database"; //warn user
		}
		else {
			//warn user that tthe ;anguage may not be set right
			document.getElementById("wordOutput").innerHTML = "Make sure you selected the right input language";
		}
	}
	else {
		//if word is found
		document.getElementById("wordOutput").innerHTML = fullDict[languageIndex[lOut]][wordID];	//display translation in html
	}
}
