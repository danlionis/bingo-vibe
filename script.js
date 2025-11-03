const DOM = {
    wordInput: document.getElementById('word-input'),
    generateBtn: document.getElementById('generate-btn'),
    shareBtn: document.getElementById('share-btn'),
    bingoBoard: document.getElementById('bingo-board'),
};

const STORAGE_KEYS = {
    wordList: 'bingoWordList',
    boardWords: 'bingoBoardWords',
    markedCells: 'markedCells',
};

let bingoAchieved = false;
const clearedLines = [];

// --- DOM Manipulation ---

function createCell(word, isMarked) {
    const cell = document.createElement('div');
    cell.classList.add('bingo-cell');
    cell.textContent = word;
    if (isMarked) {
        cell.classList.add('marked');
    }
    cell.addEventListener('click', onCellClick);
    return cell;
}

function renderBoard(boardWords, markedCells) {
    DOM.bingoBoard.innerHTML = '';
    for (let i = 0; i < boardWords.length; i++) {
        const word = boardWords[i];
        const isMarked = (word === 'Free Space') || (markedCells && markedCells[i]);
        const cell = createCell(word, isMarked);
        DOM.bingoBoard.appendChild(cell);
    }
}

// --- Local Storage ---

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// --- Game Logic ---

function generateNewBoard() {
    const words = DOM.wordInput.value.split('\n').filter(word => word.trim() !== '');
    if (words.length < 24) {
        alert('Please enter at least 24 words.');
        return;
    }

    saveToStorage(STORAGE_KEYS.wordList, DOM.wordInput.value);

    const shuffledWords = words.sort(() => 0.5 - Math.random());
    const boardWords = shuffledWords.slice(0, 24);
    boardWords.splice(12, 0, 'Free Space');

    bingoAchieved = false;
    clearedLines.length = 0;

    renderBoard(boardWords);
    saveToStorage(STORAGE_KEYS.boardWords, boardWords);
    saveToStorage(STORAGE_KEYS.markedCells, getMarkedCells());
}

function checkBingo() {
    const markedCells = getMarkedCells();
    const lines = [
        // Rows
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        // Columns
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        // Diagonals
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
    ];

    for (const line of lines) {
        const isBingo = line.every(index => markedCells[index]);
        if (isBingo) {
            const lineId = line.join('-');
            if (!clearedLines.includes(lineId)) {
                clearedLines.push(lineId);
                return true;
            }
        }
    }

    return false;
}

function getMarkedCells() {
    const cells = Array.from(document.querySelectorAll('.bingo-cell'));
    return cells.map(cell => cell.classList.contains('marked'));
}

function generateShareableLink() {
    const wordList = DOM.wordInput.value;
    const encodedWordList = encodeURIComponent(wordList);
    const url = new URL(window.location.href);
    url.hash = encodedWordList;
    return url.toString();
}

// --- Event Handlers ---

function onCellClick(event) {
    event.target.classList.toggle('marked');
    saveToStorage(STORAGE_KEYS.markedCells, getMarkedCells());

    if (!bingoAchieved) {
        if (checkBingo()) {
            bingoAchieved = true;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }
}

function onLoad() {
    const wordListFromUrl = window.location.hash.substring(1);

    if (wordListFromUrl) {
        DOM.wordInput.value = decodeURIComponent(wordListFromUrl);
        generateNewBoard();
        return;
    }

    const savedWordList = getFromStorage(STORAGE_KEYS.wordList);
    if (savedWordList) {
        DOM.wordInput.value = savedWordList;
    }

    const savedBoardWords = getFromStorage(STORAGE_KEYS.boardWords);
    if (savedBoardWords) {
        const savedMarkedCells = getFromStorage(STORAGE_KEYS.markedCells);
        renderBoard(savedBoardWords, savedMarkedCells);
    }
}

function onShareClick() {
    const link = generateShareableLink();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
            alert('Shareable link copied to clipboard!');
        });
    } else {
        window.prompt('Copy this link:', link);
    }
}

// --- Initialization ---

DOM.generateBtn.addEventListener('click', generateNewBoard);
DOM.shareBtn.addEventListener('click', onShareClick);
window.addEventListener('load', onLoad);