'use strict';

function newGame(player1 = "Player 1", player2 = "Player 2") {
	let moves = 0;

	const players = [
		{
			name: player1,
			token: 'X',
		},
		{
			name: player2,
			token: 'O',
		},
	];

	const gameboard = (() => {
		const rows = 3;
		const columns = 3;
		const board = [];

		for (let i = 0; i < rows; ++i) {
			board[i] = [];
			for (let j = 0; j < columns; ++j) {
				board[i].push('');
			}
		}

		const getBoard = () => board;

		const placeToken = (row, column, token) => {
			let placed = false;
			if (board[row][column] === '') {
				board[row][column] = token;
				placed = true;
			}
			return placed;
		};

		return { getBoard, placeToken };
	})();

	let activePlayer = players[0];

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const playTurn = (row, column) => {
		let result = { gameover: false, tie: false, player: {} };
		let placed = gameboard.placeToken(row, column, getActivePlayer().token);
		if (placed) {
			moves++;
			let won = checkForWin();
			if (won) {
				result.gameover = true;
				result.player = getActivePlayer();
			} else if (moves >= 9) {
				result.gameover = true;
				result.tie = true;
			} else {
				switchPlayerTurn();
			}
		}
		return result;
	}

	const checkForWin = () => {
		let board = gameboard.getBoard();

		// rows
		for (let row = 0; row < 3; ++row) {
			if (
				board[row][0] !== '' &&
				board[row][0] === board[row][1] &&
				board[row][1] === board[row][2]
			) {
				return true;
			}
		}
		// columns
		for (let col = 0; col < 3; ++col) {
			if (
				board[0][col] !== '' &&
				board[0][col] === board[1][col] &&
				board[1][col] === board[2][col]
			) {
				return true;
			}
		}
		// diagonals
		if (
			board[0][0] !== '' &&
			board[0][0] === board[1][1] &&
			board[1][1] === board[2][2]
		) {
			return true;
		}
		if (
			board[0][2] !== '' &&
			board[0][2] === board[1][1] &&
			board[1][1] === board[2][0]
		) {
			return true;
		}

		return false;
	};

	return { playTurn, getActivePlayer, getBoard: gameboard.getBoard };
}

const displayController = (() => {
	let game = newGame();
	const turnDiv = document.querySelector(".turn");
	const boardDiv = document.querySelector(".board");
	const restartButton = document.querySelector(".restart");

	const updateDisplay = () => {
		boardDiv.textContent = "";

		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		turnDiv.textContent = `${activePlayer.name}'s turn...`;

		board.forEach((row, i) => {
			row.forEach((cell, j) => {
				const cellButton = document.createElement("button");
				cellButton.classList.add("cell");
				cellButton.dataset.row = i;
				cellButton.dataset.col = j;
				cellButton.textContent = cell;
				boardDiv.appendChild(cellButton);
			})
		});
	};

	function restartHandler(e) {
		restartButton.style.visibility = "hidden";
		game = newGame();
		boardDiv.addEventListener("click", clickHandler);
		updateDisplay();
	}

	function clickHandler(e) {
		const selectedRow = e.target.dataset.row;
		const selectedCol = e.target.dataset.col;
		if (selectedRow === undefined || selectedCol === undefined) return;

		// console.log(game.getBoard());

		const result = game.playTurn(selectedRow, selectedCol);
		// console.log(result);
		updateDisplay();
		if (result.gameover) {
			boardDiv.removeEventListener("click", clickHandler);
			if (result.tie) {
				turnDiv.textContent = "Game ended in a tie!";
			} else {
				turnDiv.textContent = `${result.player.name} has won!`;
			}
			restartButton.style.visibility = "visible";
		}
	}

	boardDiv.addEventListener("click", clickHandler);
	restartButton.addEventListener("click", restartHandler);

	updateDisplay();
})();
