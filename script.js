
// Api for words and definitions
let apiURL = 'https://cors-anywhere.herokuapp.com/'+'https://www.thegamegal.com/wordgenerator/generator.php?game=2&category=6'
let wordURL = 'https://cors-anywhere.herokuapp.com/'+'https://api.dictionaryapi.dev/api/v2/entries/en/'

// Get elements from the document
let input = document.getElementById('letters');
let svgImg = document.getElementById('svg-img')
let guessBlock = document.getElementById('guess-box')
let inputRow = document.getElementById('input-field')
let scoreBox = document.getElementById('score')

// All Arrays
let guessedLetters = [];
let word = [];
let letterTxt = [];
let finalLetters = [];
let Texts = [];

// All variables
let wordDefinition;
let letters;
let letKeys
let guessWord;
let answers = {}
let hangman;
let alphabetIdx;
let hangLetter;
let randNum = 2;
let score = 5;

window.onload = (e) => {

	// Class to get letter for selected word and create elements in place of the letter
	class switchLetters {
	constructor(words, letters, position){
		this.words = words;
		this.letters = letters;
		this.position = position;
	}

	// Get word and create li with a "_" in pace of each letter in the word
	wordLines(word, elm){
		this.words = word
		for(let letter in word){
			let newLi = document.createElement('LI');

			let newLine = document.createTextNode('_');
			newLi.appendChild(newLine);

			elm.appendChild(newLi)

			Texts[letter] = document.getElementById('word').children[letter].innerText
			}
		}

	}


	
	// Get random number to select a word from the json object
	function getRandomNum(len){
		randNum = Math.floor(Math.random() * len) + 1;
	}

	// Fetch words from thegamegal.com word generator
	fetch(apiURL)
		.then((response) => {
		// Create an element, set attributes and append to existing element
			guessBlock.setAttribute('style', 'display: block;')
			inputRow.setAttribute('style', 'display: block;')
			svgImg.children[1].remove()
			svgImg.children[0].innerText = 'Correct Letters'
			let divSvg = document.createElement('DIV')
			let divSvgUl = document.createElement('UL')
			divSvgUl.setAttribute('id', 'word')
			divSvg.appendChild(divSvgUl)
			divSvg.setAttribute('id', 'letter-correct')
			divSvg.setAttribute('class', 'row')
			svgImg.appendChild(divSvg)

			return response.json();
		})
		// Get json object split the word/s and set them to an array
			.then((myJson) => {
				word.push(myJson.words)

				getRandomNum(word[0].length)

				guessWord = word[0][randNum].split("")
				for(let guess in guessWord){
					guessWord[guess] = guessWord[guess].toLowerCase()
					answers[guess] = guessWord[guess]
				}

				hangman = new switchLetters
				wordUL = document.getElementById('word')
				hangman.wordLines(guessWord, wordUL)
			})

		// Get definition of the selected word from api.dictionaryapi.dev and set it to wordDefinition
			.then((e) => {
				fetch(wordURL + guessWord.join(""))
				.then((res) => {
					return res.json();
				})
				.then((myDef) => {
					wordDefinition = myDef[0].meanings[0].definitions[0].definition
					document.getElementById('definitions').children[1].innerText = wordDefinition;
				})

			});


}

// Get value and key of the object that contains the selected word
function getKeyByValue(object, value) {
	if(Object.values(object).includes(value)){
		hangLetter = Object.keys(object).find(key => object[key] === value);
		alphabetIdx = object[hangLetter]
		
	}
}


// Reset all variables by refreshing page
document.getElementById('restart').addEventListener("click", function(e){
	e.preventDefault()
	location.reload();
})

// Take action when user hits Enter
input.addEventListener("keyup", function(e){

	if((e.key === 'Enter') && (document.getElementById('letters').value !== "")){

		if(finalLetters.indexOf(document.getElementById('letters').value) !== (-1) ){
			letterTxt.push(document.getElementById('letters').value)
		} else {
			e.preventDefault();
			letKeys = document.getElementById('letters').value;
			letters = document.getElementById("guessed-letters");

		if(Object.values(answers).includes(letKeys)){

			getKeyByValue(answers, letKeys)
			

		} else if(guessedLetters[guessedLetters.indexOf(letKeys)] === undefined){

			guessedLetters.push(letKeys)
			letters.innerHTML += `<p>${letKeys}</p>`
			letterTxt.push(letKeys)
			score--;
			scoreBox.children[0].innerText = score;

		}


		}

		// Clear value in input 
		document.getElementById('letters').value = ""

		if(Object.keys(answers).length >= 0){
			for(let alpa in answers){
				if(answers[alpa] === letKeys){
					document.getElementById('word').children[alpa].innerText = answers[alpa];
					Texts[alpa] = answers[alpa]

				}			
			}
		} 

		if((Texts.join("") === guessWord.join("")) && score !== 0) {

			fullWord = guessWord.join("")
			document.getElementById('guessed-letters').remove()
			let myDiv = document.createElement('Div')
			let divContent = document.createTextNode(`You won!`)
			myDiv.setAttribute('style', 'font-size: 40px; font-weight: 400; margin: 0 auto;')
			myDiv.setAttribute('class', '')
			myDiv.appendChild(divContent)
			myDiv.setAttribute('id', 'guessed-letters')
			document.getElementById('letter-check').appendChild(myDiv)
			let myInputDiv = document.getElementById('input-field')
			myInputDiv.setAttribute('style', 'display: none;')
			myButtonDiv = document.getElementById('reseter')
			myButtonDiv.setAttribute('style', 'display: inline-block;')

		} else if ((Texts.join("") !== guessWord.join("")) && score === 0){

			fullWord = guessWord.join("")
			document.getElementById('word').remove()
			let myDiv = document.createElement('Div')
			let divContent = document.createTextNode(`Sorry, \nthe word was: ${guessWord.join("").toUpperCase()}`)
			myDiv.setAttribute('style', 'font-size: 40px; font-weight: 400;')
			myDiv.appendChild(divContent)
			myDiv.setAttribute('id', 'word')
			document.getElementById('letter-correct').appendChild(myDiv)
			let myInputDiv = document.getElementById('input-field')
			myInputDiv.setAttribute('style', 'display: none;')
			myButtonDiv = document.getElementById('reseter')
			myButtonDiv.setAttribute('style', 'display: inline-block;')

		}


	}
});
