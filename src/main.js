import { WORDS } from './words.js';

const app = document.getElementById('app');
let selectedLevel, currentWord, currentHint, attempts;

// Level selection screen
function renderLevelSelection() {
  app.innerHTML = `
    <div class="level-select">
      <label for="level">Select difficulty:</label>
      <select id="level">
        <option value="easy">4 Letters (Beginner)</option>
        <option value="medium">5 Letters (Intermediate)</option>
        <option value="hard">6 Letters (Advanced)</option>
      </select>
      <button id="start-btn">Start Game</button>
    </div>
  `;
  document.getElementById('start-btn')
    .addEventListener('click', startGame);
}

// Initialize the game
function startGame() {
  selectedLevel = document.getElementById('level').value;
  const list = WORDS[selectedLevel];
  const choice = list[Math.floor(Math.random() * list.length)];
  currentWord = choice.word;
  currentHint = choice.hint;
  attempts = [];
  renderGame();
}

// Game screen
function renderGame() {
  const wordLength = currentWord.length;
  app.innerHTML = `
    <div class="game-container">
      <p>Guess the ${wordLength}-letter word.</p>

      <label>
        <input type="checkbox" id="hint-toggle" />
        Show Hint
      </label>
      <p id="hint-area" style="visibility:hidden; margin-bottom: 1rem;"></p>

      <div id="history"></div>
      <input type="text" id="guess-input" maxlength="${wordLength}" autofocus />
      <button id="guess-btn">Guess</button>
      <p id="feedback"></p>
      <button id="restart-btn">Back to Level Select</button>
    </div>
  `;

  document.getElementById('guess-btn').addEventListener('click', handleGuess);
  document.getElementById('restart-btn').addEventListener('click', renderLevelSelection);

  const hintToggle = document.getElementById('hint-toggle');
  const hintArea   = document.getElementById('hint-area');
  hintToggle.addEventListener('change', () => {
    hintArea.textContent = hintToggle.checked ? currentHint : '';
    hintArea.style.visibility = hintToggle.checked ? 'visible' : 'hidden';
  });

  updateHistory();
}

// Handle a guess submission
function handleGuess() {
  const input = document.getElementById('guess-input');
  const guess = input.value.trim().toLowerCase();
  const feedbackEl = document.getElementById('feedback');

  if (guess.length !== currentWord.length) {
    feedbackEl.textContent = `Please enter exactly ${currentWord.length} letters.`;
    return;
  }

  // Simple letter-by-letter feedback
  let feedback = '';
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === currentWord[i]) {
      feedback += guess[i].toUpperCase();          // correct spot
    } else if (currentWord.includes(guess[i])) {
      feedback += guess[i];                        // wrong spot
    } else {
      feedback += '_';                             // not in word
    }
  }

  attempts.push({ guess, feedback });
  input.value = '';
  updateHistory();

  if (guess === currentWord) {
    feedbackEl.textContent = `🎉 You got it! The word was "${currentWord}".`;
    document.getElementById('guess-btn').disabled = true;
  } else {
    feedbackEl.textContent = `Feedback: ${feedback}`;
  }
}

// Show past attempts
function updateHistory() {
  const hist = document.getElementById('history');
  if (!hist) return;
  hist.innerHTML = attempts
    .map(a => `<div>${a.guess} → ${a.feedback}</div>`)
    .join('');
}

// Start on level select
renderLevelSelection();