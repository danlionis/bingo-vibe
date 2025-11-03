const wordInput = document.getElementById('word-input');
const generateBtn = document.getElementById('generate-btn');
const bingoBoard = document.getElementById('bingo-board');
let bingoAchieved = false;
const clearedLines = [];

function generateBoard() {
    bingoAchieved = false;
    clearedLines.length = 0;
    const words = wordInput.value.split('\n').filter(word => word.trim() !== '');

    if (words.length < 24) {
        alert('Please enter at least 24 words.');
        return;
    }

    localStorage.setItem('bingoWords', wordInput.value);

    bingoBoard.innerHTML = '';

    const shuffledWords = words.sort(() => 0.5 - Math.random());
    const boardWords = shuffledWords.slice(0, 24);
    boardWords.splice(12, 0, 'Free Space');

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('bingo-cell');
        const word = boardWords[i];
        cell.textContent = word;
        if (word === 'Free Space') {
            cell.classList.add('marked');
        }
        cell.addEventListener('click', () => {
            cell.classList.toggle('marked');
            if (!bingoAchieved) {
                const bingo = checkBingo();
                if (bingo) {
                    bingoAchieved = true;
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }
        });
        bingoBoard.appendChild(cell);
    }
}

generateBtn.addEventListener('click', generateBoard);

function checkBingo() {
    const cells = Array.from(document.querySelectorAll('.bingo-cell'));
    const markedCells = cells.map(cell => cell.classList.contains('marked'));

    // Check rows
    for (let i = 0; i < 5; i++) {
        if (
            markedCells[i * 5] &&
            markedCells[i * 5 + 1] &&
            markedCells[i * 5 + 2] &&
            markedCells[i * 5 + 3] &&
            markedCells[i * 5 + 4]
        ) {
            const line = `row${i}`;
            if (!clearedLines.includes(line)) {
                clearedLines.push(line);
                return true;
            }
        }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
        if (
            markedCells[i] &&
            markedCells[i + 5] &&
            markedCells[i + 10] &&
            markedCells[i + 15] &&
            markedCells[i + 20]
        ) {
            const line = `col${i}`;
            if (!clearedLines.includes(line)) {
                clearedLines.push(line);
                return true;
            }
        }
    }

    // Check diagonals
    if (
        markedCells[0] &&
        markedCells[6] &&
        markedCells[12] &&
        markedCells[18] &&
        markedCells[24]
    ) {
        const line = 'diag0';
        if (!clearedLines.includes(line)) {
            clearedLines.push(line);
            return true;
        }
    }
    if (
        markedCells[4] &&
        markedCells[8] &&
        markedCells[12] &&
        markedCells[16] &&
        markedCells[20]
    ) {
        const line = 'diag1';
        if (!clearedLines.includes(line)) {
            clearedLines.push(line);
            return true;
        }
    }

    return false;
}

window.addEventListener('load', () => {
    const savedWords = localStorage.getItem('bingoWords');
    if (savedWords) {
        wordInput.value = savedWords;
        generateBoard();
    }
});
