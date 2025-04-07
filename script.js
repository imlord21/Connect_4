document.addEventListener('DOMContentLoaded', function () {
    function startGame() {
        const rows = 6;
        const columns = 7;
        let board = [];
        let currentPlayer = 'red';
        let gameOver = false;

        function initializeGame() {
            board = createBoard(rows, columns);
            currentPlayer = 'red';
            gameOver = false;
            updateStatus("Player 1's turn (Red)");
        }

        function createBoard(rows, columns) {
            const newBoard = Array.from({ length: rows }, () => Array(columns).fill(null));
            const gameBoardElement = document.getElementById('game-board');
            gameBoardElement.innerHTML = '';
            gameBoardElement.style.gridTemplateColumns = `repeat(${columns}, 50px)`;
            gameBoardElement.style.gridTemplateRows = `repeat(${rows}, 50px)`;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < columns; col++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.addEventListener('click', handleMove);
                    gameBoardElement.appendChild(cell);
                }
            }
            return newBoard;
        }

        function handleMove(event) {
            if (gameOver) return;

            const col = parseInt(event.target.dataset.col, 10);
            for (let row = board.length - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    board[row][col] = currentPlayer;
                    updateCell(row, col);
                    if (checkWin(row, col)) {
                        endGame(`${currentPlayer === 'red' ? 'Player 1 (Red)' : 'Player 2 (Yellow)'} wins!`);
                    } else if (isDraw()) {
                        endGame("It's a draw!");
                    } else {
                        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                        updateStatus(`Player ${currentPlayer === 'red' ? '1' : '2'}'s turn (${capitalize(currentPlayer)})`);
                    }
                    break;
                }
            }
        }

        function updateCell(row, col) {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add(currentPlayer);
        }

        function updateStatus(message) {
            document.getElementById('status').textContent = message;
        }

        function checkWin(row, col) {
            return (
                checkDirection(row, col, -1, 0) + checkDirection(row, col, 1, 0) >= 3 ||
                checkDirection(row, col, 0, -1) + checkDirection(row, col, 0, 1) >= 3 ||
                checkDirection(row, col, -1, -1) + checkDirection(row, col, 1, 1) >= 3 ||
                checkDirection(row, col, -1, 1) + checkDirection(row, col, 1, -1) >= 3
            );
        }

        function checkDirection(row, col, rowDir, colDir) {
            let count = 0;
            let r = row + rowDir;
            let c = col + colDir;

            while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
                count++;
                r += rowDir;
                c += colDir;
            }
            return count;
        }

        function isDraw() {
            return board.every(row => row.every(cell => cell !== null));
        }

        function endGame(message) {
            gameOver = true;
            updateStatus(message);
            disableBoard();
        }

        function disableBoard() {
            document.querySelectorAll('.cell').forEach(cell => cell.classList.add('disabled'));
        }

        function resetGame() {
            initializeGame();
        }

        function capitalize(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }

        document.getElementById('reset-btn').addEventListener('click', resetGame);
        initializeGame();
    }

    startGame();
});
