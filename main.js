const GameBoard = () => {
  const rows = 3;
  const cols = 3;
  let board = [];

  const createGameBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Mark());
      }
    }
    return board;
  };

  const getBoard = () => board;

  const dropMark = (row, column, player) => {
    board[row][column].addMark(player);
  };

  return {
    createGameBoard,
    getBoard,
    dropMark,
  };
};

/* 
  A mark is equivalent to one cell on the board:

  0 = empty space
  1 = crosses
  2 = noughts

*/

const Mark = () => {
  let value = ' ';

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
};

const Winner = () => {
  const checkWinRow = (row, board, playerMark) => {
    const markedCells = board.getBoard()[row].map((cell) => cell.getValue());
    return markedCells.every((cell) => cell === playerMark);
  };

  const checkWinColumn = (column, board, playerMark) => {
    const markedCells = board.getBoard().map((row) => row[column].getValue());
    return markedCells.every((cell) => cell === playerMark);
  };

  const checkWinDiagonal = (board, playerMark) => {
    const markedCells = board.getBoard();
    const cellsLeftToRight = [];
    const cellsRightToLeft = [];

    for (let i = 0, j = 2; i < markedCells.length; i++, j--) {
      cellsLeftToRight.push(markedCells[i][i].getValue());
      cellsRightToLeft.push(markedCells[j][i].getValue());
    }

    return (
      cellsLeftToRight.every((cell) => cell === playerMark) ||
      cellsRightToLeft.every((cell) => cell === playerMark)
    );
  };

  const checkTie = (board) => {
    return board
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== ' '));
  };

  return {
    checkWinRow,
    checkWinColumn,
    checkWinDiagonal,
    checkTie,
  };
};

const GameController = (
  playerOneName = 'Player One',
  playerTwoName = 'Player Two',
) => {
  const board = GameBoard();
  const win = Winner();

  const players = [
    {
      name: playerOneName,
      mark: 'X',
      score: 0,
    },
    {
      name: playerTwoName,
      mark: 'O',
      score: 0,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const getPlayerScore = () => players.map((player) => player.score);

  const getPlayerName = () => players.map((player) => player.name);

  const playRound = (row, column) => {
    // Check if cell is occupied
    if (board.getBoard()[row][column].getValue() != 0) {
      return;
    }

    board.dropMark(row, column, getActivePlayer().mark);

    // Check win or tie conditions
    if (
      win.checkWinRow(row, board, getActivePlayer().mark) ||
      win.checkWinColumn(column, board, getActivePlayer().mark) ||
      win.checkWinDiagonal(board, getActivePlayer().mark)
    ) {
      getActivePlayer().score += 1;
      return `Hell yeah, <span class='${
        getActivePlayer().mark === 'X' ? 'player-one' : 'player-two'
      }'>${getActivePlayer().name}</span> just won`;
    } else if (win.checkTie(board)) {
      return 'Boring, this is a tie game';
    }

    switchPlayerTurn();
  };

  board.createGameBoard();

  return {
    playRound,
    getActivePlayer,
    getPlayerScore,
    getPlayerName,
    getBoard: board.getBoard,
    createNewBoard: board.createGameBoard,
  };
};

const ScreenController = (playerOne, playerTwo) => {
  const game = GameController(playerOne, playerTwo);

  // Create game board && current player's turn && reset board button
  const boardDiv = document.createElement('div');
  boardDiv.classList.add('board');

  const playerTurnDiv = document.createElement('div');
  playerTurnDiv.classList.add('player-turn');

  const resetBoardButton = document.createElement('button');
  resetBoardButton.classList.add('reset-board-btn');
  resetBoardButton.textContent = 'Reset Board';

  document.querySelector('.board-container').appendChild(playerTurnDiv);
  document.querySelector('.board-container').appendChild(boardDiv);
  document.querySelector('.board-container').appendChild(resetBoardButton);

  const scoreBoardDiv = document.querySelector('.score-board');
  const scoreBoardText = document.createElement('p');

  const updateScreen = () => {
    boardDiv.textContent = '';

    scoreBoardText.textContent = `${game.getPlayerName()[0]} : ${
      game.getPlayerScore()[0]
    }${game.getPlayerName()[1]}: ${game.getPlayerScore()[1]}`;

    const currentBoard = game.getBoard();

    const currentPlayer = game.getActivePlayer();

    scoreBoardDiv.appendChild(scoreBoardText);

    playerTurnDiv.textContent = `
      ${currentPlayer.name}'s Turn!
    `;
    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');

        cellButton.classList.add('cell');

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        cellButton.textContent = cell.getValue();

        if (cellButton.textContent === 'X') {
          cellButton.classList.add('player-one');
        } else if (cellButton.textContent === 'O') {
          cellButton.classList.add('player-two');
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const clickHandlerBoard = (e) => {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow && !selectedColumn) return;

    const result = game.playRound(selectedRow, selectedColumn);

    updateScreen();

    // Check win or tie
    if (result) {
      // Create a winner display
      resetBoardButton.hidden = true;

      const resultDiv = document.createElement('h1');
      resultDiv.innerHTML = result;
      resultDiv.classList.add('game-result');
      document.querySelector('.board-container').appendChild(resultDiv);

      boardDiv.removeEventListener('click', clickHandlerBoard);

      // Create button to play again
      const playAgainButton = document.createElement('button');
      playAgainButton.textContent = 'Play Again';
      playAgainButton.classList.add('play-again-btn');
      document
        .querySelector('.board-container')
        .insertBefore(playAgainButton, resetBoardButton);

      // Function to handle event after play again is clicked
      const clickHandlerPlayAgain = () => {
        game.createNewBoard();
        boardDiv.addEventListener('click', clickHandlerBoard); // Make game board playable again

        updateScreen();

        resultDiv.remove();
        playAgainButton.remove();
        resetBoardButton.hidden = false;
      };

      playAgainButton.addEventListener('click', clickHandlerPlayAgain);
    }
  };

  // Initialize game board
  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();

  // Create reset board button
  const clickHandleResetBoardButton = () => {
    game.createNewBoard();
    updateScreen();
  };

  resetBoardButton.addEventListener('click', clickHandleResetBoardButton);
};

const startGame = () => {
  const currentPlayerOne = document.querySelector('#player-one').value;
  const currentPlayerTwo = document.querySelector('#player-two').value;
  ScreenController(currentPlayerOne, currentPlayerTwo);
  getCurrentPlayerName.remove();
};

const getCurrentPlayerName = document.querySelector('form');

getCurrentPlayerName.addEventListener('submit', startGame);
