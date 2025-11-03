const wordInput = document.getElementById('word-input');
const generateBtn = document.getElementById('generate-btn');
const bingoBoard = document.getElementById('bingo-board');

generateBtn.addEventListener('click', () => {
    const words = wordInput.value.split('\n').filter(word => word.trim() !== '');

    if (words.length < 24) {
        alert('Please enter at least 24 words.');
        return;
    }

    bingoBoard.innerHTML = '';

    const shuffledWords = words.sort(() => 0.5 - Math.random());
    const boardWords = shuffledWords.slice(0, 24);
    boardWords.splice(12, 0, 'Free Space');

    for (let i = 0; i < 5; i++) {
        const row = bingoBoard.insertRow();
        for (let j = 0; j < 5; j++) {
            const cell = row.insertCell();
            const word = boardWords[i * 5 + j];
            cell.textContent = word;
            if (word === 'Free Space') {
                cell.classList.add('marked');
            }
            cell.addEventListener('click', () => {
                cell.classList.toggle('marked');
            });
        }
    }
});