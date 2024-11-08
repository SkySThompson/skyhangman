/* Sounds */
const correctSound = new Audio("sounds/correct.mp3");
const incorrectSound = new Audio("sounds/incorrect.mp3");
const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");

/* Movies */
let movies = [
    'The Shawshank Redemption', 'School of Rock', 'Forrest Gump', // ... and other movie titles
];

/* Game */
const youWon = "You Won!";
const youLost = "You Lost!";
const maxGuesses = 7;

function Game() {
    let word = movies[Math.floor(Math.random() * movies.length)].toUpperCase();
    let guessedLetters = [];
    let maskedWord = Array.from(word).map(char => (char === " " ? " " : "_")).join("");
    let incorrectGuesses = 0;
    let won = false;
    let lost = false;

    let guess = function(letter) {
        if (!guessedLetters.includes(letter) && !won && !lost) {
            guessedLetters.push(letter);

            if (word.includes(letter)) {
                correctSound.play();
                maskedWord = maskedWord.split('').map((char, idx) => 
                    word[idx] === letter ? letter : char).join('');
                
                won = maskedWord === word;
                if (won) winSound.play();
            } else {
                incorrectSound.play();
                incorrectGuesses++;
                if (incorrectGuesses >= maxGuesses) {
                    loseSound.play();
                    lost = true;
                    maskedWord = word; // Reveal the word if the game is lost
                }
            }
            render(game);
        }
    };

    return {
        getMaskedWord: () => maskedWord,
        guess,
        getIncorrectGuesses: () => incorrectGuesses,
        isWon: () => won,
        isLost: () => lost
    };
}

function render(game) {
    // Display masked word
    document.getElementById("word").innerHTML = game.getMaskedWord();

    // Render on-screen keyboard
    const guessesContainer = document.getElementById("guesses");
    guessesContainer.innerHTML = ""; // Clear previous letters

    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        const button = document.createElement("button");
        button.className = "guess";
        button.textContent = letter;

        // Disable the button if already guessed or game is over
        if (game.getMaskedWord().includes(letter) || game.isWon() || game.isLost()) {
            button.disabled = true;
            button.classList.add("disabled");
        } else {
            button.addEventListener("click", () => game.guess(letter));
        }

        guessesContainer.appendChild(button);
    });

    // Update hangman image
    document.getElementById("hangmanImage").src = `img/hangman${game.getIncorrectGuesses()}.png`;

    // Display game status in guess box
    let guessBox = document.getElementById('guessBox');
    if (game.isWon()) {
        guessBox.value = youWon;
        guessBox.classList.add("win");
    } else if (game.isLost()) {
        guessBox.value = youLost;
        guessBox.classList.add("loss");
    } else {
        guessBox.value = "";
        guessBox.classList.remove("win", "loss");
    }
}

function newGame() {
    game = new Game();
    render(game);
}

let game = new Game();
render(game);
