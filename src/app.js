const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

const VALID_URL = "https://words.dev-apis.com/validate-word";

const errorDiv = document.createElement("div");
const errorMsg = document.createTextNode("Input is invalid please input a valid word!");
const errorCont = document.createTextNode("Can't Guess the same word!");
errorDiv.className="error-msg";


let prevWords = [];

let word = '';
let guessCount = 0;
let correct = false;

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
        prevWords.push(value);
        return true;
    }

}


//manage guess count if at or below 6 guesses then guess. If above 6 attempts/guesses print there are too many guesses.
async function manageGuess(value){

    if(correct == true) {

    } else {
        guessCount = guessCount + 1;

        //remove error message from screen
        msg = document.querySelector('.error-msg')
        if(msg){
            msg.innerText = '';
            msg.parentNode.removeChild(msg)
        }
        
        if (guessCount <= 6){
            if  (prevWords.includes(value) == true) {
                guessCount = guessCount - 1;

                errorDiv.appendChild(errorCont);
                let el = document.querySelector('.error');
                el.appendChild(errorDiv);

            }else if(await validateWord(value) == true){

                //output guess to div
                guessToDiv(value);

                if (value == word){
                    correct = true;
                }
                //reset input field if input valid
                render();

            } else {
                guessCount = guessCount - 1;
                errorDiv.appendChild(errorMsg);
                let el = document.querySelector('.error');
                el.appendChild(errorDiv);
            };
        } else {
            console.log('too many guesses you lose!');
        };
    }
}


function guessToDiv(value) {
    let arrLetters = [...value];
    let corrWordLet = [...word];
    const guessDiv = document.createElement("div");
    guessDiv.className = "guess-lets"

    
    arrLetters.forEach( (x, i) => {
        const letterDiv = document.createElement("div");
        letterDiv.innerText = x;
        guessDiv.appendChild(letterDiv);

        // if same position, if contains, if everything else.
        if(x == corrWordLet[i] ) {
            letterDiv.className="let correct";
        }else if (corrWordLet.includes(x)){
            letterDiv.className="let contains";
        } else {
            letterDiv.className="let";
        }
    
    });

    let el = document.querySelector('.guess-group');
    el.appendChild(guessDiv);
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

