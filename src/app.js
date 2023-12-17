const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

const VALID_URL = "https://words.dev-apis.com/validate-word";

let word = document.getElementById("daily-word");

async function fetchDailyWord() {
    const promise = await fetch(WORD_URL);
    const processed_word = await promise.json();

    word = processed_word.word;

    console.log(word);
}

fetchDailyWord();