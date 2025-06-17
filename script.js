const rows = 6;
const columns = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;

const directions = [
    [-1, 0], [1, 0],     // vertical
    [0, -1], [0, 1],     // horizontal
    [-1, -1], [1, 1],    // diagonal \
    [-1, 1], [1, -1]     // diagonal /
];

const statusElement = document.getElementById('status');
const boardElement = document.getElementById('game-board');
const resetButton = document.getElementById('reset-btn');

function init() {
    board = Array.from({ length: rows }, () => Array(columns).fill(null));
    currentPlayer = 'red';
    gameOver = false;
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${columns}, 50px)`;
    boardElement.style.gridTemplateRows = `repeat(${rows}, 50px)`;

    for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < columns; ++col) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleMove);
            boardElement.appendChild(cell);
        }
    }

    const playerInfo = getPlayerInfo(currentPlayer);
    updateStatus(`${playerInfo.name}'s turn`);
}

function handleMove(e) {
    if (gameOver) return;

    const col = parseInt(e.target.dataset.col, 10);

    for (let row = rows - 1; row >= 0; --row) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            updateCell(row, col);

            const playerInfo = getPlayerInfo(currentPlayer);

            if (checkWin(row, col)) {
                endGame(`${playerInfo.name} wins!`);
            } else if (isDraw()) {
                endGame("It's a draw!");
            } else {
                if (currentPlayer === 'red') {
                    currentPlayer = 'yellow';
                } else {
                    currentPlayer = 'red';
                }

                const nextPlayerInfo = getPlayerInfo(currentPlayer);
                updateStatus(`${nextPlayerInfo.name}'s turn`);
            }

            break;
        }
    }
}

function updateCell(row, col) {
    const selector = `.cell[data-row="${row}"][data-col="${col}"]`;
    const cell = document.querySelector(selector);
    cell.classList.add(currentPlayer);
}

function updateStatus(msg) {
    statusElement.textContent = msg;
}

function checkWin(row, col) {
    for (let i = 0; i < directions.length; i += 2) {
        const [dir1Row, dir1Col] = directions[i];
        const [dir2Row, dir2Col] = directions[i + 1];
        const count = countInDirection(row, col, dir1Row, dir1Col) +
            countInDirection(row, col, dir2Row, dir2Col);
        if (count >= 3) {
            return true;
        }
    }
    return false;
}

function countInDirection(row, col, rowDir, colDir) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;

    while (
        r >= 0 && r < rows &&
        c >= 0 && c < columns &&
        board[r][c] === currentPlayer
        ) {
        ++count;
        r += rowDir;
        c += colDir;
    }

    return count;
}

function isDraw() {
    return board.every(row => row.every(cell => cell));
}

function endGame(msg) {
    gameOver = true;
    updateStatus(msg);
    document.querySelectorAll('.cell').forEach(cell => cell.classList.add('disabled'));
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPlayerInfo(color) {
    let playerNum;
    let colorName;

    if (color === 'red') {
        playerNum = '1';
        colorName = 'Red';
    } else {
        playerNum = '2';
        colorName = 'Yellow';
    }

    return {
        num: playerNum,
        color: colorName,
        name: `Player ${playerNum} (${colorName})`
    };
}

resetButton.addEventListener('click', init);
init();
