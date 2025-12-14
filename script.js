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
		let placed = gameboard.placeToken(row, column, getActivePlayer().token);
		if (placed) {
			moves++;
			let won = checkForWin();
			if (won) {
				return getActivePlayer();
			} else if (moves >= 9) {
				return { tie: true };
			}
			switchPlayerTurn();
		}
	}

	const checkForWin = () => {
		let board = gameboard.getBoard();
		let won = false;

		// rows
		for (let row = 0; row < 3; ++row) {
			if (
				board[row][0] !== '' &&
				board[row][0] === board[row][1] &&
				board[row][1] === board[row][2]
			) {
				won = true;
			}
		}
		// columns
		for (let col = 0; col < 3; ++col) {
			if (
				board[0][col] !== '' &&
				board[0][col] === board[1][col] &&
				board[1][col] === board[2][col]
			) {
				won = true;
			}
		}
		// diagonals
		if (
			board[0][0] !== '' &&
			board[0][0] === board[1][1] &&
			board[1][1] === board[2][2]
		) {
			won = true;
		}
		if (
			board[0][0] !== '' &&
			board[0][2] === board[1][1] &&
			board[1][1] === board[2][0]
		) {
			won = true;
		}

		return won;
	};

	return { playTurn, getActivePlayer, getBoard: gameboard.getBoard };
}
