const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

const VALID_URL = "https://words.dev-apis.com/validate-word";

const errorDiv = document.createElement("div");
const errorMsg = document.createTextNode("Input is invalid please input a valid word!");
errorDiv.appendChild(errorMsg);
errorDiv.className="error-msg";

const guessDiv = document.createElement("div");
const letterDiv = document.createElement("div");


let word = '';
let guessCount = 0;

//api request to fetch daily word with GET
async function fetchDailyWord() {
    const promise = await fetch(WORD_URL);
    const processed_word = await promise.json();

    word = processed_word.word;

    console.log(word);
}


//POST for api to validate user input
async function validateWord(value){
    const promise = await fetch(VALID_URL, {
        method: "POST",
        body: JSON.stringify({
            word: value,
        })
    });

    const process_valid = await promise.json();
    console.log(process_valid.validWord);
    if (process_valid.validWord == false){
        return false;
    } else {
        return true;
    }
}


//manage guess count if at or below 6 guesses then guess. If above 6 attempts/guesses print there are too many guesses.
async function manageGuess(value){
    guessCount = guessCount + 1;

    if (guessCount <= 6){
        if(await validateWord(value) == true){

            //remove error message from screen
            if(document.querySelector('.error').hasChildNodes == true){
                document.querySelector('.error').removeChild(document.querySelector('.error').firstChild);
            };

            //output guess to div
            guessToDiv(value);

            //reset input field if input valid
            render();

        } else {
            guessCount = guessCount - 1;
            let el = document.querySelector('.error');
            el.appendChild(errorDiv);
        };
    } else {
        console.log('too many guesses you lose!');
    };
}


function guessToDiv(value) {
    let arrLetters = [...value];
    let corrWordLet = [...word];
    
    arrLetters.forEach( x => {
        if(corrWordLet.includes(x)){
            console.log('has letter');
        }
    });
}

//check if is letter
function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}
//make input field blank on enter press
function render(){
    document.querySelector('.user-input').value = '';
}

function init() {
    document.querySelector('.user-input')
            .addEventListener("keydown", function (event) {
                //handle enter
                if(event.key == "Enter") {
                    console.log('submit');
                    manageGuess(document.querySelector('.user-input').value);
                //handle backspace                    
                } else if(event.key == "Backspace") {
                    let currGuess = document.querySelector('.user-input').value;
                    currGuess = currGuess.substring(0,currGuess.length);
                    document.querySelector('.user-input').value = currGuess;
                //check is letter input
                } else if(!isLetter(event.key)) {
                    event.preventDefault();
                }
            });

}

fetchDailyWord();
init();

